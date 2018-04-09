const express = require('express')
const app = express()

const db = require('./models')

const morgan = require('morgan')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

const passport = require('passport')

const port = process.env.PORT || 8080

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public'))

// log every request to the console
app.use(morgan('dev'))

// simulate DELETE and PUT
app.use(methodOverride())

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// required for passport
app.use(passport.initialize())

require('./config/passport')(passport) // pass passport for configuration

const authCheckMiddleware = require('./middleware/auth-check');
app.use('/api', authCheckMiddleware);

// routes
const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');
const openRoutes = require('./routes/open');

app.use('/auth', authRoutes);
app.use('/api', apiRoutes);
app.use('/open', openRoutes);


db.sequelize.sync()
  .then(function () {
    app.listen(port, function () {
      console.log('App listening on PORT ' + port)
    })
  })
