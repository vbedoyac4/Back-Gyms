const express = require('express');
const morgan = require('morgan');
const path = require('path');
const exphbs = require('express-handlebars');
const session = require('express-session');
const validator = require('express-validator');
const passport = require('passport');
const flash = require('connect-flash');
const MySQLStore = require('express-mysql-session')(session);
const bodyParser = require('body-parser');
const cors = require('cors');
const https = require ('https');
const fs = require('fs');


const { database } = require('./keys');

// Intializations
const app = express();
require('./lib/passport');

 //https.createServer({
  //   key: fs.readFileSync('server.key'),
   //  cert: fs.readFileSync('server.cert')
  // }, app).listen(3000, () => {
  //   console.log('Listening...')
// });


// Settings
app.set('port', process.env.PORT || 3000);

// Middlewares
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
    secret: 'fitsked',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(cors())
app.options('*', cors());
//app.use(validator());

// Global variables
app.use((req, res, next) => {
    app.locals.message = req.flash('message');
    app.locals.success = req.flash('success');
    app.locals.user = req.user;
    next();
});

// Routes
app.use(require('./routes/index'));
app.use('/app',require('./routes/app'));
app.use(require('./routes/authentication'));
app.use('/entrenamientos', require('./routes/entrenamiento'));
app.use('/review', require('./routes/review'));
app.use('/compra', require('./routes/compra'));
app.use('/pago', require('./routes/pagos'));


// Public
app.use(express.static(path.join(__dirname, 'public')));

// Starting

//https.createServer({}, app).listen(3000, () => {
//    console.log('Listening...')
//})

 //https.createServer({}, (app.get('port'), () =>{
  //   console.log('Server on port', app.get('port'));
//}));

app.listen(app.get('port'), () => {  console.log('Server on port', app.get('port'));
});