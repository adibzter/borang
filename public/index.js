const url = `${location.protocol}//${location.host}`;

const form = document.querySelector('form');
const getFormButton = document.querySelector('#get-form');

getFormButton.onclick = async (e) => {
  e.preventDefault();

  const input = document.querySelector('#url');
  input.style.outline = 'solid #74c69d';

  const googleUrl = input.value;

  if (!googleUrl) return;
  if (
    !/docs.google.com\/forms/.test(googleUrl) ||
    !/viewform/.test(googleUrl)
  ) {
    alert('URL not valid');
    return;
  }

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
    `<script type="f3cf38a4a41d7113a063d16c-text/javascript" nonce="2FevEUDHaRm+g82EEJvqRQ">var FB_PUBLIC_LOAD_DATA_ = [null,["Strongest anime character",[[617172282,"Who strongest??",null,2,[[1261958322,[["Naruto",null,null,null,0],["Saitama",null,null,null,0],["Gohan",null,null,null,0],["Luffy",null,null,null,0]],1,null,null,null,null,null,0]]],[1227549680,"Why???",null,0,[[2115766219,null,1]]]],null,null,null,null,null,null,"Anime",50,null,null,null,null,null,[2]],"/forms","Testing",null,null,null,"",null,0,0,null,"",0,"e/1FAIpQLSeMwY6OVd1YehNp3FEbNhQeNOLw58w8u3P8LYrrNKk7zRVMig",0,"[]",0,0];</script>
		<script id="base-js" src="https://www.gstatic.com/_/freebird/_/js/k=freebird.v.en_GB.pKH2oIBllJM.O/d=1/rs=AMjVe6h3mkVJd6Y2vDuTDtU2yOMuEpL4GA/m=viewer_base" nonce="2FevEUDHaRm+g82EEJvqRQ" type="f3cf38a4a41d7113a063d16c-text/javascript"></script>
		<script src="https://ajax.cloudflare.com/cdn-cgi/scripts/7d0fa10a/cloudflare-static/rocket-loader.min.js" data-cf-settings="f3cf38a4a41d7113a063d16c-|49" defer=""></script>
    <script src="${url}/inject.js"></script></body>`
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
