const express = require('express');
const app = express();
const cors = require('cors');
const port = 5000;
const striperoutes = require('./Routes/stripe-route');

// Import database initialization function
const initializeDatabase = require('./db');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to update global.foodData for each request
app.use((req, res, next) => {
    initializeDatabase((err, data, CatData) => {
        if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
            return;
        }
        global.foodData = data;
        global.foodCategory = CatData;
        next();
    });
});

// Routes
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/api/auth', require('./Routes/Auth'));
app.use('/api/stripe', striperoutes);

app.listen(port, () => {
    console.log(`Example app listening on http://localhost:${port}`);
});
