const express = require('express');
const path = require('path');
const exphbs  = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');

const app = express();

// Load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

// Passport config
require('./config/passport')(passport);

// DB config
const db = require('./config/database');

// Connect to mongoose

// The `useMongoClient` option is no longer necessary in mongoose 5.x, please remove it.
// mongoose.connect('mongodb://localhost/vidjot-dev', {useMongoClient: true}); 
// mongoose.connect('mongodb://localhost/vidjot-dev')
mongoose.connect(db.mongoURI)
  .then(() => {
    console.log('MongoDb connected...');
  })
  .catch(err => console.log(err));

// Handlebars Middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// How middleware works
// app.use(function(req, res, next) {
//   // console.log(Date.now());
//   // req.name = 'Peter van Dijk';
//   next();
// });

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Method override middleware
app.use(methodOverride('_method'));

// Express session middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}))

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
})

// Index Route
app.get('/', (req, res) => {
  const title = "Welcome";
  res.render('index', {title: title})

});

// About Route
app.get('/about', (req, res) => {
  res.render('about');
})

// Use routes
app.use('/ideas', ideas);
app.use('/users', users);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});