const LocalStrategy = require('passport-local').Strategy
const User = require('../models').User
const bcrypt = require('bcrypt-nodejs')
const jwt = require('jsonwebtoken');
const config = require('../config');


// expose this function to our app using module.exports
module.exports = function (passport) {


  // LOCAL SIGNUP ============================================================
  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local'

  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    session: false,
    passReqToCallback: true // allows us to pass back the entire request to the callback
  }, function (req, email, password, done) {
    User.findOne({
      where: {
        email: email
      }
    }).then(function (user) {
      // check to see if theres already a user with that username
      if (user) {
        return done({ message: "email already exists"})
      } else {
        User.create({
          email: req.body.email,
          password: generateHash(req.body.password),
          firstName: req.body.firstName,
          lastName: req.body.lastName
        }).then(function (newUser) {
          console.log(newUser.get())
          if (!newUser) {
            return done({ message: "cannot process the data entry"})
          }
          return done(null)
        })
      }
    })
  }))

  // LOCAL LOGIN =============================================================
  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local'

  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    session: false,
    passReqToCallback: true // allows us to pass back the entire request to the callback
  }, function (req, email, password, done) { // callback with email and password from our form
    // we are checking to see if the user trying to login already exists
    User.findOne({
      where: {
        email: email
      }
    }).then(function(user) {

      // if no user is found, return the message
      if (!user)
        return done({ name: "IncorrectCredentialsError", message : "Incorrect email"})

      // if the user is found but the password is wrong
      if (!validPassword(password, user.password))
        return done({ name: "IncorrectCredentialsError", message : "Incorrect password"})

      const token = jwt.sign({ sub: user.id, expiry: new Date().getMonth() }, config.jwtSecret);
      // all is well, return successful user
      return done(null, token, user.get())
    })
  }))
}

var generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8))
}

var validPassword = function (password, dbPassword) {
  return bcrypt.compareSync(password, dbPassword)
}
