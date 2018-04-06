var express = require('express')
var app = express()

var db = require('./models')

var morgan = require('morgan')
var bodyParser = require('body-parser')
var methodOverride = require('method-override')

var passport = require('passport')

var port = process.env.PORT || 8080

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
app.use(passport.session()) // persistent login sessions

// HTML routes ======================================================================
require('./routes/html-routes.js')(app, passport) // load our routes and pass in our app and fully configured passport

// API routes
require('./routes/api-routes.js')(app, passport) 


require('./config/passport')(passport) // pass passport for configuration

db.sequelize.sync()
  .then(function () {
    app.listen(port, function () {
      console.log('App listening on PORT ' + port)
    })
  })
