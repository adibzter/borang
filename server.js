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
  const url = req.body.url;

  // Get form from Google
  let htmlData = await (await axios.get(url)).data;

  // const beautify = require('js-beautify').html;
  // htmlData = beautify(htmlData, { indent_size: 2 });

  res.send(htmlData);
});

app.post('/submit', (req, res) => {
  let body = req.body;
  const formUrl = body.url;
  let counter = +body.counter;
  counter = counter > 100 ? 100 : counter;

  delete body.url;
  delete body.counter;

  body = new URLSearchParams(body).toString();

  for (let i = 0; i < counter; i++) {
    axios({
      method: 'POST',
      url: formUrl,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: body,
    }).catch((err) => {
      console.error('Server at Google hangup');
    });
  }

  const lirik =
    'Tersergam Indah Di Pinggir Desa<br>' +
    'Sekolah Tuanku Ja’afar Tercinta<br>' +
    'Harum Namamu Sentiasa Dipuja<br>' +
    'Lahirkan Insan Bertakwa<br>' +
    'Para Pendidik Tumpahkan Setia<br>' +
    'Turut Segala Bimbingan Mulia<br>' +
    'Berdedikasi Beradap Sopan<br>' +
    'Membentuk Akhlak Teras Kemajuan<br>' +
    'Gigih Berusaha Menimba Ilmu<br>' +
    'Majukan Diri Ke Puncak Jaya<br>' +
    'Maju Didunia Akhirat Jua<br>' +
    'Sempurna Iman dan Cita<br>' +
    'Ayuh Bangsaku Mari Bersama<br>' +
    'Berpadu Tenaga Seia Sekata<br>' +
    'Curahkan Bakti Pada Negara<br>' +
    'Maju Sempurna Selamanya<br><br>' +
    'Lagu: Amirullah Ismail Lirik: M. Yusuf Ghani';

  res.send('<h4>Maju Sempurna</h4>' + lirik);
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('Server running on port', PORT);
});
