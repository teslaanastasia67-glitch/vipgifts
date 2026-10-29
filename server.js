const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DB_FILE = path.join(__dirname, 'orders.json');

app.use(express.json());
app.use(express.static(__dirname)); // раздаёт ваш сайт

// Чтение базы заказов
function getOrders() {
    if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, '[]');
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8') || '[]');
}

// Сохранение базы заказов
function saveOrders(orders) {
    fs.writeFileSync(DB_FILE, JSON.stringify(orders, null, 2));
}

// 1. Клиент отправляет заказ
app.post('/api/orders', (req, res) => {
    const orders = getOrders();
    const newOrder = req.body;
    newOrder.id = 'LG-' + Date.now().toString(36).toUpperCase();
    newOrder.status = 'new';
    newOrder.createdAt = new Date().toISOString();
    orders.unshift(newOrder);
    saveOrders(orders);
    res.json(newOrder);
});

// 2. Мастер запрашивает все заказы
app.get('/api/orders', (req, res) => {
    res.json(getOrders());
});

// 3. Мастер меняет статус заказа
app.put('/api/orders/:id', (req, res) => {
    const orders = getOrders();
    const index = orders.findIndex(o => o.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Не найден' });
    
    orders[index].status = req.body.status;
    orders[index].updatedAt = new Date().toISOString();
    saveOrders(orders);
    res.json(orders[index]);
});

// Запуск
app.listen(PORT, () => {
    console.log('====================================');
    console.log('СЕРВЕР ЗАПУЩЕН!');
    console.log('Открывайте сайт по ссылке: http://localhost:3000');
    console.log('====================================');
});