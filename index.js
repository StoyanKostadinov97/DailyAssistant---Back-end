const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const { mongoose } = require('./db/mongoose');
const BudgetItem = require('./db/model/budget-item');
const LinkItem = require('./db/model/link-item');
const ShoppingItem = require('./db/model/shop-item');
const User = require('./db/model/user-model');
const CalendarTask = require('./db/model/calendar-task');
const jwt = require('./jwt');
const auth = require('./auth');


const app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:4200"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, PATCH, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());


app.get('/', function (req, res) {
  res.send("Hello from server")
})


/**
 * 
 * Calendar
 * 
 */

app.post('/api/task', auth, function (req, res, next) {
  const title = req.body.title;
  const from = req.body.from;
  const to = req.body.to;
  const date = req.body.date;
  const description = req.body.description;
  const _userId = req.user._id;


  return CalendarTask
    .create({ title, from, to, date, description, _userId })
    .catch(e => {
      console.log(e);
    });
});

app.get('/api/task', auth, function (req, res, next) {
  const _userId = req.user._id;
  CalendarTask.find({ _userId }).then((items) => {
    res.send(items);
  })
    .catch(e => {
      console.log(e);
    })

});




/**
 * 
 * Budgeting GET & POST & DELETE
 * 
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
  const date = new Date(req.body.date);
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
});



/**
 * 
 * Links GET & POST & DELETE
 * 
 */

app.get('/api/links', auth, function (req, res, next) {
  const _userId = req.user._id;
  LinkItem.find({ _userId }).then((items) => {
    res
      .status(200)
      .send(items);
  })
    .catch(e => {
      console.log(e);
    })
});

app.post('/api/links', auth, function (req, res, next) {
  const title = req.body.title;
  const views = req.body.views;
  const description = req.body.description === undefined
    ? ''
    : req.body.description;
  const link = req.body.link;
  const _userId = req.user._id;


  return LinkItem
    .create({ title, views, link, description, _userId })
    .catch(e => {
      console.log(e);
    });
});

app.delete('/api/links/:id', function (req, res) {
  LinkItem
    .findByIdAndDelete({
      _id: req.params.id
    })
    .then((deleted) => {
      res.send(deleted);
    })
    .catch(e => {
      console.log(e);
    })
});

app.patch('/api/links/:id',auth,function(req,res,next){
  const id=req.params.id;
  LinkItem
  .findById({_id:id})
  .then((finded)=>{
    finded.views++;
    console.log(finded);
    finded.save();
  })
  .catch((e)=>{
    console.log(e);
  })
});



/**
 *
 * Shopping Items  
 *
 */

//   GET ALL SHOPPING ITEMS
// app.get('/api/shopping',function (req, res, next) {
// 
//   ShoppingItem.find({ }).then((items) => {
//     res.send(items);
//   })
//     .catch(e => {
//       console.log(e);
//     })

// });

app.get('/api/shopping', auth, function (req, res, next) {
  const _userId = req.user._id;
  ShoppingItem.find({ _userId }).then((items) => {
    res.send(items);
  })
    .catch(e => {
      console.log(e);
    })

});

app.post('/api/shopping', auth, function (req, res, next) {
  const productName = req.body.productName;
  const isDone = req.body.isDone;
  const _userId = req.user._id;


  return ShoppingItem
    .create({ productName, isDone, _userId })
    .catch(e => {
      console.log(e);
    });
});

app.delete('/api/shopping/:id', function (req, res) {
  ShoppingItem
    .findByIdAndDelete({
      _id: req.params.id
    })
    .then((deleted) => {
      res.send(deleted);
    })
    .catch(e => {
      console.log(e);
    })
});




/**
 * User login & register
 */

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
        .then(() => {
          res.status(200)
          next();
        })
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
        .cookie("x-token", token, { maxAge: 1800000, httpOnly: true })
        .send(user);

    })
    .catch(next)

});

app.get('/api/logout', function (req, res, next) {
  res
    .clearCookie("x-token")
    .send({ message: 'Logged out' });
})



/**
 * 
 * Only for testing
 * 
 */


//Only for testing
app.get('/api/user', function (req, res, next) {
  User.find({}).then((result) => {
    res.send(result);
  });
})
//For delete 
app.get('/api/userDel', function (req, res, next) {
  User.deleteMany({}).then((result) => {
    console.log(res);
    // res.send(result);
  });
})
//Only for testing
app.get('/api/taskDel', function (req, res, next) {
  CalendarTask.deleteMany({}).then((result) => {
    // console.log(res);
    res.status(200);
    // res.send(result);
  });
})


app.listen(3000, () => {
  console.log('Listenning on port 3000')
});