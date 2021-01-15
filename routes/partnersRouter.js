const express = require("express");
const Partner = require("../models/partner");
const partnerRouter = express.Router();

partnerRouter
  .route("/")
  .get((req, res, next) => {
    Partner.find()
      .then((partners) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(partners);
      })
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    Partner.create(req.body)
      .then((partner) => {
        console.log("partner Created ", partner);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(partner);
      })
      .catch((err) => next(err));
  })
  .put((req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /partners");
  })
  .delete((req, res, next) => {
    Partner.deleteMany()
      .then((response) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(response);
      })
      .catch((err) => next(err));
  });

partnerRouter
  .route("/:partnerId")
  .get((req, res, next) => {
    Partner.findById(req.params.partnerId)
      .then((partner) => {
        if (partner) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(partner);
        } else {
          err = new Error(`Partner ${req.params.partnerId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    Partner.findById(req.params.partnerId)
      .then((partner) => {
        if (partner) {
          partner
            .save()
            .then((partner) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(partner);
            })
            .catch((err) => next(err));
        } else {
          err = new Error(`Partner ${req.params.partnerId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .put((req, res) => {
    res.statusCode = 403;
    res.end(
      `PUT operation not supported on /partners/${req.params.partnerId}/`
    );
  })
  .delete((req, res, next) => {
    Partner.findById(req.params.partnerId)
      .then((partner) => {
        Partner.deleteOne()
          .then((response) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(response);
          })
          .catch((err) => next(err));
      })
      .catch((err) => next(err));
  });

module.exports = partnerRouter;
