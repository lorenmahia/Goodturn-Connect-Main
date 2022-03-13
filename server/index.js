const express = require('express');
const cors = require('cors');
//const http = require('http');

const authRoutes = require("./routes/auth.js");

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors({
    credentials: 'true',
    optionSuccessStatus:200,
}));
app.use(express.json());
app.use(express.urlencoded());

app.get('/', (req, res) => {
    console.log('Hello');
    res.send('Hello, World!');
});



app.use('/auth', authRoutes);


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));