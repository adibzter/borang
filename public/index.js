const url = `${location.protocol}//${location.host}`;

const getFormButton = document.querySelector('#get-form');

getFormButton.onclick = async (e) => {
  e.preventDefault();

  const googleUrl = document.querySelector('#url').value;
  let htmlData = await getForm(url, googleUrl);

  htmlData = scriptInjection(htmlData);
  download(htmlData);

  return false;
};

async function getForm(url, googleUrl) {
  const response = await fetch(url + '/form', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `url=${googleUrl}`,
  });
  return response.text();
}

function scriptInjection(htmlData) {
  const host = location.host;
  htmlData = htmlData.replace(
    '</body>',
    `<script src="${url}/inject.js"></script></body>`
  );
  return htmlData;
}

function download(htmlData) {
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = 'data:text/html;charset=utf-8,' + encodeURIComponent(htmlData);
  a.download = 'desperate_' + Date.now();
  document.body.appendChild(a);

  a.click();

  setTimeout(() => {
    document.body.removeChild(a);
  }, 1000);
}
