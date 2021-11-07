const path = require('path');

const express = require('express');
const axios = require('axios').default;

const app = express();

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// Homepage
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public/index.html'));
});

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
    console.log('Cannot create form');
  }
});

app.post('/submit', async (req, res) => {
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  let body = req.body;
  const formUrl = body.url;
  let counter = body.counter;

  if (!formUrl) {
    res.send(
      'Something went wrong. If you are using mobile, please use desktop.'
    );
    return;
  }

  try {
    await axios.post(formUrl);
  } catch (err) {
    res.send("Form require login. We don't support this feature.");
    return;
  }

  console.log(`Form URL: ${formUrl}`);

  limit = 15;
  counter = +counter || 1;
  counter = counter > limit ? limit : counter;

  // Send response immediately so connection can be closed
  res.header('Connection', 'close');
  res.send(
    `${counter} form(s) sent. I need to limit this to ${counter} since too many unimportant Google form has been submitted such as Anime & Kpop. Server is not free. I need to pay for it. Hope you understand.`
  );

  delete body.url;
  delete body.counter;

  try {
    body = new URLSearchParams(body).toString();
  } catch (err) {
    console.error('Cannot convert body to url search params');
    return;
  }

  for (let i = 0; i < counter; i++) {
    try {
      axios({
        method: 'POST',
        url: formUrl,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: body,
      });
      await wait(10);
    } catch (err) {
      console.error('Server at Google hangup');
      break;
    }
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('Server running on port', PORT);
});
