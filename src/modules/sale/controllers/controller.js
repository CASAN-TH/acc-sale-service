"use strict";
var mongoose = require("mongoose"),
  model = require("../models/model"),
  mq = require("../../core/controllers/rabbitmq"),
  Sale = mongoose.model("Sale"),
  errorHandler = require("../../core/controllers/errors.server.controller"),
  _ = require("lodash");

var request = require("request");

const fetch = require("node-fetch");

const authKey =
  " TGS eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJjYWxsZXIiOiJsb2dpYy1jbGllbnQiLCJhZGRyZXNzIjowLCJzaG9wX2lkIjo2NjM0NCwiYXBwX3R5cGUiOjIsInVpZCI6Mjc2MjAxLCJjbGllbnRfdHlwZSI6NTEyLCJleHAiOjE1ODEwNzg2MTMsImRldmljZV9pZCI6MjM1MDN9.Oz1kTynYMkmSxOpc8wrPiAPSqE0AFqSFC7h1qSjsLTsBVXrQiPkSxxaqUiNTP16W5_9W_CU8kpGFNK1VrV_b7ZpSrn0QfLtUuozipyYqxcVklYn2WExV5x2y-bPKvju13Qtkyq7y9_L3Jyxkf54IC_O0z0Odv6kXi3TWh_-02jhOeoHnSH1c1ry0IgpLf7krFIEMvAxCCj4CvAFYwOjf9uYPd6hQ6evfuUNCNxfX5ZmK55cfi9bH2_8PQYYNmJ5AlYwLOvtgsA-Yku5ZgRxCIFqF3kdsy4kJbRfqGvx2zX_ZHnuoYXQZVrW6MorValugcUZ3HXBoQ0y9uNKdMoAYfQ";
const cookie =
  " _ga=GA1.3.1500102785.1579786690; _fbp=fb.2.1579786691460.187124307; _gid=GA1.3.1076144380.1580998410; __utmc=21896485; __utma=21896485.1500102785.1579786690.1580998410.1581067799.2; __utmb=21896485.0.10.1581067799; __utmz=21896485.1581067799.2.2.utmcsr=google|utmccn=(organic)|utmcmd=organic|utmctr=(not%20provided); posocha=MTU4MTA2OTY2N3xOd3dBTkVWSk0xbEdWbEJYUkRKTFVUSkNWVkpNUVUxR1VVVXpUVkZCUTBsRFQwYzBVVWMxUTFGU1YxWlFSVXhVUkV0TlRUVkZOa0U9fP99StM-IOv3vhXJnjdiJsmt6c43AiuMxZ17cdbXmCEB";

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

exports.getOchaShopList = (req, res) => {
  var options = {
    method: "POST",
    url: "https://live.ocha.in.th/api/shop/branch/get/",
    headers: {
      Authorization: authKey,
      // " TGS eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJjYWxsZXIiOiJsb2dpYy1jbGllbnQiLCJhZGRyZXNzIjowLCJzaG9wX2lkIjo2NjM0NCwiYXBwX3R5cGUiOjIsInVpZCI6Mjc2MjAxLCJjbGllbnRfdHlwZSI6NTEyLCJleHAiOjE1ODA5OTczMjAsImRldmljZV9pZCI6MjM1MDN9.dPzEO9T89uhrYu2jc6tQM1tWr6w4JWEa4K4yBxi1hmBFTf1RDm3kkJ-t1742FBDOaEVvc5vqLDYQ_88hCZ7eb8du_lChYl9MOYOPH_vR-oTkBWla9HGr5Rt9jryyXekbvGsATDfWeQQsLkbp0yfGB-SQJWmKtTg_Gkw7WqEdK3rD1PmOOfezkimUP0HmRL8L1dF4ynLI3IWG_mmfqVLtqQlVaWnH20sWTDmUcuZI9diDjLg1znW4xfrSooZj9z3kMxR-_IyuXiPw-kXYPVDLoy0Obnenz-JAAwAzXR9l4aHCc7fabvuDwgeVezBEgF_-P5NEPZe3UTO0x11L3cEaaQ",
      cookie: cookie
      // " _ga=GA1.3.1500102785.1579786690; _fbp=fb.2.1579786691460.187124307; _gid=GA1.3.1076144380.1580998410; __utma=21896485.1500102785.1579786690.1580998410.1580998410.1; __utmc=21896485; __utmz=21896485.1580998410.1.1.utmcsr=google|utmccn=(organic)|utmcmd=organic|utmctr=(not%20provided); posocha=MTU4MTAwMDczNXxOd3dBTkVWSk0xbEdWbEJYUkRKTFVUSkNWVkpNUVUxR1VVVXpUVkZCUTBsRFQwYzBVVWMxUTFGU1YxWlFSVXhVUkV0TlRUVkZOa0U9fF5QWmAzvNGOwRIVH4gKjf5oYT6KblFGINLfX02Kk9_A"
    },
    body: { branch_list_info_version: 0 },
    json: true
  };

  request(options, function(error, response, body) {
    if (error) {
      return res.status(400).send({
        status: 400,
        message: errorHandler.getErrorMessage(error)
      });
    }
    // console.log(body.shops);
    res.jsonp(body.shops);
  });
};

exports.selectOchaShop = async (req, res) => {
  // console.log(req.body);
  var options = {
    method: "POST",
    url: "https://live.ocha.in.th/api/auth/branch/",
    headers: {
      Authorization: authKey,
      // " TGS eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJjYWxsZXIiOiJsb2dpYy1jbGllbnQiLCJhZGRyZXNzIjowLCJzaG9wX2lkIjo2NjM0NCwiYXBwX3R5cGUiOjIsInVpZCI6Mjc2MjAxLCJjbGllbnRfdHlwZSI6NTEyLCJleHAiOjE1ODA5OTczMjAsImRldmljZV9pZCI6MjM1MDN9.dPzEO9T89uhrYu2jc6tQM1tWr6w4JWEa4K4yBxi1hmBFTf1RDm3kkJ-t1742FBDOaEVvc5vqLDYQ_88hCZ7eb8du_lChYl9MOYOPH_vR-oTkBWla9HGr5Rt9jryyXekbvGsATDfWeQQsLkbp0yfGB-SQJWmKtTg_Gkw7WqEdK3rD1PmOOfezkimUP0HmRL8L1dF4ynLI3IWG_mmfqVLtqQlVaWnH20sWTDmUcuZI9diDjLg1znW4xfrSooZj9z3kMxR-_IyuXiPw-kXYPVDLoy0Obnenz-JAAwAzXR9l4aHCc7fabvuDwgeVezBEgF_-P5NEPZe3UTO0x11L3cEaaQ",
      cookie: cookie
      // " _ga=GA1.3.1500102785.1579786690; _fbp=fb.2.1579786691460.187124307; _gid=GA1.3.1076144380.1580998410; __utma=21896485.1500102785.1579786690.1580998410.1580998410.1; __utmc=21896485; __utmz=21896485.1580998410.1.1.utmcsr=google|utmccn=(organic)|utmcmd=organic|utmctr=(not%20provided); posocha=MTU4MTAwMDczNXxOd3dBTkVWSk0xbEdWbEJYUkRKTFVUSkNWVkpNUVUxR1VVVXpUVkZCUTBsRFQwYzBVVWMxUTFGU1YxWlFSVXhVUkV0TlRUVkZOa0U9fF5QWmAzvNGOwRIVH4gKjf5oYT6KblFGINLfX02Kk9_A"
    },
    body: req.body, //{ branch_shop_id: req.shop_id }
    json: true
  };

  request(options, function(error, response, body) {
    if (error) {
      return res.status(400).send({
        status: 400,
        message: errorHandler.getErrorMessage(error)
      });
    }
    let result = {
      posocha: response.headers["set-cookie"]
        .toString()
        .split(";")[0]
        .replace("posocha=", "")
    };

    res.jsonp(result);
  });
};

exports.interfaceOcha = (req, res) => {
  // console.log(req.body);

  var body = {
    column_filter: {
      uid_list: null,
      payment_type_list: null,
      status_list: [0, 1, 4, 64],
      dine_type_list: [1, 2],
      include_e_payment: true,
      payment_status_list: [0, 2, 6, 7]
    },
    filter: req.body.filter,
    pagination: req.body.pagination
  };

  var options = {
    method: "POST",
    url: "https://live.ocha.in.th/api/transaction/history/",
    headers: {
      Authorization: authKey,
      cookie: ` _ga=GA1.3.1500102785.1579786690; _fbp=fb.2.1579786691460.187124307; _gid=GA1.3.1076144380.1580998410; __utma=21896485.1500102785.1579786690.1580998410.1580998410.1; __utmc=21896485; __utmz=21896485.1580998410.1.1.utmcsr=google|utmccn=(organic)|utmcmd=organic|utmctr=(not%20provided); posocha=${req.body.posocha}`
    },
    body: body,
    json: true
  };

  request(options, function(error, response, body) {
    if (error) {
      return res.status(400).send({
        status: 400,
        message: errorHandler.getErrorMessage(error)
      });
    }

    // console.log(body.orders.length);
    res.jsonp(body);
  });
};
