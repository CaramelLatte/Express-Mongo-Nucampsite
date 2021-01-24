const express = require("express");
const Favorite = require("../models/favorite");
const authenticate = require("../authenticate");
const cors = require("./cors");

const favoriteRouter = express.Router();

favoriteRouter
  .route("/")
  .options(cors.corsWithOptions, authenticate.verifyUser, (req, res) =>
    res.sendStatus(200)
  )
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorite.find({ user: req.user._id })
      .populate("User")
      .populate("Campsite")
      .then((favorite) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(favorite);
      })
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id }).then((favorite) => {
      if (favorite) {
        req.body.forEach((fave) => {
          if (!favorite.campsite.includes(fave._id)) {
            favorite.campsite.push(fave);
          }
        });
        favorite.save().then((favorite) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(favorite);
        });
      } else {
        console.log(req.body);
        Favorite.create(req.body);
        fave.save((err, favorite) => {
          if (err) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({ err: err });
            return;
          }
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(favorite);
        });
      }
    });
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.sendStatus = 403;
    res.setHeader("Content-Type", "text-plain");
    res.end("Put request is not supported.");
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOneAndDelete({ user: req.user._id }).then((fave) => {
      if (fave) {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(fave);
      } else {
        res.setHeader("Content-Type", "text-plain");
        res.end("You do not have any favorites to delete.");
      }
    });
  });

favoriteRouter
  .route("/:campsiteId")
  .options(cors.corsWithOptions, authenticate.verifyUser, (req, res) =>
    res.sendStatus(200)
  )
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    res.sendStatus = 403;
    res.setHeader("Content-Type", "text-plain");
    res.end("Get request to /:campsiteId is not supported.");
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id }).then((favorite) => {
      if (favorite) {
        if (favorite.campsite.includes(req.params.campsiteId)) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "text-plain");
          res.end("This campsite is already in the list of favorites");
        } else {
          favorite.campsite.push(req.params.campsiteId);
          favorite.save().then((favorite) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(favorite);
          });
        }
      } else {
        Favorite.create({
          user: req.user._id,
          campsite: req.params.campsiteId
        }).then((favorite) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(favorite);
        });
      }
    });
  })

  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.sendStatus = 403;
    res.setHeader("Content-Type", "text-plain");
    res.end("Put request to /:campsiteId is not supported.");
  })
  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    (req, res, next) => {
      Favorite.findOne({user: req.user._id}).then((favorite) => {
        if (favorite) {
          if(favorite.campsite.includes(req.params.campsiteId)){
          favorite.campsite.splice(favorite.campsite.indexOf(req.params.campsiteId, 1));
          } else {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text-plain');
            res.end("This campsite isn't in your favorites document");
          }
          favorite.save()
          .then((favorite) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(favorite);
          })
          
        } else {
          res.setHeader('Content-Type', 'text-plain');
          res.end("There is no favorite document to delete");
        }
      });
    }
  );

module.exports = favoriteRouter;
