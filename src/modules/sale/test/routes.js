"use strict";
var request = require("supertest"),
  assert = require("assert"),
  config = require("../../../config/config"),
  _ = require("lodash"),
  jwt = require("jsonwebtoken"),
  mongoose = require("mongoose"),
  app = require("../../../config/express"),
  Sale = mongoose.model("Sale");

var credentials, token, mockup;

describe("Sale CRUD routes tests", function() {
  before(function(done) {
    mockup = {
      no: 2046,
      createdAt: "2020-01-02 18:57:40 +0700",
      status: "shipped",
      customeName: "ฐานธรรมธุรกิจ สันป่าตอง",
      customerPhone: "0632011995",
      customerAddress:
        "151/3 หมู่ 4 ยุหว่า สันป่าตอง เชียงใหม่ 50120	H1D0010401932",
      paymentProvider: "bbl",
      accountNo: "063-0-339919",
      accountName: "ธรรมธุรกิจ วิสาหกิจเพื่อสังคม",
      shippingOption: "Inter Express",
      shippingCost: 0.0,
      subtotal: 0.0,
      discount: 0.0,
      total: 0.0,
      paidAt: "2020-01-02 18:58:00 +0700",
      paidAmount: 0.0,
      itemCode: "PD00002-1",
      variantName: "1กก",
      itemName: "ข้าวกล้องเหนียวธรรมชาติ 1 กก",
      itemQty: 100,
      itemPrice: 0.0,
      itemSubtotal: 0.0
    };
    credentials = {
      username: "username",
      password: "password",
      firstname: "first name",
      lastname: "last name",
      email: "test@email.com",
      roles: ["user"]
    };
    token = jwt.sign(_.omit(credentials, "password"), config.jwt.secret, {
      expiresIn: 2 * 60 * 60 * 1000
    });
    done();
  });

  it("should be Sale get use token", done => {
    request(app)
      .get("/api/sales")
      .set("Authorization", "Bearer " + token)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        var resp = res.body;
        done();
      });
  });

  it("should be Sale get by id", function(done) {
    request(app)
      .post("/api/sales")
      .set("Authorization", "Bearer " + token)
      .send(mockup)
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        var resp = res.body;
        request(app)
          .get("/api/sales/" + resp.data._id)
          .set("Authorization", "Bearer " + token)
          .expect(200)
          .end(function(err, res) {
            if (err) {
              return done(err);
            }
            var resp = res.body;
            assert.equal(resp.status, 200);

            done();
          });
      });
  });

  it("should be Sale post use token", done => {
    request(app)
      .post("/api/sales")
      .set("Authorization", "Bearer " + token)
      .send(mockup)
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        var resp = res.body;
        // console.log(resp.data);
        done();
      });
  });

  it("should be sale put use token", function(done) {
    request(app)
      .post("/api/sales")
      .set("Authorization", "Bearer " + token)
      .send(mockup)
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        var resp = res.body;
        var update = {
          name: "name update"
        };
        request(app)
          .put("/api/sales/" + resp.data._id)
          .set("Authorization", "Bearer " + token)
          .send(update)
          .expect(200)
          .end(function(err, res) {
            if (err) {
              return done(err);
            }
            var resp = res.body;

            done();
          });
      });
  });

  it("should be sale delete use token", function(done) {
    request(app)
      .post("/api/sales")
      .set("Authorization", "Bearer " + token)
      .send(mockup)
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        var resp = res.body;
        request(app)
          .delete("/api/sales/" + resp.data._id)
          .set("Authorization", "Bearer " + token)
          .expect(200)
          .end(done);
      });
  });

  it("should be sale get not use token", done => {
    request(app)
      .get("/api/sales")
      .expect(403)
      .expect({
        status: 403,
        message: "User is not authorized"
      })
      .end(done);
  });

  it("should be sale post not use token", function(done) {
    request(app)
      .post("/api/sales")
      .send(mockup)
      .expect(403)
      .expect({
        status: 403,
        message: "User is not authorized"
      })
      .end(done);
  });

  it("should be sale put not use token", function(done) {
    request(app)
      .post("/api/sales")
      .set("Authorization", "Bearer " + token)
      .send(mockup)
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        var resp = res.body;
        var update = {
          name: "name update"
        };
        request(app)
          .put("/api/sales/" + resp.data._id)
          .send(update)
          .expect(403)
          .expect({
            status: 403,
            message: "User is not authorized"
          })
          .end(done);
      });
  });

  it("should be sale delete not use token", function(done) {
    request(app)
      .post("/api/sales")
      .set("Authorization", "Bearer " + token)
      .send(mockup)
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        var resp = res.body;
        request(app)
          .delete("/api/sales/" + resp.data._id)
          .expect(403)
          .expect({
            status: 403,
            message: "User is not authorized"
          })
          .end(done);
      });
  });

  afterEach(function(done) {
    Sale.deleteMany().exec(done);
  });
});
