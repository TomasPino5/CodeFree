const express = require('express')
const app = express()
const path = require('path');
const port = 3000

app.use(express.json());

app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
  res.redirect(`/inicio`)
})

app.get('/inicio', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/views/home/index.html'));
});

app.get('/javascript', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/views/js/js.html'));
});

app.get('/htmlcss', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/views/htmlcss/htmlcss.html'));
});

app.get('/python', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/views/python/python.html'));
});

app.get('/sql', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/views/sql/sql.html'));
});

app.get('/typescript', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/views/typescript/typescript.html'));
});

app.get('/java', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/views/java/java.html'));
});

app.get('/javascript/node.js', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/views/js/node/node.html'));
});

app.get('/javascript/react', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/views/js/react/react.html'));
});

app.get('/otros', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/views/other/other.html'));
});

app.get('/search', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/views/search/search.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})