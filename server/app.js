const express = require('express')
const app = express()
const path = require('path');
const port = 3000

app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
  res.redirect(`http://localhost:${port}/inicio`)
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

app.get('/bashshell', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/views/bashshell/bashshell.html'));
});

app.get('/java', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/views/java/java.html'));
});

app.get('/csharp', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/views/csharp/csharp.html'));
});

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})