const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

// Храним заказы и отзывы в памяти сервера (из-за ограничений Render)
let orders = [];
let reviews = [];
let users = []; // Для регистрации

// --- ПОЛЬЗОВАТЕЛИ ---
app.get('/api/users', (req, res) => res.json(users));

app.post('/api/users', (req, res) => {
    const newUser = req.body;
    if (users.find(u => u.login === newUser.login)) {
        return res.status(400).json({ error: 'Логин занят' });
    }
    users.push(newUser);
    res.json(newUser);
});

// --- ОТЗЫВЫ ---
app.get('/api/reviews', (req, res) => res.json(reviews));

app.post('/api/reviews', (req, res) => {
    const newReview = req.body;
    newReview.date = new Date().toLocaleDateString('ru-RU');
    reviews.unshift(newReview);
    res.json(newReview);
});

// --- ЗАКАЗЫ ---
app.get('/api/orders', (req, res) => res.json(orders));

app.post('/api/orders', (req, res) => {
    const newOrder = req.body;
    newOrder.id = 'LG-' + Date.now().toString(36).toUpperCase();
    newOrder.status = 'new';
    newOrder.createdAt = new Date().toISOString();
    orders.unshift(newOrder);
    res.json(newOrder);
});

app.put('/api/orders/:id', (req, res) => {
    const index = orders.findIndex(o => o.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Не найден' });
    orders[index].status = req.body.status;
    res.json(orders[index]);
});

app.listen(PORT, () => {
    console.log('СЕРВЕР ЗАПУЩЕН! http://localhost:' + PORT);
});
