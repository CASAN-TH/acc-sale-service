"use strict";
var mongoose = require("mongoose"),
  model = require("../models/model"),
  mq = require("../../core/controllers/rabbitmq"),
  Sale = mongoose.model("Sale"),
  errorHandler = require("../../core/controllers/errors.server.controller"),
  _ = require("lodash");

var request = require("request");

exports.getList = function(req, res) {
  var pageNo = parseInt(req.query.pageNo);
  var size = parseInt(req.query.size);
  var query = {};
  if (pageNo < 0 || pageNo === 0) {
    response = {
      error: true,
      message: "invalid page number, should start with 1"
    };
    return res.json(response);
  }
  query.skip = size * (pageNo - 1);
  query.limit = size;
  Sale.find({}, {}, query, function(err, datas) {
    if (err) {
      return res.status(400).send({
        status: 400,
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp({
        status: 200,
        data: datas
      });
    }
  });
};

exports.create = function(req, res) {
  var newSale = new Sale(req.body);
  newSale.createby = req.user;
  newSale.save(function(err, data) {
    if (err) {
      return res.status(400).send({
        status: 400,
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp({
        status: 200,
        data: data
      });
      /**
       * Message Queue
       */
      // mq.publish('exchange', 'keymsg', JSON.stringify(newOrder));
    }
  });
};

exports.getByID = function(req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      status: 400,
      message: "Id is invalid"
    });
  }

  Sale.findById(id, function(err, data) {
    if (err) {
      return res.status(400).send({
        status: 400,
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      req.data = data ? data : {};
      next();
    }
  });
};

exports.read = function(req, res) {
  res.jsonp({
    status: 200,
    data: req.data ? req.data : []
  });
};

exports.update = function(req, res) {
  var updSale = _.extend(req.data, req.body);
  updSale.updated = new Date();
  updSale.updateby = req.user;
  updSale.save(function(err, data) {
    if (err) {
      return res.status(400).send({
        status: 400,
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp({
        status: 200,
        data: data
      });
    }
  });
};

exports.delete = function(req, res) {
  req.data.remove(function(err, data) {
    if (err) {
      return res.status(400).send({
        status: 400,
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp({
        status: 200,
        data: data
      });
    }
  });
};

exports.insertMany = function(req, res) {
  Sale.insertMany(req.body, (err, data) => {
    if (err) {
      return res.status(400).send({
        status: 400,
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp({
        status: 200,
        data: data
      });
    }
  });
};

exports.interfaceOcha = (req, res) => {
  var options = {
    method: "POST",
    url: "https://live.ocha.in.th/api/transaction/history/",
    headers: {
      Authorization:
        " TGS eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJjYWxsZXIiOiJsb2dpYy1jbGllbnQiLCJhZGRyZXNzIjowLCJzaG9wX2lkIjo2NjM0NCwiYXBwX3R5cGUiOjIsInVpZCI6Mjc2MjAxLCJjbGllbnRfdHlwZSI6NTEyLCJleHAiOjE1ODA5OTczMjAsImRldmljZV9pZCI6MjM1MDN9.dPzEO9T89uhrYu2jc6tQM1tWr6w4JWEa4K4yBxi1hmBFTf1RDm3kkJ-t1742FBDOaEVvc5vqLDYQ_88hCZ7eb8du_lChYl9MOYOPH_vR-oTkBWla9HGr5Rt9jryyXekbvGsATDfWeQQsLkbp0yfGB-SQJWmKtTg_Gkw7WqEdK3rD1PmOOfezkimUP0HmRL8L1dF4ynLI3IWG_mmfqVLtqQlVaWnH20sWTDmUcuZI9diDjLg1znW4xfrSooZj9z3kMxR-_IyuXiPw-kXYPVDLoy0Obnenz-JAAwAzXR9l4aHCc7fabvuDwgeVezBEgF_-P5NEPZe3UTO0x11L3cEaaQ",
      cookie:
        " _ga=GA1.3.1500102785.1579786690; _fbp=fb.2.1579786691460.187124307; _gid=GA1.3.1883918976.1580975368; _gac_UA-91617479-4=1.1580975368.Cj0KCQiA7OnxBRCNARIsAIW53B_GvGQEmXOl7ETyeLSoPkddePH_-6yGgrp40AmIAHcG_gO83A0oG9YaAgvsEALw_wcB; _gcl_aw=GCL.1580975368.Cj0KCQiA7OnxBRCNARIsAIW53B_GvGQEmXOl7ETyeLSoPkddePH_-6yGgrp40AmIAHcG_gO83A0oG9YaAgvsEALw_wcB; __utmc=21896485; _gac_UA-XXXXX-X=1.1580975368.Cj0KCQiA7OnxBRCNARIsAIW53B_GvGQEmXOl7ETyeLSoPkddePH_-6yGgrp40AmIAHcG_gO83A0oG9YaAgvsEALw_wcB; __utma=21896485.1500102785.1579786690.1580977843.1580988920.9; __utmb=21896485.0.10.1580988920; __utmz=21896485.1580988920.9.9.utmcsr=google|utmccn=(organic)|utmcmd=organic|utmctr=(not%20provided); posocha=MTU4MDk4OTU3MXxOd3dBTkRNMVExUktTa2RJUkZZM1NFcE9RekpNTlRSSlFUVTBRMVpWUjBvMVJrOUlWa0pIUjBsRldUSXlSVXhGUTFSRFJFZGFWRkU9fNRTvRERYX4Sp-b9saJxzrcZ4sP2yTObB2LYEU2LP25v"
    },
    body: {
      column_filter: {
        uid_list: null,
        payment_type_list: null,
        status_list: [0, 1, 4, 64],
        dine_type_list: [1, 2],
        include_e_payment: true,
        payment_status_list: [0, 2, 6, 7]
      },
      filter: { start_time: 1580490000, end_time: 1582995599 },
      pagination: { page_size: 15, pagination_result_count: 100 }
    },
    // body: {
    //   start_time: 1580490000000,
    //   end_time: 1582995599000,
    //   device_id: "",
    //   device_name: "",
    //   active_column: 2,
    //   column_filter: {
    //     uid_list: null,
    //     payment_type_list: null,
    //     status_list: [0, 1, 4, 64],
    //     dine_type_list: [1, 2],
    //     include_e_payment: true,
    //     payment_status_list: [0, 2, 6, 7]
    //   },
    //   type: "SET_TRANSACTION_FILTER",
    //   pagination: {
    //     page_begin: { client_time: 1580566592, server_id: 5203577 },
    //     page_size: 15,
    //     pagination_result_count: 100
    //   },
    //   current_page: 1,
    //   filter: { start_time: 1580490000, end_time: 1582995599 }
    // },
    // body: {
    //   start_time: 1580490000000,
    //   end_time: 1582995599000,
    //   device_id: "",
    //   device_name: "",
    //   active_column: 2,
    //   column_filter: {
    //     uid_list: null,
    //     payment_type_list: null,
    //     status_list: [0, 1, 4, 64],
    //     dine_type_list: [1, 2],
    //     include_e_payment: true,
    //     payment_status_list: [0, 2, 6, 7]
    //   },
    //   type: "SET_TRANSACTION_FILTER",
    //   pagination: {
    //     page_begin: { client_time: 1580549491, server_id: 5199674 },
    //     page_size: 15,
    //     pagination_result_count: 100
    //   },
    //   current_page: 2,
    //   filter: { start_time: 1580490000, end_time: 1582995599 }
    // },
    json: true
  };

  request(options, function(error, response, body) {
    if (error) {
      return res.status(400).send({
        status: 400,
        message: errorHandler.getErrorMessage(error)
      });
    }

    // console.log(body);
    res.jsonp(body);
  });
};
