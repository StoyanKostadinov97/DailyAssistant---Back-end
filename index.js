const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const BudgetItem = require('./db/model/budget-item');
const { mongoose } = require('./db/mongoose');
const User = require('./db/model/user-model');
const jwt = require('./jwt');
const auth = require('./auth');




const app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:4200"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(express.json());

app.use(bodyParser.json());
app.use(cookieParser());



app.get('/api/hello', function (req, res) {
  res.send({ message: 'Hello World is new' });

})
app.get('/', function (req, res) {
  res.send("Hello from home")
})

/**
 * Budgeting GET & POST & DELETE
 */

app.get('/api/budgets', auth, function (req, res, next) {
  const _userId = req.user._id;
  BudgetItem.find({ _userId }).then((items) => {
    res.send(items);
  })
    .catch(e => {
      console.log(e);
    })

});

app.post('/api/budgets', auth, function (req, res, next) {
  const price = req.body.price;
  const from = req.body.from;
  const about = req.body.about;
  const date = req.body.date;
  const _userId = req.user._id;


  return BudgetItem
    .create({ price, from, about, date, _userId })
    .catch(e => {
      console.log(e);
    });
});

app.delete('/api/budgets/:id', function (req, res) {
  BudgetItem
    .findByIdAndDelete({
      _id: req.params.id
    })
    .then((deleted) => {
      res.send(deleted);
    })
    .catch(e => {
      console.log(e);
    })
})


/**
 * User login & register
 */

//Only for testing
app.get('/api/user', function (req, res, next) {
  User.find({}).then((result) => {
    res.send(result);
  });
})

app.post('/api/register', function (req, res, next) {

  const { email, password } = { ...req.body };
  const username = email;

  User
    .findOne({ email })
    .then((user) => {

      if (user) {
        throw new Error('The given email is already in use...');
      }

      return User
        .create({ username, email, password })
        .catch((e) => console.log(e))
    })

    .catch((e) => {
      console.log(e);
    });

})

app.post('/api/login', function (req, res, next) {

  const { email, password } = req.body;

  User
    .findOne({ email })
    .then((user) => {
      return Promise.all([
        user.comparePasswords(password),
        user,
      ])
    })
    .then(([isPasswordsMatched, user]) => {
      if (!isPasswordsMatched) {
        throw new Error('The provided password does not matched.');
      }

      const token = jwt.createToken(user._id);

      res
        .status(200)
        .cookie("x-token", token, { maxAge: 360000, httpOnly: true })
        .send(user);

    })
    .catch((e) => {
      console.log(e);
    })

});

app.get('/api/logout', function (req, res, next) {
  res
    .clearCookie("x-token")
    .send({ message: 'Logged out' });
})
app.listen(3000, () => {
  console.log('Listenning on port 3000')
});