var express = require('express');
const jwt = require('jsonwebtoken');
var mongojs = require('mongojs');
var app = express();
var bodyParser = require('body-parser')
const jwt_secret = 'WU5CjF8fHxG40S2t7oyk';

var db = mongojs(process.env.PROD_MONGODB || 'localhost:27017/MRSystem')

var port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static("public"));

app.post('/login', function (req, res) {
  var user = req.body;

  db.users.findOne({ email: user.email, password: user.password }, function (err, user) {
    if (err) {
      throw err;
    } else {
      if (user) {
        var token = jwt.sign({
          name: user.name, surname: user.surname, email: user.email,
          gender: user.gender, age: user.age
        }, jwt_secret, {
            expiresIn: 86400
          });

        res.send({
          success: true,
          message: "Authenticated",
          token: token
        });
      } else {
        res.status(401).send("Credentials are wrong.");
      }
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

app.post('/bookTicket', function (req, res) {
  var token = req.headers['jwt'];
  jwt.verify(token, jwt_secret, function (err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

    db.users.findOne({ email: decoded.email, password: decoded.password }, function (err) {
      var ticket = { name: decoded.name + ' ' + decoded.surname, ticket: req.body.ticketTitle, destination: req.body.ticketDestination, price: req.body.ticketPrice, amount: req.body.ticket };
      db.ticketreservations.insert(ticket, function (err) {
        if (err) { throw err; }
        res.status(403).json({ msg: 'Your reservation is successful!' });
      });
    });
  });
});

app.post('/book', function (req, res) {
  var token = req.headers['jwt'];
  jwt.verify(token, jwt_secret, function (err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

    db.users.findOne({ email: decoded.email, password: decoded.password }, function (err) {
      var hotel = { name: decoded.name + ' ' + decoded.surname, hotel: req.body.hotelName, destination: req.body.destination, checkIn: req.body.checkIn, checkOut: req.body.checkOut, adults: req.body.adults, children: req.body.children, rooms: req.body.room,  price: req.body.price };
      db.hotelreservations.insert(hotel, function (err) {
        if (err) { throw err; }
        res.status(403).json({ msg: 'Your reservation is successful!' });
      });
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
    { destination: 'Bjelašnica', title: '30-Days Adult Ticket', type: 'Monthly', price: '$970', description: ['Bjelašnica', 'Adults(18-64)', '30 Days', 'Unlimited Ski Ride'] },
    { destination: 'Bjelašnica', title: '1-Day Family Ticket', type: 'Family', price: '$155', description: ['Bjelašnica', '1 Day Only', '1 Drink Per Person', 'Unlimited Ski Ride'] },
    { destination: 'Bjelašnica', title: '7-Days Adult Ticket', type: 'Weekly', price: '$499', description: ['Bjelašnica', 'Adults(18-64)', '7 Days', 'Unlimited Ski Ride'] },
    { destination: 'Bjelašnica', title: '1-Day Adult Ticket', type: 'Daily', price: '$80', description: ['Bjelašnica', 'Adults(18-64)', '1 Day Only', 'Unlimited Ski Ride'] },
    { destination: 'Bjelašnica', title: '30-Days Child Ticket', type: 'Monthly', price: '$770', description: ['Bjelašnica', 'Child(7-12)', '30 Days', 'Unlimited Ski Ride'] },
    { destination: 'Bjelašnica', title: '2-Days Family Ticket', type: 'Family', price: '$201', description: ['Bjelašnica', '2 Days', '1 Drink Per Person', 'Unlimited Ski Ride'] },
    { destination: 'Bjelašnica', title: '7-Days Child Ticket', type: 'Weekly', price: '$299', description: ['Bjelašnica', 'Child(7-12)', '7 Days', 'Unlimited Ski Ride'] },
    { destination: 'Bjelašnica', title: '1-Day Child Ticket', type: 'Daily', price: '$47', description: ['Bjelašnica', 'Child(7-12)', '1 Day Only', 'Unlimited Ski Ride'] },
    { destination: 'Bjelašnica', title: '30-Days Senior Ticket', type: 'Monthly', price: '$800', description: ['Bjelašnica', 'Senior(65+)', '30 Days', 'Unlimited Ski Ride'] },
    { destination: 'Bjelašnica', title: '3-Days Family Ticket', type: 'Family', price: '$360', description: ['Bjelašnica', '3 Days', '1 Drink Per Person', 'Unlimited Ski Ride'] },
    { destination: 'Bjelašnica', title: '7-Days Senior Ticket', type: 'Weekly', price: '$353', description: ['Bjelašnica', 'Senior(65+)', '7 Days', 'Unlimited Ski Ride'] },
    { destination: 'Bjelašnica', title: '1-Day Senior Ticket', type: 'Daily', price: '$60', description: ['Bjelašnica', 'Senior(65+)', '1 Day Only', 'Unlimited Ski Ride'] },
    { destination: 'Jahorina', title: '30-Days Adult Ticket', type: 'Monthly', price: '$905', description: ['Jahorina', 'Adults(18-64)', '30 Days', 'Unlimited Ski Ride'] },
    { destination: 'Jahorina', title: '1-Day Family Ticket', type: 'Family', price: '$130', description: ['Jahorina', '1 Day Only', '1 Drink Per Person', 'Unlimited Ski Ride'] },
    { destination: 'Jahorina', title: '7-Days Adult Ticket', type: 'Weekly', price: '$462', description: ['Jahorina', 'Adults(18-64)', '7 Days', 'Unlimited Ski Ride'] },
    { destination: 'Jahorina', title: '1-Day Adult Ticket', type: 'Daily', price: '$74', description: ['Jahorina', 'Adults(18-64)', '1 Day Only', 'Unlimited Ski Ride'] },
    { destination: 'Jahorina', title: '30-Days Child Ticket', type: 'Monthly', price: '$749', description: ['Jahorina', 'Child(7-12)', '30 Days', 'Unlimited Ski Ride'] },
    { destination: 'Jahorina', title: '2-Days Family Ticket', type: 'Family', price: '$188', description: ['Jahorina', '2 Days', '1 Drink Per Person', 'Unlimited Ski Ride'] },
    { destination: 'Jahorina', title: '7-Days Child Ticket', type: 'Weekly', price: '$270', description: ['Jahorina', 'Child(7-12)', '7 Days', 'Unlimited Ski Ride'] },
    { destination: 'Jahorina', title: '1-Day Child Ticket', type: 'Daily', price: '$41', description: ['Jahorina', 'Child(7-12)', '1 Day Only', 'Unlimited Ski Ride'] },
    { destination: 'Jahorina', title: '30-Days Senior Ticket', type: 'Monthly', price: '$780', description: ['Jahorina', 'Senior(65+)', '30 Days', 'Unlimited Ski Ride'] },
    { destination: 'Jahorina', title: '3-Days Family Ticket', type: 'Family', price: '$333', description: ['Jahorina', '3 Days', '1 Drink Per Person', 'Unlimited Ski Ride'] },
    { destination: 'Jahorina', title: '7-Days Senior Ticket', type: 'Weekly', price: '$327', description: ['Jahorina', 'Senior(65+)', '7 Days', 'Unlimited Ski Ride'] },
    { destination: 'Jahorina', title: '1-Day Senior Ticket', type: 'Daily', price: '$48', description: ['Jahorina', 'Senior(65+)', '1 Day Only', 'Unlimited Ski Ride'] },
    { destination: 'Vlašić', title: '30-Days Adult Ticket', type: 'Monthly', price: '$889', description: ['Vlašić', 'Adults(18-64)', '30 Days', 'Unlimited Ski Ride'] },
    { destination: 'Vlašić', title: '1-Day Family Ticket', type: 'Family', price: '$122', description: ['Vlašić', '1 Day Only', '1 Drink Per Person', 'Unlimited Ski Ride'] },
    { destination: 'Vlašić', title: '7-Days Adult Ticket', type: 'Weekly', price: '$451', description: ['Vlašić', 'Adults(18-64)', '7 Days', 'Unlimited Ski Ride'] },
    { destination: 'Vlašić', title: '1-Day Adult Ticket', type: 'Daily', price: '$73', description: ['Vlašić', 'Adults(18-64)', '1 Day Only', 'Unlimited Ski Ride'] },
    { destination: 'Vlašić', title: '30-Days Child Ticket', type: 'Monthly', price: '$728', description: ['Vlašić', 'Child(7-12)', '30 Days', 'Unlimited Ski Ride'] },
    { destination: 'Vlašić', title: '2-Days Family Ticket', type: 'Family', price: '$185', description: ['Vlašić', '2 Days', '1 Drink Per Person', 'Unlimited Ski Ride'] },
    { destination: 'Vlašić', title: '7-Days Child Ticket', type: 'Weekly', price: '$264', description: ['Vlašić', 'Child(7-12)', '7 Days', 'Unlimited Ski Ride'] },
    { destination: 'Vlašić', title: '1-Day Child Ticket', type: 'Daily', price: '$36', description: ['Vlašić', 'Child(7-12)', '1 Day Only', 'Unlimited Ski Ride'] },
    { destination: 'Vlašić', title: '30-Days Senior Ticket', type: 'Monthly', price: '$759', description: ['Vlašić', 'Senior(65+)', '30 Days', 'Unlimited Ski Ride'] },
    { destination: 'Vlašić', title: '3-Days Family Ticket', type: 'Family', price: '$340', description: ['Vlašić', '3 Days', '1 Drink Per Person', 'Unlimited Ski Ride'] },
    { destination: 'Vlašić', title: '7-Days Senior Ticket', type: 'Weekly', price: '$323', description: ['Vlašić', 'Senior(65+)', '7 Days', 'Unlimited Ski Ride'] },
    { destination: 'Vlašić', title: '1-Day Senior Ticket', type: 'Daily', price: '$45', description: ['Vlašić', 'Senior(65+)', '1 Day Only', 'Unlimited Ski Ride'] },
  ];
  db.tickets.insert(myobj, function (err, res) {
    if (err) throw err;
    console.log("Number of documents inserted: " + res.insertedCount);
  });
});

app.listen(port, function () {
  console.log('Example app listening on port ' + port);
});