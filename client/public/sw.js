self.addEventListener('fetch', async function (event) {
  if (event.request.url.startsWith('https://www.gstatic.com')) {
    event.respondWith(fetchWithParamAddedToRequestBody(event.request));
  } else {
    event.respondWith(fetch(event.request));
  }
});

async function fetchWithParamAddedToRequestBody(request) {
  const serialized = await serialize(request);
  // modify serialized.body here to add your request parameter
  request = await deserialize(serialized);

  return fetchWithProxy(request);
}
function serialize(request) {
  var headers = {};
  for (var entry of request.headers.entries()) {
    headers[entry[0]] = entry[1];
  }
  var serialized = {
    url: request.url,
    headers: headers,
    method: request.method,
    // mode: request.mode,
    mode: 'same-origin',
    credentials: request.credentials,
    cache: request.cache,
    redirect: request.redirect,
    referrer: request.referrer,
  };
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return request
      .clone()
      .text()
      .then(function (body) {
        serialized.body = body;
        return Promise.resolve(serialized);
      });
  }
  return Promise.resolve(serialized);
}
function deserialize(data) {
  const url = '/api/proxies';
  // const url = `http://localhost:1111/post`;
  // const url = `http://localhost:5000/post`;
  //   const url = `https://proxy.skrin.xyz`;
  return Promise.resolve(
    new Request(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        request: data,
      }),
    })
  );
  //   return Promise.resolve(new Request(data.url, data));
}

async function fetchWithProxy(request) {
  return await fetch(request);
}
