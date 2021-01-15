const express = require("express");
const Promotion = require("../models/promotion");
const promotionRouter = express.Router();

promotionRouter
  .route("/")
  .get((req, res, next) => {
    Promotion.find()
      .then((promotions) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(promotions);
      })
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    Promotion.create(req.body)
      .then((promotion) => {
        console.log("promotion Created ", promotion);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(promotion);
      })
      .catch((err) => next(err));
  })
  .put((req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /promotions");
  })
  .delete((req, res, next) => {
    Promotion.deleteMany()
      .then((response) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(response);
      })
      .catch((err) => next(err));
  });

promotionRouter
  .route("/:promotionId")
  .get((req, res, next) => {
    Promotion.findById(req.params.promotionId)
      .then((promotion) => {
        if (promotion) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(promotion);
        } else {
          err = new Error(`Promotion ${req.params.promotionId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    Promotion.findById(req.params.promotionId)
      .then((promotion) => {
        if (promotion) {
          promotion
            .save()
            .then((promotion) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(promotion);
            })
            .catch((err) => next(err));
        } else {
          err = new Error(`Promotion ${req.params.promotionId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .put((req, res) => {
    res.statusCode = 403;
    res.end(
      `PUT operation not supported on /promotions/${req.params.promotionId}/`
    );
  })
  .delete((req, res, next) => {
    Promotion.findById(req.params.promotionId)
      .then((promotion) => {
        Promotion.deleteOne()
          .then((response) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(response);
          })
          .catch((err) => next(err));
      })
      .catch((err) => next(err));
  });

module.exports = promotionRouter;
