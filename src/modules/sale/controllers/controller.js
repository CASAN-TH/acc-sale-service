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

// 1. อ่านข้อมูลหน้าร้านทั้งหมดจาก ocha owner account
exports.getOchaShopList = (req, res) => {
  var options = {
    method: "POST",
    url: "https://live.ocha.in.th/api/shop/branch/get/",
    headers: {
      Authorization: authKey,
      cookie: cookie
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

// 2. Auth เข้าทีละร้านเพื่ออ่าน  Set-Cookie ใน Response Header
exports.selectOchaShop = async (req, res) => {
  var options = {
    method: "POST",
    url: "https://live.ocha.in.th/api/auth/branch/",
    headers: {
      Authorization: authKey,
      cookie: cookie
    },
    //2.1 รับ request payload จาก client ทีละร้าน รูปแบบ{ branch_shop_id: req.shop_id }
    body: req.body,
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
      // 2.2 อ่าน  Set-Cookie ใน Response Header
      posocha: response.headers["set-cookie"]
        .toString()
        .split(";")[0]
        .replace("posocha=", "")
    };
    // 2.3 response Set-Cookie Header กลับไปเพื่อเรียกจ้อมูลร้านตาม request
    res.jsonp(result);
  });
};

// 3. อ่านข้อมูล Orders แต่ละร้านค้าจาก cookies param
exports.interfaceOcha = async (req, res) => {
  let orders = [];
  const url = "https://live.ocha.in.th/api/transaction/history/";
  const cookie = ` _ga=GA1.3.1500102785.1579786690; _fbp=fb.2.1579786691460.187124307; _gid=GA1.3.1076144380.1580998410; __utma=21896485.1500102785.1579786690.1580998410.1580998410.1; __utmc=21896485; __utmz=21896485.1580998410.1.1.utmcsr=google|utmccn=(organic)|utmcmd=organic|utmctr=(not%20provided); posocha=${req.body.posocha}`;

  let body = {
    column_filter: {
      uid_list: null,
      payment_type_list: null,
      status_list: [0, 1, 4, 64],
      dine_type_list: [1, 2],
      include_e_payment: true,
      payment_status_list: [0, 2, 6, 7]
    },
    filter: req.body.filter, // prarameter สำหรับกรองวันที่
    pagination: req.body.pagination // prarameter สำหรับกรองหน้าเริ่มต้นของข้อมูล
  };

  const options = {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      Authorization: authKey,
      cookie: cookie
    }
  };

  const response = await fetch(url, options);

  // 3.1. อ่านข้อมูลหน้าแรกเพื่อให้ได้ข้มูลเพจทั้งหมด json.pagination.page_begins
  const json1 = await response.json();
  const promise = json1.pagination.page_begins.map(async (pbg, idx) => {
    // 3.2. อ่านข้อมูล Orders แต่ละเพจ
    body.pagination.page_begin = pbg;
    const options = {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        Authorization: authKey,
        cookie: cookie
      }
    };
    const response = await fetch(url, options);
    const json = await response.json();

    // 3.3. Map ข้อมูล Orders ตามโครงสร้างของเรา
    const promiseOrd = json.orders.map(async (od, idx) => {
      let ood = {
        no: od.payments[0].receipt_number_v2,
        createdAt: od.order.add_time,
        status: od.order.status,
        customerName: od.order.name,
        paymentProvider: "cash",
        subtotal: 0,
        discount: 0,
        total: od.order.money_payable,
        paidAt: od.payments[0].upd_time,
        paidAmount: od.payments[0].money_to_pay,
        note: od.order.note,
        items: [],
        discounts: [],
        voidedAt: od.voided ? od.voided.upd_time : null
      };
      od.items.forEach(item => {
        ood.subtotal += parseInt(item.money_nominal);
        ood.items.push({
          itemCode: item.item_cid,
          itemName: item.item_name,
          itemQty: item.quantity,
          itemPrice: item.item_price.unit_price,
          itemSubtotal: item.money_nominal
        });
      });
      if (od.discounts) {
        od.discounts.forEach(discount => {
          ood.discountAmount += parseInt(discount.discounted_value);
          ood.discounts.push({
            name: discount.name,
            value: discount.value,
            quantity: discount.quantity,
            amount: discount.discounted_value
          });
        });
      }

      orders.push(ood);
    });
    await Promise.all(promiseOrd);
  });

  // 3.4.  รอ loop อ่านข้อมูลจนครบตามสัญญา (promise)
  await Promise.all(promise);

  res.jsonp(orders);
};

// export การขาย
exports.startdate = function(req, res, next, enddate) {
  var end = new Date(enddate);
  var startdate = req.startdate;
  Sale.find({ paidAt: { $gte: startdate, $lte: end }, status: "0" })
    .sort("-created")
    .exec(function(err, data) {
      if (err) {
        return next(err);
      } else if (!data) {
        return res.status(404).send({
          message: "No data found"
        });
      }
      req.sales = data;
      next();
    });
};

exports.excelreports = function(req, res, next) {
  var items = [];
  var data = req.sales ? req.sales : [];
  var i = 1;
  data.forEach(function(itm) {
    items.push({
      no: i,
      docDate: formatDate(itm.paidAt),
      docNo: itm.no,
      customerName: "",
      customerTaxID:"",
      customerBranch: "",
      amount: itm.paidAmount,
      vat: itm.paidAmount/1.07,
      saleBranch: itm.shopName
    });
    i++;
  });
  res.xls("sales.xlsx", items);
  //res.jsonp({ orders: orderslist});
};

function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}
