require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Buyer = require('./models/Buyer');
const PORT = process.env.PORT || 3500;

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('static'));

// Adatbázis csatlakozás
mongoose.connect(process.env.MONGO_URI, (err) => {
  if (err) return console.log(err);
  console.log('Csatlakoztunk!');
});

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/buyer', (req, res) => {
  res.render('buyer');
});

app.post('/buyer', async (req, res) => {
  try {
    const { buyerId, nev, cim } = req.body;
    const newBuyer = new Buyer({ buyerId, nev, cim });
    await newBuyer.save();
    res.redirect('/buyers');
  } catch (error) {
    console.log(error.message);
  }
});

app.get('/buyers', async (req, res) => {
  try {
    const buyers = await Buyer.find();
    res.render('buyers', { buyers });
  } catch (error) {
    console.log(error.message);
  }
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
