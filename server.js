const path = require('path');

const express = require('express');
const axios = require('axios').default;
const compression = require('compression');

const app = express();

// Middlewares
app.use(express.json({ limit: '4mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(compression({ level: 9, memLevel: 9 }));

// Homepage
app.get('/', (req, res) => {
  if (req.hostname === 'desperate.skrin.xyz') {
    res.redirect(301, 'https://borang.skrin.xyz');
  } else {
    res.sendFile(path.resolve(__dirname, 'public/index.html'));
  }
});

app.use(express.static('public'));

// New form
app.post('/form', async (req, res) => {
  try {
    const url = req.body.url;

    // Get form from Google
    let htmlData = await (await axios.get(url)).data;

    // const beautify = require('js-beautify').html;
    // htmlData = beautify(htmlData, { indent_size: 2 });

    res.send(htmlData);
  } catch (err) {
    const string = 'Cannot create form';
    console.log(string);
    res.send(string);
  }
});

app.post('/submit', async (req, res) => {
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  let body = req.body;
  const formUrl = body.url;
  let counter = body.counter;
  const fromExtension = body.fromExtension;

  if (!formUrl) {
    res.send(
      'Something went wrong. If you are using mobile, please use desktop.'
    );
    return;
  }

  console.log(`Form URL: ${formUrl}`);

  limit = 15;
  counter = +counter || 1;

  if (!body.fromExtension) {
    counter = counter > limit ? limit : counter;
  }

  delete body.url;
  delete body.counter;
  delete body.fromExtension;
  delete body.dlut;

  // Extract checkboxes
  const checkboxes = {};
  for (let name in body) {
    const value = body[name];

    if (Array.isArray(value)) {
      checkboxes[name] = value;
      delete body[name];
    }
  }

  try {
    body = new URLSearchParams(body);

    // Add checkboxes data into body
    for (let name in checkboxes) {
      const checkbox = checkboxes[name];
      for (let value of checkbox) {
        body.append(name, value);
      }
    }
    body = body.toString();
  } catch (err) {
    res.send('Error: Cannot convert body to url search params');
    return;
  }

  // Test if form need auth
  try {
    await postData(formUrl, body);
  } catch (err) {
    if (err.response.status === 401) {
      res.send("Error: Form require login. We don't support this feature.");
    } else {
      res.send('Error: Cannot post data');
    }
    return;
  }

  // Request from chrome extension
  const urls = {
    duitnow: 'https://storage.googleapis.com/sejarah-bot/duitnow.png',
    subscribeYoutube: 'https://www.youtube.com/c/kiraa?sub_confirmation=1',
    extensionChromeStore:
      'https://chrome.google.com/webstore/detail/borang/mokcmggiibmlpblkcdnblmajnplennol',
    serverRepo: 'https://github.com/ADIBzTER/borang',
    extensionRepo: 'https://github.com/ADIBzTER/borang-chrome-extension',
  };
  if (fromExtension) {
    res.send(`
		<input type="hidden" id="formUrl" value="${formUrl}">
		<input type="hidden" id="counter" value="${counter}">
		<input type="hidden" id="body" value="${body}">
		<h3>Can you do me a favour by subscribing my <a href="${urls.subscribeYoutube}" target="_blank">YouTube channel</a>?</h3>
		
		<p>
		${counter} form(s) submitted but it might not reach the server yet. Wait for 1 minute before closing this tab.
		<br><br>
		Since you are using Borang Chrome extension, you can submit unlimited form in the same time. But if you send too many, your PC might freeze.
		<br><br>
		Do not forget to give this extension 5 stars on <a href="${urls.extensionChromeStore}" target="_blank">Chrome Web Store</a>
		<br><br>
		This is an open-source project. Feel free to contribute and learn the code.
		<br>
		Server repo: <a href="${urls.serverRepo}">${urls.serverRepo}</a>
		<br>
		Chrome Extension repo: <a href="${urls.extensionRepo}">${urls.extensionRepo}</a>
		</p>

		<br/>
		<p>If you are from Malaysia, you can support me by donating through my DuitNow QR :)</p>
		<img src="${urls.duitnow}" alt="duitnow-qr"/>
		`);
    return;
  }

  // counter - 1 because we already sent 1 data above
  for (let i = 0; i < counter - 1; i++) {
    try {
      postData(formUrl, body);
      await wait(10);
    } catch (err) {
      console.error('Server at Google hangup');
      res.send(`${i + 1} forms sent. Error occured.`);
      return;
    }
  }

  res.send(
    `${counter} form(s) sent. I need to limit this to ${limit} since too many unimportant Google form has been submitted such as Anime & Kpop. Server is not free. I need to pay for it. Hope you understand.\n
		<br><br>
		Use <a href="${urls.extensionChromeStore}" target="_blank">Borang Chrome Extension</a> for unlimited form submission and better support. Don't forget to give Borang Chrome Extension 5 stars <a href="https://chrome.google.com/webstore/detail/borang/mokcmggiibmlpblkcdnblmajnplennol">here</a>
		<br><br>
		This is an open-source project. Feel free to contribute and learn the code.
		<br>
		Server repo: <a href="${urls.serverRepo}">${urls.serverRepo}</a>
		<br>
		Chrome Extension repo: <a href="${urls.extensionRepo}">${urls.extensionRepo}</a>

		<br/>
		<p>If you are from Malaysia, you can support me by donating through my DuitNow QR :)</p>
		<img src="${urls.duitnow}" alt="duitnow-qr"/>
		`
  );
});

async function postData(formUrl, body) {
  return await axios({
    method: 'POST',
    url: formUrl,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: body,
  });
}

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('Server running on port', PORT);
});
