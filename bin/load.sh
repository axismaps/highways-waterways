createdb highways
psql -c "CREATE EXTENSION postgis;" -d highways
shp2pgsql -Id -s 4326 data/shp/buildings.shp buildings | psql -d highways
shp2pgsql -Id -s 4326 data/shp/watersheds.shp watersheds | psql -d highways