"""Split a DSM into chunks by watershed"""

import os
import math
from string import Template
from shapely.geometry import shape, MultiPolygon
import fiona
import numpy as np
import rasterio
import rasterio.mask

SHP_DEST = 'data/shp/single/'
TIF_DEST = 'data/tif/single/'

def flood_fill(c, r, mask):
    """
    Crawls a mask array containing only 1 and 0 values from the starting point (c=column, r=row - a.k.a. x,y) and returns an array with all 1 values connected to the starting cell. This algorithm performs a 4-way check non-recursively.
    """
    # cells already filled
    filled = set()

    # cells to fill
    fill = set()
    fill.add((c, r))
    width = mask.shape[1] - 1
    height = mask.shape[0] - 1

    # Our output inundation array
    flood = np.zeros_like(mask, dtype=np.int8)

    # Loop through and modify the cells which need to be checked.
    while fill:
        # Grab a cell
        x, y = fill.pop()
        if y == height or x == width or x < 0 or y < 0:
            # Don't fill
            continue
        if mask[y][x] == 1:
            # Do fill
            flood[y][x] = 1
            filled.add((x, y))

            # Check neighbors for 1 values
            west = (x - 1, y)
            east = (x + 1, y)
            north = (x, y - 1)
            south = (x, y + 1)
            if not west in filled:
                fill.add(west)
            if not east in filled:
                fill.add(east)
            if not north in filled:
                fill.add(north)
            if not south in filled:
                fill.add(south)
    return flood

def getRemovedBuildings(year, shed):
    watershed = shape(shed)
    with fiona.open('data/shp/buildings.shp') as b_source:
        print 'Filtering buildings to ' + str(year)
        buildings = MultiPolygon([shape(b['geometry']) for b in b_source if b['properties']['FirstYear'] <= year and b['properties']['LastYear'] >= year])

        print 'Clipping buildings to watershed'
        buildings_shed = buildings.intersection(watershed)
        with fiona.open('data/shp/buildings_test2.shp', 'w', driver='ESRI Shapefile', schema=b_source.schema) as w:
            w.writerecords(buildings_shed)

with fiona.open('data/shp/watersheds.shp') as source:
    FEATURES = [feature for feature in source]

    with rasterio.open('data/tif/dsm.tif') as src:
        print 'DSM successfully read'
        for f in FEATURES:
            getRemovedBuildings(1950, f['geometry'])
            N = f['properties']['WS_ID']
            if os.path.isfile(SHP_DEST + N + '.json'):
                print 'File ' + N + ' already exists. Skipping.'
            else:
                print 'Masking basin ' + N
                out_image, out_transform = rasterio.mask.mask(src, [f['geometry']], crop=True)
                out_meta = src.meta.copy()
                out_meta.update({'driver': 'GTiff',
                                 'height': out_image.shape[1],
                                 'width': out_image.shape[2],
                                 'dtype': 'int16',
                                 'nodata': 255,
                                 'transform': out_transform})

                # Search the image array for lowest value that isn't nodata
                print 'Searching for min of basin ' + N
                nodata = np.amin(out_image)
                lowest = np.amin(out_image[out_image != nodata])
                start = max(0, int(math.ceil(lowest / 5) * 5))
                print 'Lowest elevation is ' + str(lowest)
                print 'Starting with a flood of ' + str(start)

                lowest_loc = np.where(out_image == lowest)
                sx = lowest_loc[2][0]
                sy = lowest_loc[1][0]
                print 'Lowest location is ' + str(sx) + ', ' + str(sy)

                for e in range(start, 31, 5):
                    e = max(e, 1)
                    a = np.where((out_image <= e) & (out_image != nodata), 1, 0)
                    print "Beginning flood fill for " + str(e)
                    fld = flood_fill(sx, sy, a[0])
                    fld = np.where(fld == 1, e, 0)
                    print "Finished Flood fill"

                    tif_file = TIF_DEST + N + '-' + str(e) + '.tif'
                    json_file = SHP_DEST + N + '-' + str(e) + '.json'
                    with rasterio.open(tif_file, 'w', **out_meta) as dest:
                        dfld = fld.reshape((1,) + fld.shape)
                        dest.write(dfld.astype('int16'))

                    polygonize = Template('gdal_polygonize.py -mask ${t} -f GeoJSON ${t} ${j}')
                    os.system(polygonize.substitute(t=tif_file, j=json_file))

                mapshaper = Template('mapshaper -i ${shp}${n}-*.json combine-files -simplify 0.5 no-repair -merge-layers -o ${shp}${n}.json')
                os.system(mapshaper.substitute(shp=SHP_DEST, n=N))
                print 'Merged file ' + N
