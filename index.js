var express = require('express');
const jwt = require('jsonwebtoken');
var mongojs = require('mongojs');
var app = express();
var bodyParser = require('body-parser')
const TOP_SECRET = 'hamdijagasejva';

var db = mongojs('mongodb://localhost:27017/MRSystem')

var port = process.env.PROD_MONGODB || 3000;

app.use(bodyParser.json());
app.use(express.static("public"));

app.post('/login', function (req, res) {
  db.users.findOne({ email: req.body.email, password: req.body.password }, function (err, user) {
    if (err) { throw err; }
    if (!user) {
      res.status(403).json({ msg: 'Wrong e-mail or password!' });
    } else if (user.email === req.body.email && user.password === req.body.password) {
      var token = jwt.sign({ email: req.body.email, name: user.name }, TOP_SECRET, {
        expiresIn: 86400 // expires in 24 hours
      });
      res.send(token);
    } else {
      res.status(403).json({ msg: 'User not found!' });
    }
  });
});

app.post('/register', function (req, res) {

  var user = { name: req.body.name, surname: req.body.surname, email: req.body.email, address: req.body.address, gender: req.body.gender, phone: req.body.phone, age: req.body.age, password: req.body.password, confirm_password: req.body.cpassword };
  db.users.insert(user, function (err) {
    if (err) { throw err; }
    res.status(403).json({ msg: 'You are registered now!' });
  });
});

app.post('/book', function (req, res) {
  db.users.findOne({}, function (err) {
    var hotel = { checkIn: req.body.checkIn, checkOut: req.body.checkOut, adults: req.body.adults, children: req.body.children, rooms: req.body.rooms };
    db.reservations.insert(hotel, function (err) {
      if (err) { throw err; }
      res.status(403).json({ msg: 'Your reservation is successful!' });
    });
  });
});

app.get('/hotels', function (req, res) {
  var start = parseInt(req.query.start ? req.query.start : 0);
  var limit = parseInt(req.query.limit ? req.query.limit : 10);

  db.hotels.find({}).limit(limit).skip(start, function (err, docs) {
    res.json(docs);
  });
});

app.get('/tickets', function (req, res) {
  var start = parseInt(req.query.start ? req.query.start : 0);
  var limit = parseInt(req.query.limit ? req.query.limit : 10);

  db.tickets.find({}).limit(limit).skip(start, function (err, docs) {
    res.json(docs);
  });
});

app.get('/insert', function () {
  var myobj = [
    { title: '30-Days Adult Ticket', type: 'Monthly', price: '$970', description: ['Adults(18-64)', '30 Days', 'Unlimited Ski Ride'] },
    { title: '1-Day Family Ticket', type: 'Family', price: '$155', description: ['1 Day Only', '1 Drink Per Person', 'Unlimited Ski Ride'] },
    { title: '7-Days Adult Ticket', type: 'Weekly', price: '$499', description: ['Adults(18-64)', '7 Days', 'Unlimited Ski Ride'] },
    { title: '1-Day Adult Ticket', type: 'Daily', price: '$80', description: ['Adults(18-64)', '1 Day Only', 'Unlimited Ski Ride'] },
    { title: '30-Days Child Ticket', type: 'Monthly', price: '$770', description: ['Child(7-12)', '30 Days', 'Unlimited Ski Ride'] },
    { title: '2-Days Family Ticket', type: 'Family', price: '$201', description: ['2 Days', '1 Drink Per Person', 'Unlimited Ski Ride'] },
    { title: '7-Days Child Ticket', type: 'Weekly', price: '$299', description: ['Child(7-12)', '7 Days', 'Unlimited Ski Ride'] },
    { title: '1-Day Child Ticket', type: 'Daily', price: '$47', description: ['Child(7-12)', '1 Day Only', 'Unlimited Ski Ride'] },
    { title: '30-Days Senior Ticket', type: 'Monthly', price: '$800', description: ['Senior(65+)', '30 Days', 'Unlimited Ski Ride'] },
    { title: '3-Days Family Ticket', type: 'Family', price: '$360', description: ['3 Days', '1 Drink Per Person', 'Unlimited Ski Ride'] },
    { title: '7-Days Senior Ticket', type: 'Weekly', price: '$353', description: ['Senior(65+)', '7 Days', 'Unlimited Ski Ride'] },
    { title: '1-Day Senior Ticket', type: 'Daily', price: '$60', description: ['Senior(65+)', '1 Day Only', 'Unlimited Ski Ride'] },
  ];
  db.tickets.insert(myobj, function (err, res) {
    if (err) throw err;
    console.log("Number of documents inserted: " + res.insertedCount);
  });
});

app.listen(port, function () {
  console.log('Example app listening on port ' + port);
});