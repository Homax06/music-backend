const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});



db.connect(err => {
  if (err) {
    console.error('❌ Ошибка подключения:', err);
    return;
  }
  console.log('✅ База данных подключена');
});
// Заказы
app.post('/api/orders', (req, res) => {
  const { customer_name, phone, address, items } = req.body;

  if (!customer_name || !phone || !address || !items) {
    return res.status(400).send('Заполните все поля');
  }

  const sql = 'INSERT INTO orders (customer_name, phone, address, items) VALUES (?, ?, ?, ?)';
  db.query(sql, [customer_name, phone, address, JSON.stringify(items)], (err) => {
    if (err) {
      console.error('❌ Ошибка MySQL:', err);
      return res.status(500).send('Ошибка сервера');
    }
    res.send('Заказ успешно оформлен');
  });
});

// Получить все товары (БЕЗ фильтрации)
app.get('/api/instruments', (req, res) => {
  db.query('SELECT * FROM instruments', (err, results) => {
    if (err) return res.status(500).send('Ошибка при получении товаров');
    res.json(results);
  });
});
// Получение всех заказов
app.get('/api/orders', (req, res) => {
  db.query('SELECT * FROM orders ORDER BY created_at DESC', (err, results) => {
    if (err) return res.status(500).send('Ошибка получения заказов');
    res.json(results);
  });
});
app.get('/api/support', (req, res) => {
  db.query('SELECT * FROM support_messages ORDER BY created_at DESC', (err, results) => {
    if (err) {
      console.error('Ошибка получения жалоб:', err);
      return res.status(500).send('Ошибка получения жалоб');
    }
    res.json(results);
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен: http://localhost:${PORT}`);
});
