export const urlState = {
  setQuery,
  getQueryPar,
};

function setQuery(name, value) {
  const url = new URL(window.location.href);
  let params = new URLSearchParams(url.search.slice(1));

  params.set(name, value);

  var stateObj = {
    Title: '',
    Url: `${url.origin}?${params}`,
  };

  window.history.pushState(stateObj, stateObj.Title, stateObj.Url);
}

function getQueryPar(name) {
  const params = new URLSearchParams(document.location.search.substring(1));
  return params.get(name);
}
