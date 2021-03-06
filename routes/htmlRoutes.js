// Requiring path to use relative routes to our HTML files
const path = require('path');
const db = require('../models');
const { Op } = require('sequelize');

module.exports = function (app) {
  // Load index page
  app.get('/', function (req, res) {
    res.render('index');
  });

  // Load login page
  app.get('/loginpage', function (req, res) {
    res.render('loginpage');
  });

  // Load movieDetailsPage
  app.get('/moviedetailspage/:id', function (req, res) {
    const responseObj = {};
    db.Movie.findOne({
      where: {
        id: req.params.id,
      },
    }).then(function (movieResults) {
      responseObj.movie = movieResults.dataValues;
      db.UserReview.findAll({
        where: {
          movieId: req.params.id,
        },
      }).then(function (userRevResults) {
        console.log('USER REVIEW RESULTS');
        console.log(userRevResults);
        // responseObj.reviews = JSON.stringify(userRevResults);
        responseObj.reviews = userRevResults;
        console.log('responseObj', responseObj);
        res.render('moviedetailspage', responseObj);
      });
    });
  });

  // Load spooky move list
  app.get('/spookymovies', function (req, res) {
    db.Movie.findAll({
      where: {
        spookyRating: {
          [Op.between]: [3, 5],
        },
      },
    }).then(function (results) {
      console.log(results);
      let responseData = {};
      responseData.movies = results;
      responseData.spooky = true;
      console.log(responseData.movies[1].dataValues);
      res.render('movie-list', responseData);
    });
    // res.json({spooky: true})
  });

  // Load halloween movie list
  app.get('/halloweenmovies', function (req, res) {
    db.Movie.findAll({
      where: {
        halloween: 1,
      },
    }).then(function (results) {
      let responseData = {};
      responseData.movies = results;
      responseData.halloween = true;
      //   console.log(responseData.movies[1].dataValues);
      res.render('movie-list', responseData);
    });
  });
};
