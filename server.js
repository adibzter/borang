const path = require('path');
const { randomUUID } = require('node:crypto');

const express = require('express');
const axios = require('axios').default;
const compression = require('compression');

const app = express();
app.disable('x-powered-by');

// Middlewares
app.use(express.json({ limit: '4mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(compression({ level: 9, memLevel: 9 }));

// API endpoint
app.use('/api/users', require('./routes/usersRoute'));
app.use('/api/subscriptions', require('./routes/subscriptionsRoute'));
app.use('/api/files', require('./routes/filesRoute'));
app.use('/api/proxies', require('./routes/proxiesRoute'));

// Webhook endpoint
app.use('/webhook/stripe', require('./webhooks/stripe'));

app.use(express.static('./client/dist'));

const formDataStore = {};
app.post('/submit', async (req, res) => {
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  let body = req.body;
  const formUrl = body.url;
  let counter = body.counter;
  const fromExtension = body.fromExtension;

  if (!formUrl) {
    res.send(
      'Something went wrong. Contact us on <a href="https://discord.gg/rGkPJju9zD">Discord</a>'
    );
    return;
  }

  console.log(`Form URL: ${formUrl}`);

  let limit = 500;
  let waitTime = 20; // ms
  counter = +counter || 1;

  // if (!body.fromExtension) {
  //   counter = counter > limit ? limit : counter;
  // }
  // counter = counter > limit ? limit : counter;

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

  const formId = randomUUID();
  formDataStore[formId] = {
    formUrl,
    limit,
    counter,
    body,
    waitTime,
  };

  if (fromExtension) {
    res.redirect(`/_submit?id=${formId}`);
    return;
  } else {
    res.status(200).send(`
      <script>
        parent.location.href = '/_submit?id=${formId}';
      </script>
    `);
    return;
  }

  // TODO: Use this implementation to handle external proxies to avoid being blocked by google
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
});

// GET /api/forms/:id
app.get('/api/forms/:id', (req, res) => {
  const formData = formDataStore[req.params.id];
  if (!formData) {
    res.status(404).json({ message: 'Form Data not found' });
  }

  res.json(formData);
});

// DELETE /api/forms/:id
app.delete('/api/forms/:id', (req, res) => {
  delete formDataStore[req.params.id];

  res.json({ message: `Deleted ${req.params.id}` });
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
