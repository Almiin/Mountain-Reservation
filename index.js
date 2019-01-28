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

        res.status(200).json({
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
  });
});

app.post('/bookTicket', function (req, res) {
  var token = req.headers['jwt'];
  jwt.verify(token, jwt_secret, function (err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

    db.users.findOne({ email: decoded.email, password: decoded.password }, function (err) {
      var ticket = { name: decoded.name + ' ' + decoded.surname, ticket: req.body.ticketTitle, destination: req.body.ticketDestination, price: req.body.ticketPrice, amount: req.body.ticket, checkIn: req.body.checkIn };
      db.ticketreservations.insert(ticket, function (err) {
        if (err) { throw err; }
      });
    });
  });
});

app.post('/book', function (req, res) {
  var token = req.headers['jwt'];
  jwt.verify(token, jwt_secret, function (err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

    db.users.findOne({ email: decoded.email, password: decoded.password }, function (err) {
      var hotel = { name: decoded.name + ' ' + decoded.surname, hotel: req.body.hotelName, destination: req.body.destination, checkIn: req.body.checkIn, checkOut: req.body.checkOut, adults: req.body.adults, children: req.body.children, rooms: req.body.room, price: req.body.price, img: req.body.img };
      db.hotelreservations.insert(hotel, function (err) {
        if (err) { throw err; }
      });
    });
  });
});

app.get('/hotels', function (req, res) {
  var start = parseInt(req.query.start ? req.query.start : 0);
  var limit = parseInt(req.query.limit ? req.query.limit : 20);

  db.hotels.find({}).limit(limit).skip(start, function (err, docs) {
    res.json(docs);
  });
});

app.get('/tickets', function (req, res) {
  var start = parseInt(req.query.start ? req.query.start : 0);
  var limit = parseInt(req.query.limit ? req.query.limit : 20);

  db.tickets.find({}).limit(limit).skip(start, function (err, docs) {
    if (err) { throw err; }
    res.json(docs);
  });
});

app.get('/hotelreservations', function (req, res) {
  var token = req.headers['jwt'];
  jwt.verify(token, jwt_secret, function (err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    db.hotelreservations.find({ name: decoded.name + ' ' + decoded.surname }, function (err, docs) {
      res.json(docs);
    })
  })
});

app.get('/ticketreservations', function (req, res) {
  var token = req.headers['jwt'];
  jwt.verify(token, jwt_secret, function (err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    db.ticketreservations.find({ name: decoded.name + ' ' + decoded.surname }, function (err, docs) {
      res.json(docs);
    })
  })
});

app.delete('/hotelreservations/:id', function (req, res) {
  var id = req.params.id;
  db.hotelreservations.remove({ _id: mongojs.ObjectId(id) }, function (err, doc) {
    res.json(doc);
  });
});

app.delete('/ticketreservations/:id', function (req, res) {
  var id = req.params.id;
  db.ticketreservations.remove({ _id: mongojs.ObjectId(id) }, function (err, doc) {
    res.json(doc);
  });
});

app.get('/users', function (req, res) {
  var token = req.headers['jwt'];
  jwt.verify(token, jwt_secret, function (err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    db.users.find({ email: decoded.email }, function (err, docs) {
      res.setHeader("Content-Type", "application/json");
      res.json(docs);
    })
  })
});

app.get('/users/:id', function (req, res) {
  var id = req.params.id;
  db.users.findOne({ _id: mongojs.ObjectId(id) }, function (err, doc) {
    res.json(doc);
  });
});

app.put('/users/:id', function (req, res) {
  var id = req.params.id;
  db.users.findAndModify({
    query: { _id: mongojs.ObjectId(id) },
    update: { $set: { name: req.body.name, surname: req.body.surname, email: req.body.email, address: req.body.address, gender: req.body.gender, phone: req.body.phone, age: req.body.age } },
    new: true
  }, function (err, doc) {
    res.json(doc);
  })
});

app.listen(port, function () {
  console.log('App listening on port ' + port);
});