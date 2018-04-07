const LocalStrategy = require('passport-local').Strategy
const User = require('../models').User
const bcrypt = require('bcrypt-nodejs')
const jwt = require('jsonwebtoken');
const config = require('../config');


// expose this function to our app using module.exports
module.exports = function (passport) {

  // passport session setup ==================================================
  // required for persistent login sessions
  // passport needs ability to serialize and unserialize users out of session

  // used to serialize the user for the session
  passport.serializeUser(function (user, done) {
    done(null, user.id)
  })

  // used to deserialize the user
  passport.deserializeUser(function (id, done) {
    User.findById(id).then(function (user) {
      if (user) {
        done(null, user.get())
      } else {
        done(user.errors, null)
      }
    })
  })

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
        return done(null, false, { message: "username already exists"}) 
      } else {
        User.create({
          email: req.body.email,
          password: generateHash(req.body.password),
          firstName: req.body.firstName,
          lastName: req.body.lastName
        }).then(function (newUser) {
          if (!newUser) {
            return done(null, false)
          }
          if (newUser) {
            return done(null, newUser)
          }
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
      //console.log(user)

      // if no user is found, return the message
      if (!user)
        return done(null, false, { message : "Incorrect email"}) 

      // if the user is found but the password is wrong
      if (!validPassword(password, user.password))
        return done(null, false, { message : "Incorrect password"}) 
        
      const token = jwt.sign(payload, config.jwtSecret);
      console.log(user.get())
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
