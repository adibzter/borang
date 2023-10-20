const path = require('path');

const express = require('express');
const axios = require('axios').default;
const compression = require('compression');

const app = express();

// Middlewares
app.use(express.json({ limit: '4mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(compression({ level: 9, memLevel: 9 }));

app.use(express.static('./client/dist'));

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

  let limit = 5000;
  let waitTime = 20; // ms
  counter = +counter || 1;

  // if (!body.fromExtension) {
  //   counter = counter > limit ? limit : counter;
  // }
  counter = counter > limit ? limit : counter;

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
  //   try {
  //     await postData(formUrl, body);
  //   } catch (err) {
  //     if (err.response.status === 401) {
  //       res.send("Error: Form require login. We don't support this feature.");
  //     } else {
  //       res.send('Error: Cannot post data');
  //     }
  //     return;
  //   }

  // Request from chrome extension
  const urls = {
    stripe: 'https://donate.stripe.com/7sI5kZ22L78C8xy28c',
    duitnow: 'https://storage.googleapis.com/sejarah-bot/duitnow.png',
    subscribeYoutube: 'https://www.youtube.com/c/kiraa?sub_confirmation=1',
    extensionChromeStore:
      'https://chrome.google.com/webstore/detail/borang/mokcmggiibmlpblkcdnblmajnplennol',
    serverRepo: 'https://github.com/ADIBzTER/borang',
    extensionRepo: 'https://github.com/ADIBzTER/borang-chrome-extension',
  };
  if (fromExtension) {
    res.send(`
		<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3634416280129603" crossorigin="anonymous"></script>
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-5FWGPJDJGR"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'G-5FWGPJDJGR');
    </script>

    <style>
        section {
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        div.logo {
            border: 1.5px solid black;
            width: 190px;
            border-radius: 5px;
            margin: auto;
        }

        div.logo>img {
            width: 60px;
            height: 60px;
            object-fit: contain;
        }
    </style>
			<link rel="stylesheet" href="bootstrap.min.css">
			<script src="bootstrap.min.js"></script>

			<title>Borang | Submit</title>
		</head>

		<body>
			<input type="hidden" id="formUrl" value="${formUrl}">
			<input type="hidden" id="counter" value="${counter}">
			<input type="hidden" id="body" value="${body}">
			<input type="hidden" id="waitTime" value="${waitTime}">
	 <section>
        <div class="container">
            <div>
                <div class="d-flex align-items-center justify-content-center logo py-1 mb-5">
                    <img src="Borang.jpg" alt="">
                    <h2>Borang</h2>
                </div>
            </div>
            <div class="card p-3">
                <div>
                    <h3 class="bg-warning p-2 rounded-2">Can you do me a favour by subscribing my <a
                            href="${urls.subscribeYoutube}" target="_blank">YouTube
                            channel</a>?
                    </h3>

                    <p>
                        ${counter} form(s) submitted but it might not reach the server yet. Wait for 1 minute before
                        closing
                        this tab.
                        <br>
                        Please share about this extension to media social with hashtag <b>#borang</b> and tell them what
                        you
                        use
                        this
                        extension for.
                        <br><br>
                        We are limiting response to ${limit} to reduce payment for server. After we get a good amount of
                        donation, we
                        will
                        lift the limit.
                        <br><br>
                        Do not forget to give this extension 5 stars on <a href="${urls.extensionChromeStore}"
                            target="_blank">Chrome
                            Web
                            Store</a>
                        <br><br>
                        This is an open-source project. Feel free to contribute and learn the code.
                        <br>
                        Server repo: <a href="${urls.serverRepo}">${urls.serverRepo}</a>
                        <br>
                        Chrome Extension repo: <a href="${urls.extensionRepo}">${urls.extensionRepo}</a>
                    </p>

                    <div class="d-flex justify-content-between">
                        <div></div>
                        <button type="button" class="btn btn-primary" data-bs-toggle="modal"
                            data-bs-target="#donate-modal">
                            Donate Now
                        </button>
                        <button type="button" class="btn btn-primary" onclick="privacyPolicy()">
                            Privacy Policy
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>
			<div class="modal fade" id="donate-modal" tabindex="-1" data-bs-backdrop="static" aria-labelledby="donate-modal"
				aria-hidden="true">
				<div class="modal-dialog modal-dialog-centered">
					<div class="modal-content">
						<div class="modal-header">
							<h1 class="modal-title fs-5">Donation</h1>
							<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
						</div>
						<div class="modal-body" style="text-align: center">
							<p>
								Your form has been submitted. Help us to maintain this project by donating as low as $2. The more is better.
							</p>
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-primary" onclick="donate()">Donate</button>
							<button type="button" class="btn btn-primary" onclick="showQr()">DuitNow QR (Malaysia)</button>
						</div>
					</div>
				</div>
			</div>

			<script>
				window.onload = e => {
					let donateModal = document.querySelector('#donate-modal');
					donateModal = new bootstrap.Modal(donateModal);
					setTimeout(() => donateModal.show(), 5000);
				}

				function donate() {
					window.open('${urls.stripe}', '_blank').focus();
				}

				function showQr() {
					window.open('/qr', '_blank').focus();
				}

				function privacyPolicy() {
					window.open('/privacy', '_blank').focus();
				}
			</script>
		</body>
		`);
    return;
  }

  // counter - 1 because we already sent 1 data above | UPDATE: remove -1 due because we don't send 1 data anymore
  // for (let i = 0; i < counter - 1; i++) {
  for (let i = 0; i < counter; i++) {
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

// Homepage
app.get('*', (req, res) => {
  if (req.hostname === 'desperate.skrin.xyz') {
    res.redirect(301, 'https://borang.skrin.xyz');
  } else {
    res.sendFile(path.resolve(__dirname, './client/dist/index.html'));
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('Server running on port', PORT);
});
