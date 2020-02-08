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
      items: [
        {
          itemCode: "PD00002-1",
          variantName: "1กก",
          itemName: "ข้าวกล้องเหนียวธรรมชาติ 1 กก",
          itemQty: 100,
          itemPrice: 0.0,
          itemSubtotal: 0.0
        }
      ],
      shopId: "1234",
      shopName: "page365"
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

describe("Sale Import routes tests", function() {
  before(done => {
    mockup = {
      shopId: 66344,
      shopName: "ข้าวแปรรูป พระราม๙",
      orders: [
        {
          no: "01003933",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580527075907,
          paidAmount: "300.000000",
          items: [
            {
              itemCode: "0002BCE816610A20E0604B85ADF94E58AC13418EE94BF4CF",
              itemName: "กล้วยไส้มะขาม",
              itemQty: 1,
              itemPrice: "45.000000",
              itemSubtotal: "45.000000"
            },
            {
              itemCode: "0002BCE816610A20458FFC884BF04AEAB427107CD0C6D89A",
              itemName: "ขนมปังกรอบไข่เค็ม",
              itemQty: 2,
              itemPrice: "55.000000",
              itemSubtotal: "110.000000"
            },
            {
              itemCode: "0002BCE816610A2078DD768FC40543738A1E911BFD187C14",
              itemName: "น้ำมะปี๊ดผสมน้ำผึ้ง",
              itemQty: 1,
              itemPrice: "60.000000",
              itemSubtotal: "60.000000"
            },
            {
              itemCode: "0002BCE816610A20B12E3997883A475F9A47C9AE1FF71BCF",
              itemName: "มะนาวดอง",
              itemQty: 1,
              itemPrice: "85.000000",
              itemSubtotal: "85.000000"
            }
          ]
        },
        {
          no: "01003932",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580527070199,
          paidAmount: "155.000000",
          items: [
            {
              itemCode: "0002BCE816610A208AD03B1C412A4059ADA85030EB721A86",
              itemName: "กล้วยตาก Fruitboy",
              itemQty: 1,
              itemPrice: "55.000000",
              itemSubtotal: "55.000000"
            },
            {
              itemCode: "0002BCE816610A20E0604B85ADF94E58AC13418EE94BF4CF",
              itemName: "กล้วยไส้มะขาม",
              itemQty: 1,
              itemPrice: "45.000000",
              itemSubtotal: "45.000000"
            },
            {
              itemCode: "0002BCE816610A20458FFC884BF04AEAB427107CD0C6D89A",
              itemName: "ขนมปังกรอบไข่เค็ม",
              itemQty: 1,
              itemPrice: "55.000000",
              itemSubtotal: "55.000000"
            }
          ]
        },
        {
          no: "01003931",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580525862071,
          paidAmount: "1000.000000",
          items: [
            {
              itemCode: "0002BCE816610A2043F618AC3C8E457EB28D148E4835D747",
              itemName: "ข้าวหอมมะลิ 5 กก",
              itemQty: 4,
              itemPrice: "250.000000",
              itemSubtotal: "1000.000000"
            }
          ]
        },
        {
          no: "01003930",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580525848579,
          paidAmount: "1000.000000",
          items: [
            {
              itemCode: "0002BCE816610A2043F618AC3C8E457EB28D148E4835D747",
              itemName: "ข้าวหอมมะลิ 5 กก",
              itemQty: 4,
              itemPrice: "250.000000",
              itemSubtotal: "1000.000000"
            }
          ]
        },
        {
          no: "01003929",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580525193924,
          paidAmount: "275.000000",
          items: [
            {
              itemCode: "0002BCE816610A2061AA7F5285FC4CC58611D3F3AC6D178E",
              itemName: "ข้าวกล้องเหนียวธรรมชาติ 5 กก",
              itemQty: 1,
              itemPrice: "220.000000",
              itemSubtotal: "220.000000"
            },
            {
              itemCode: "0002BCE816610A208AD03B1C412A4059ADA85030EB721A86",
              itemName: "กล้วยตาก Fruitboy",
              itemQty: 1,
              itemPrice: "55.000000",
              itemSubtotal: "55.000000"
            }
          ]
        },
        {
          no: "01003928",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580524937627,
          paidAmount: "140.000000",
          items: [
            {
              itemCode: "0002BCE816610A20659887AC5BEC443C8AA310555194CB2C",
              itemName: "น้ำผึ้งดอกไม้ป่า",
              itemQty: 1,
              itemPrice: "140.000000",
              itemSubtotal: "140.000000"
            }
          ]
        },
        {
          no: "01003927",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580524406925,
          paidAmount: "140.000000",
          items: [
            {
              itemCode: "0002BCE816610A20659887AC5BEC443C8AA310555194CB2C",
              itemName: "น้ำผึ้งดอกไม้ป่า",
              itemQty: 1,
              itemPrice: "140.000000",
              itemSubtotal: "140.000000"
            }
          ]
        },
        {
          no: "01003926",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580524390323,
          paidAmount: "160.000000",
          items: [
            {
              itemCode: "0002BCE816610A208D08A0D7F0FA4C95957B15817F834161",
              itemName: "ถั่วงาแผ่น",
              itemQty: 1,
              itemPrice: "60.000000",
              itemSubtotal: "60.000000"
            },
            {
              itemCode: "0002BCE816610A208AD03B1C412A4059ADA85030EB721A86",
              itemName: "กล้วยตาก Fruitboy",
              itemQty: 1,
              itemPrice: "55.000000",
              itemSubtotal: "55.000000"
            },
            {
              itemCode: "0002BCE816610A20E0604B85ADF94E58AC13418EE94BF4CF",
              itemName: "กล้วยไส้มะขาม",
              itemQty: 1,
              itemPrice: "45.000000",
              itemSubtotal: "45.000000"
            }
          ]
        },
        {
          no: "01003925",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580524373435,
          paidAmount: "280.000000",
          items: [
            {
              itemCode: "0002BCE816610A20357932E7600E4D158FDC448F8C7FE1E8",
              itemName: "หนังสือเติบโตตามรอยพ่อ",
              itemQty: 1,
              itemPrice: "280.000000",
              itemSubtotal: "280.000000"
            }
          ]
        },
        {
          no: "01003948",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580534423838,
          paidAmount: "50.000000",
          items: [
            {
              itemCode: "0002BCE816610A20D0B45A67E0234C11B088730936BCFF0E",
              itemName: "สบู่ถ่าน",
              itemQty: 1,
              itemPrice: "50.000000",
              itemSubtotal: "50.000000"
            }
          ]
        },
        {
          no: "01003947",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580534407787,
          paidAmount: "220.000000",
          items: [
            {
              itemCode: "0002BCE816610A2061AA7F5285FC4CC58611D3F3AC6D178E",
              itemName: "ข้าวกล้องเหนียวธรรมชาติ 5 กก",
              itemQty: 1,
              itemPrice: "220.000000",
              itemSubtotal: "220.000000"
            }
          ]
        },
        {
          no: "01003946",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580534388468,
          paidAmount: "280.000000",
          items: [
            {
              itemCode: "0002BCE816610A20007BE4C86E664B288F5083C6A873EBBB",
              itemName: "ข้าวกล้องหอมมะลิ 1 กก",
              itemQty: 2,
              itemPrice: "60.000000",
              itemSubtotal: "120.000000"
            },
            {
              itemCode: "0002BCE816610A20667508ED09D64126931E23EDB40DAA68",
              itemName: "ข้าวกล้องดอกมะขาม 1 กก",
              itemQty: 1,
              itemPrice: "60.000000",
              itemSubtotal: "60.000000"
            },
            {
              itemCode: "0002BCE816610A20DC617D647B3B43FEB80BB560D5B143D1",
              itemName: "ถั่วเขียว 0.5 กก",
              itemQty: 1,
              itemPrice: "50.000000",
              itemSubtotal: "50.000000"
            },
            {
              itemCode: "0002BCE816610A208DC573C6E0A043DE986EDFC6B8C6F805",
              itemName: "ถั่วลิสง 0.5 กก",
              itemQty: 1,
              itemPrice: "50.000000",
              itemSubtotal: "50.000000"
            }
          ]
        },
        {
          no: "01003945",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580533933696,
          paidAmount: "220.000000",
          items: [
            {
              itemCode: "0002BCE816610A2061AA7F5285FC4CC58611D3F3AC6D178E",
              itemName: "ข้าวกล้องเหนียวธรรมชาติ 5 กก",
              itemQty: 1,
              itemPrice: "220.000000",
              itemSubtotal: "220.000000"
            }
          ]
        },
        {
          no: "01003944",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580533196086,
          paidAmount: "100.000000",
          items: [
            {
              itemCode: "0002BCE816610A203AE52D0527D546568C81BEB79FA25FC1",
              itemName: "สบู่ข้าว",
              itemQty: 1,
              itemPrice: "50.000000",
              itemSubtotal: "50.000000"
            },
            {
              itemCode: "0002BCE816610A208DC573C6E0A043DE986EDFC6B8C6F805",
              itemName: "ถั่วลิสง 0.5 กก",
              itemQty: 1,
              itemPrice: "50.000000",
              itemSubtotal: "50.000000"
            }
          ]
        },
        {
          no: "01003943",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580531268537,
          paidAmount: "50.000000",
          items: [
            {
              itemCode: "0002BCE816610A20CDBAA0139C3E43079530011D8C1C7035",
              itemName: "ข้าวกล้องเหนียวธรรมชาติ 1 กก.",
              itemQty: 1,
              itemPrice: "50.000000",
              itemSubtotal: "50.000000"
            }
          ]
        },
        {
          no: "01003942",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580531101985,
          paidAmount: "300.000000",
          items: [
            {
              itemCode: "0002BCE816610A20D8AC0CA9D86C407B93BDD4C7FE90D44E",
              itemName: "ปุ๋ยเม็ดเร่งดอกผล 702(1กก)",
              itemQty: 4,
              itemPrice: "25.000000",
              itemSubtotal: "100.000000"
            },
            {
              itemCode: "0002BCE816610A20C66A0773D1554EF58FED3B708874B232",
              itemName: "ปุ๋ยเม็ดบำรุงดิน 701(1กก)",
              itemQty: 5,
              itemPrice: "20.000000",
              itemSubtotal: "100.000000"
            },
            {
              itemCode: "0002BCE816610A20FF82B4A861674A18ACD6878C269B5FC3",
              itemName: "หัวเชื้อ SuperM",
              itemQty: 1,
              itemPrice: "100.000000",
              itemSubtotal: "100.000000"
            }
          ]
        },
        {
          no: "01003941",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580530785873,
          paidAmount: "100.000000",
          items: [
            {
              itemCode: "0002BCE816610A204C2AB58A535C4875855BF5650C29F1FF",
              itemName: "ถั่วดำ 0.5 กก",
              itemQty: 1,
              itemPrice: "50.000000",
              itemSubtotal: "50.000000"
            },
            {
              itemCode: "0002BCE816610A206106D0F349D34E6BBBC577FC650AD9E4",
              itemName: "ข้าวเหนียวธรรมชาติ 1 กก",
              itemQty: 1,
              itemPrice: "50.000000",
              itemSubtotal: "50.000000"
            }
          ]
        },
        {
          no: "01003940",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580530759046,
          paidAmount: "245.000000",
          items: [
            {
              itemCode: "0002BCE816610A20D75873CEDF4D4A1F85ECFC5FA92C55BC",
              itemName: "แชมพูครีมนวดย่านาง",
              itemQty: 1,
              itemPrice: "130.000000",
              itemSubtotal: "130.000000"
            },
            {
              itemCode: "0002BCE81689F26EED528BD1B7C14D20989C3FDEFEB520F8",
              itemName: "สบู่เหลวน้ำนมข้าว&น้ำผึ้ง",
              itemQty: 1,
              itemPrice: "115.000000",
              itemSubtotal: "115.000000"
            }
          ]
        },
        {
          no: "01003939",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580530249724,
          paidAmount: "100.000000",
          items: [
            {
              itemCode: "0002BCE816610A20CF6A9D60CF23456799AEE6DE64D9BF2C",
              itemName: "ข้าวกล้องเหนียวธรรมชาติ 2 กก",
              itemQty: 1,
              itemPrice: "100.000000",
              itemSubtotal: "100.000000"
            }
          ]
        },
        {
          no: "01003938",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580530082652,
          paidAmount: "50.000000",
          items: [
            {
              itemCode: "0002BCE816610A208DC573C6E0A043DE986EDFC6B8C6F805",
              itemName: "ถั่วลิสง 0.5 กก",
              itemQty: 1,
              itemPrice: "50.000000",
              itemSubtotal: "50.000000"
            }
          ]
        },
        {
          no: "01003937",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580529764183,
          paidAmount: "165.000000",
          items: [
            {
              itemCode: "0002BCE816610A208AD03B1C412A4059ADA85030EB721A86",
              itemName: "กล้วยตาก Fruitboy",
              itemQty: 3,
              itemPrice: "55.000000",
              itemSubtotal: "165.000000"
            }
          ]
        },
        {
          no: "01003936",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580529733540,
          paidAmount: "160.000000",
          items: [
            {
              itemCode: "0002BCE816610A20CDBAA0139C3E43079530011D8C1C7035",
              itemName: "ข้าวกล้องเหนียวธรรมชาติ 1 กก.",
              itemQty: 1,
              itemPrice: "50.000000",
              itemSubtotal: "50.000000"
            },
            {
              itemCode: "0002BCE816610A20667508ED09D64126931E23EDB40DAA68",
              itemName: "ข้าวกล้องดอกมะขาม 1 กก",
              itemQty: 1,
              itemPrice: "60.000000",
              itemSubtotal: "60.000000"
            },
            {
              itemCode: "0002BCE816610A206106D0F349D34E6BBBC577FC650AD9E4",
              itemName: "ข้าวเหนียวธรรมชาติ 1 กก",
              itemQty: 1,
              itemPrice: "50.000000",
              itemSubtotal: "50.000000"
            }
          ]
        },
        {
          no: "01003935",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580528927652,
          paidAmount: "50.000000",
          items: [
            {
              itemCode: "0002BCE816610A208DC573C6E0A043DE986EDFC6B8C6F805",
              itemName: "ถั่วลิสง 0.5 กก",
              itemQty: 1,
              itemPrice: "50.000000",
              itemSubtotal: "50.000000"
            }
          ]
        },
        {
          no: "01003934",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580528389869,
          paidAmount: "50.000000",
          items: [
            {
              itemCode: "0002BCE816610A208DC573C6E0A043DE986EDFC6B8C6F805",
              itemName: "ถั่วลิสง 0.5 กก",
              itemQty: 1,
              itemPrice: "50.000000",
              itemSubtotal: "50.000000"
            }
          ]
        },
        {
          no: "01003978",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580614943909,
          paidAmount: "460.000000",
          items: [
            {
              itemCode: "0002BCE816610A2056AECC16C2024172BACFB144EBC0B98C",
              itemName: "แชมพูครีมนวดน้ำนมข้าว",
              itemQty: 1,
              itemPrice: "145.000000",
              itemSubtotal: "145.000000"
            },
            {
              itemCode: "0002BCE81689F26EED528BD1B7C14D20989C3FDEFEB520F8",
              itemName: "สบู่เหลวน้ำนมข้าว&น้ำผึ้ง",
              itemQty: 2,
              itemPrice: "115.000000",
              itemSubtotal: "230.000000"
            },
            {
              itemCode: "0002BCE816610A209607500177C746798A7596166B0FC7B7",
              itemName: "สบู่เหลวขมิ้น",
              itemQty: 1,
              itemPrice: "85.000000",
              itemSubtotal: "85.000000"
            }
          ]
        },
        {
          no: "01003977",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580614725023,
          paidAmount: "420.000000",
          items: [
            {
              itemCode: "0002BCE816610A208D58B0D537EE47F599626EA7E56C93C6",
              itemName: "คู่มือเก็บเมล็ดพันธุ์ประจำบ้าน",
              itemQty: 1,
              itemPrice: "80.000000",
              itemSubtotal: "80.000000"
            },
            {
              itemCode: "0002BCE816610A20E3A5EBF03C264649BDA3FF3A8F574FF2",
              itemName: "หนังสือ สวน",
              itemQty: 1,
              itemPrice: "160.000000",
              itemSubtotal: "160.000000"
            },
            {
              itemCode: "0002BCE816610A20C469BA7D62D147109C1BAF53827469B8",
              itemName: "แชมพูมะกรูดไม่มีฟอง",
              itemQty: 1,
              itemPrice: "95.000000",
              itemSubtotal: "95.000000"
            },
            {
              itemCode: "0002BCE816610A2027EAE79AC6EC41A9B957863BF8650AC9",
              itemName: "สบู่เหลวถ่านไม้ไผ่",
              itemQty: 1,
              itemPrice: "85.000000",
              itemSubtotal: "85.000000"
            }
          ]
        },
        {
          no: "01003976",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580614608071,
          paidAmount: "180.000000",
          items: [
            {
              itemCode: "0002BCE816610A20007BE4C86E664B288F5083C6A873EBBB",
              itemName: "ข้าวกล้องหอมมะลิ 1 กก",
              itemQty: 3,
              itemPrice: "60.000000",
              itemSubtotal: "180.000000"
            }
          ]
        },
        {
          no: "01003975",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580613769842,
          paidAmount: "250.000000",
          items: [
            {
              itemCode: "0002BCE816610A2043F618AC3C8E457EB28D148E4835D747",
              itemName: "ข้าวหอมมะลิ 5 กก",
              itemQty: 1,
              itemPrice: "250.000000",
              itemSubtotal: "250.000000"
            }
          ]
        },
        {
          no: "01003974",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580612685431,
          paidAmount: "250.000000",
          items: [
            {
              itemCode: "0002BCE816610A20CDBAA0139C3E43079530011D8C1C7035",
              itemName: "ข้าวกล้องเหนียวธรรมชาติ 1 กก.",
              itemQty: 5,
              itemPrice: "50.000000",
              itemSubtotal: "250.000000"
            }
          ]
        },
        {
          no: "01003973",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580612667239,
          paidAmount: "300.000000",
          items: [
            {
              itemCode: "0002BCE816610A20CF6A9D60CF23456799AEE6DE64D9BF2C",
              itemName: "ข้าวกล้องเหนียวธรรมชาติ 2 กก",
              itemQty: 1,
              itemPrice: "100.000000",
              itemSubtotal: "100.000000"
            },
            {
              itemCode: "0002BCE816610A204DF7C9D5A52D44B9A1C47FC8CBAAA39E",
              itemName: "ถั่วเหลือง 0.5 กก",
              itemQty: 3,
              itemPrice: "50.000000",
              itemSubtotal: "150.000000"
            },
            {
              itemCode: "0002BCE816610A206106D0F349D34E6BBBC577FC650AD9E4",
              itemName: "ข้าวเหนียวธรรมชาติ 1 กก",
              itemQty: 1,
              itemPrice: "50.000000",
              itemSubtotal: "50.000000"
            }
          ]
        },
        {
          no: "01003972",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580549582208,
          paidAmount: "440.000000",
          items: [
            {
              itemCode: "0002BCE816610A2061AA7F5285FC4CC58611D3F3AC6D178E",
              itemName: "ข้าวกล้องเหนียวธรรมชาติ 5 กก",
              itemQty: 2,
              itemPrice: "220.000000",
              itemSubtotal: "440.000000"
            }
          ]
        },
        {
          no: "01003971",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580548519825,
          paidAmount: "100.000000",
          items: [
            {
              itemCode: "0002BCE816610A206106D0F349D34E6BBBC577FC650AD9E4",
              itemName: "ข้าวเหนียวธรรมชาติ 1 กก",
              itemQty: 2,
              itemPrice: "50.000000",
              itemSubtotal: "100.000000"
            }
          ]
        },
        {
          no: "01003970",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580545527495,
          paidAmount: "50.000000",
          items: [
            {
              itemCode: "0002BCE816610A20CDBAA0139C3E43079530011D8C1C7035",
              itemName: "ข้าวกล้องเหนียวธรรมชาติ 1 กก.",
              itemQty: 1,
              itemPrice: "50.000000",
              itemSubtotal: "50.000000"
            }
          ]
        },
        {
          no: "01003969",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580545173670,
          paidAmount: "50.000000",
          items: [
            {
              itemCode: "0002BCE816610A20CDBAA0139C3E43079530011D8C1C7035",
              itemName: "ข้าวกล้องเหนียวธรรมชาติ 1 กก.",
              itemQty: 1,
              itemPrice: "50.000000",
              itemSubtotal: "50.000000"
            }
          ]
        },
        {
          no: "01003968",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580544762302,
          paidAmount: "1000.000000",
          items: [
            {
              itemCode: "0002BCE816610A2043F618AC3C8E457EB28D148E4835D747",
              itemName: "ข้าวหอมมะลิ 5 กก",
              itemQty: 4,
              itemPrice: "250.000000",
              itemSubtotal: "1000.000000"
            }
          ]
        },
        {
          no: "01003967",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580544658119,
          paidAmount: "50.000000",
          items: [
            {
              itemCode: "0002BCE816610A208DC573C6E0A043DE986EDFC6B8C6F805",
              itemName: "ถั่วลิสง 0.5 กก",
              itemQty: 1,
              itemPrice: "50.000000",
              itemSubtotal: "50.000000"
            }
          ]
        },
        {
          no: "01003966",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580544078652,
          paidAmount: "1720.000000",
          items: [
            {
              itemCode: "0002BCE816610A2043F618AC3C8E457EB28D148E4835D747",
              itemName: "ข้าวหอมมะลิ 5 กก",
              itemQty: 4,
              itemPrice: "250.000000",
              itemSubtotal: "1000.000000"
            },
            {
              itemCode: "0002BCE816610A2061AA7F5285FC4CC58611D3F3AC6D178E",
              itemName: "ข้าวกล้องเหนียวธรรมชาติ 5 กก",
              itemQty: 4,
              itemPrice: "220.000000",
              itemSubtotal: "880.000000"
            }
          ]
        },
        {
          no: "01003965",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580543003406,
          paidAmount: "100.000000",
          items: [
            {
              itemCode: "0002BCE816610A208DC573C6E0A043DE986EDFC6B8C6F805",
              itemName: "ถั่วลิสง 0.5 กก",
              itemQty: 2,
              itemPrice: "50.000000",
              itemSubtotal: "100.000000"
            }
          ]
        },
        {
          no: "01003964",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580542016123,
          paidAmount: "805.000000",
          items: [
            {
              itemCode: "0002BCE816610A204DF7C9D5A52D44B9A1C47FC8CBAAA39E",
              itemName: "ถั่วเหลือง 0.5 กก",
              itemQty: 4,
              itemPrice: "50.000000",
              itemSubtotal: "200.000000"
            },
            {
              itemCode: "0002BCE816610A204C2AB58A535C4875855BF5650C29F1FF",
              itemName: "ถั่วดำ 0.5 กก",
              itemQty: 1,
              itemPrice: "50.000000",
              itemSubtotal: "50.000000"
            },
            {
              itemCode: "0002BCE816610A20FA05329D2A184E5D9FC4DBB87042F8AF",
              itemName: "น้ำมันมะพร้าวมาว่า สกัดเย็น 250cc",
              itemQty: 1,
              itemPrice: "220.000000",
              itemSubtotal: "220.000000"
            },
            {
              itemCode: "0002BCE816610A2027EAE79AC6EC41A9B957863BF8650AC9",
              itemName: "สบู่เหลวถ่านไม้ไผ่",
              itemQty: 1,
              itemPrice: "85.000000",
              itemSubtotal: "85.000000"
            },
            {
              itemCode: "0002BCE816610A2043F618AC3C8E457EB28D148E4835D747",
              itemName: "ข้าวหอมมะลิ 5 กก",
              itemQty: 1,
              itemPrice: "250.000000",
              itemSubtotal: "250.000000"
            }
          ]
        },
        {
          no: "01003993",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580622235686,
          paidAmount: "100.000000",
          items: [
            {
              itemCode: "0002BCE816610A20F0FAF0B4E65F445F9934B012A457323B",
              itemName: "น้ำพริกเผา",
              itemQty: 1,
              itemPrice: "65.000000",
              itemSubtotal: "65.000000"
            },
            {
              itemCode: "0002BCE816610A20A2EE5B59771C418CB47BCD2BF9A974E7",
              itemName: "ถั่วคั่วทราย",
              itemQty: 1,
              itemPrice: "35.000000",
              itemSubtotal: "35.000000"
            }
          ]
        },
        {
          no: "01003992",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580633223819,
          paidAmount: "40.000000",
          items: [
            {
              itemCode: "0002BCE816610A20A9F697A0469B4CA896E40CBF94084E34",
              itemName: "ผงล้างผักผสมถ่าน",
              itemQty: 1,
              itemPrice: "40.000000",
              itemSubtotal: "40.000000"
            }
          ]
        },
        {
          no: "01003991",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580621436450,
          paidAmount: "50.000000",
          items: [
            {
              itemCode: "0002BCE816610A20CDBAA0139C3E43079530011D8C1C7035",
              itemName: "ข้าวกล้องเหนียวธรรมชาติ 1 กก.",
              itemQty: 1,
              itemPrice: "50.000000",
              itemSubtotal: "50.000000"
            }
          ]
        },
        {
          no: "01003990",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580621302486,
          paidAmount: "220.000000",
          items: [
            {
              itemCode: "0002BCE816610A2061AA7F5285FC4CC58611D3F3AC6D178E",
              itemName: "ข้าวกล้องเหนียวธรรมชาติ 5 กก",
              itemQty: 1,
              itemPrice: "220.000000",
              itemSubtotal: "220.000000"
            }
          ]
        },
        {
          no: "01003989",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580620564125,
          paidAmount: "130.000000",
          items: [
            {
              itemCode: "0002BCE816610A20D75873CEDF4D4A1F85ECFC5FA92C55BC",
              itemName: "แชมพูครีมนวดย่านาง",
              itemQty: 1,
              itemPrice: "130.000000",
              itemSubtotal: "130.000000"
            }
          ]
        },
        {
          no: "01003988",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580618878338,
          paidAmount: "320.000000",
          items: [
            {
              itemCode: "0002BCE816610A20CDBAA0139C3E43079530011D8C1C7035",
              itemName: "ข้าวกล้องเหนียวธรรมชาติ 1 กก.",
              itemQty: 1,
              itemPrice: "50.000000",
              itemSubtotal: "50.000000"
            },
            {
              itemCode: "0002BCE816610A20895E4D7FEFE94E36B8D6FE5531B01085",
              itemName: "ข้าวหอมมะลิ 1 กก",
              itemQty: 1,
              itemPrice: "60.000000",
              itemSubtotal: "60.000000"
            },
            {
              itemCode: "0002BCE816610A20667508ED09D64126931E23EDB40DAA68",
              itemName: "ข้าวกล้องดอกมะขาม 1 กก",
              itemQty: 1,
              itemPrice: "60.000000",
              itemSubtotal: "60.000000"
            },
            {
              itemCode: "0002BCE816610A20E7B82425373F496FA9A463E6951DE2FB",
              itemName: "งาดำ 0.5 กก",
              itemQty: 1,
              itemPrice: "100.000000",
              itemSubtotal: "100.000000"
            },
            {
              itemCode: "0002BCE816610A204C2AB58A535C4875855BF5650C29F1FF",
              itemName: "ถั่วดำ 0.5 กก",
              itemQty: 1,
              itemPrice: "50.000000",
              itemSubtotal: "50.000000"
            }
          ]
        },
        {
          no: "01003987",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580618426102,
          paidAmount: "60.000000",
          items: [
            {
              itemCode: "0002BCE816610A20895E4D7FEFE94E36B8D6FE5531B01085",
              itemName: "ข้าวหอมมะลิ 1 กก",
              itemQty: 1,
              itemPrice: "60.000000",
              itemSubtotal: "60.000000"
            }
          ]
        },
        {
          no: "01003986",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580617814662,
          paidAmount: "220.000000",
          items: [
            {
              itemCode: "0002BCE816610A2061AA7F5285FC4CC58611D3F3AC6D178E",
              itemName: "ข้าวกล้องเหนียวธรรมชาติ 5 กก",
              itemQty: 1,
              itemPrice: "220.000000",
              itemSubtotal: "220.000000"
            }
          ]
        },
        {
          no: "01003985",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580617800195,
          paidAmount: "80.000000",
          items: [
            {
              itemCode: "0002BCE816610A20804F44A3DAAB49339427A40083231597",
              itemName: "น้ำมันเขียว",
              itemQty: 1,
              itemPrice: "80.000000",
              itemSubtotal: "80.000000"
            }
          ]
        },
        {
          no: "01003984",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580616008864,
          paidAmount: "285.000000",
          items: [
            {
              itemCode: "0002BCE816610A2043F618AC3C8E457EB28D148E4835D747",
              itemName: "ข้าวหอมมะลิ 5 กก",
              itemQty: 1,
              itemPrice: "250.000000",
              itemSubtotal: "250.000000"
            },
            {
              itemCode: "0002BCE816610A20A2EE5B59771C418CB47BCD2BF9A974E7",
              itemName: "ถั่วคั่วทราย",
              itemQty: 1,
              itemPrice: "35.000000",
              itemSubtotal: "35.000000"
            }
          ]
        },
        {
          no: "01003983",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580615748327,
          paidAmount: "260.000000",
          items: [
            {
              itemCode: "0002BCE816610A2061AA7F5285FC4CC58611D3F3AC6D178E",
              itemName: "ข้าวกล้องเหนียวธรรมชาติ 5 กก",
              itemQty: 1,
              itemPrice: "220.000000",
              itemSubtotal: "220.000000"
            },
            {
              itemCode: "0002BCE816610A20A9F697A0469B4CA896E40CBF94084E34",
              itemName: "ผงล้างผักผสมถ่าน",
              itemQty: 1,
              itemPrice: "40.000000",
              itemSubtotal: "40.000000"
            }
          ]
        },
        {
          no: "01003982",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580635207833,
          paidAmount: "45.000000",
          items: [
            {
              itemCode: "0002BCE816610A20D8AC0CA9D86C407B93BDD4C7FE90D44E",
              itemName: "ปุ๋ยเม็ดเร่งดอกผล 702(1กก)",
              itemQty: 1,
              itemPrice: "25.000000",
              itemSubtotal: "25.000000"
            },
            {
              itemCode: "0002BCE816610A20C66A0773D1554EF58FED3B708874B232",
              itemName: "ปุ๋ยเม็ดบำรุงดิน 701(1กก)",
              itemQty: 1,
              itemPrice: "20.000000",
              itemSubtotal: "20.000000"
            }
          ]
        },
        {
          no: "01003981",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580615151293,
          paidAmount: "95.000000",
          items: [
            {
              itemCode: "0002BCE816610A20C469BA7D62D147109C1BAF53827469B8",
              itemName: "แชมพูมะกรูดไม่มีฟอง",
              itemQty: 1,
              itemPrice: "95.000000",
              itemSubtotal: "95.000000"
            }
          ]
        },
        {
          no: "01003980",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580615131371,
          paidAmount: "130.000000",
          items: [
            {
              itemCode: "0002BCE816610A20A2EE5B59771C418CB47BCD2BF9A974E7",
              itemName: "ถั่วคั่วทราย",
              itemQty: 1,
              itemPrice: "35.000000",
              itemSubtotal: "35.000000"
            },
            {
              itemCode: "0002BCE816610A2070B8B6EA8C4C4F849634DCBB432BA3A2",
              itemName: "แชมพูมะกรูดมีฟอง",
              itemQty: 1,
              itemPrice: "95.000000",
              itemSubtotal: "95.000000"
            }
          ]
        },
        {
          no: "01003979",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580615000949,
          paidAmount: "220.000000",
          items: [
            {
              itemCode: "0002BCE816610A2061AA7F5285FC4CC58611D3F3AC6D178E",
              itemName: "ข้าวกล้องเหนียวธรรมชาติ 5 กก",
              itemQty: 1,
              itemPrice: "220.000000",
              itemSubtotal: "220.000000"
            }
          ]
        },
        {
          no: "01004008",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580632701499,
          paidAmount: "1300.000000",
          items: [
            {
              itemCode: "0002BCE816610A2099FAD3AD67FD4B08A86A4E2520A3E4AF",
              itemName: "ปุ๋ยเม็ดบำรุงดิน 701(25กก)",
              itemQty: 2,
              itemPrice: "200.000000",
              itemSubtotal: "400.000000"
            },
            {
              itemCode: "0002BCE816610A2060DB60184788417B9186A1D16DA7DF82",
              itemName: "ปุ๋ยเม็ดเร่งดอกผล 702(50กก)",
              itemQty: 2,
              itemPrice: "450.000000",
              itemSubtotal: "900.000000"
            }
          ]
        },
        {
          no: "01004007",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580632305556,
          paidAmount: "100.000000",
          items: [
            {
              itemCode: "0002BCE816610A206106D0F349D34E6BBBC577FC650AD9E4",
              itemName: "ข้าวเหนียวธรรมชาติ 1 กก",
              itemQty: 2,
              itemPrice: "50.000000",
              itemSubtotal: "100.000000"
            }
          ]
        },
        {
          no: "01004006",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580628959704,
          paidAmount: "430.000000",
          items: [
            {
              itemCode: "0002BCE816610A20667508ED09D64126931E23EDB40DAA68",
              itemName: "ข้าวกล้องดอกมะขาม 1 กก",
              itemQty: 3,
              itemPrice: "60.000000",
              itemSubtotal: "180.000000"
            },
            {
              itemCode: "0002BCE816610A2043F618AC3C8E457EB28D148E4835D747",
              itemName: "ข้าวหอมมะลิ 5 กก",
              itemQty: 1,
              itemPrice: "250.000000",
              itemSubtotal: "250.000000"
            }
          ]
        },
        {
          no: "01004005",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580628364345,
          paidAmount: "320.000000",
          items: [
            {
              itemCode: "0002BCE816610A2061AA7F5285FC4CC58611D3F3AC6D178E",
              itemName: "ข้าวกล้องเหนียวธรรมชาติ 5 กก",
              itemQty: 1,
              itemPrice: "220.000000",
              itemSubtotal: "220.000000"
            },
            {
              itemCode: "0002BCE816610A204DF7C9D5A52D44B9A1C47FC8CBAAA39E",
              itemName: "ถั่วเหลือง 0.5 กก",
              itemQty: 2,
              itemPrice: "50.000000",
              itemSubtotal: "100.000000"
            }
          ]
        },
        {
          no: "01004004",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580627801664,
          paidAmount: "660.000000",
          items: [
            {
              itemCode: "0002BCE816610A2061AA7F5285FC4CC58611D3F3AC6D178E",
              itemName: "ข้าวกล้องเหนียวธรรมชาติ 5 กก",
              itemQty: 3,
              itemPrice: "220.000000",
              itemSubtotal: "660.000000"
            }
          ]
        },
        {
          no: "01004003",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580626042084,
          paidAmount: "80.000000",
          items: [
            {
              itemCode: "0002BCE816610A20A9F697A0469B4CA896E40CBF94084E34",
              itemName: "ผงล้างผักผสมถ่าน",
              itemQty: 2,
              itemPrice: "40.000000",
              itemSubtotal: "80.000000"
            }
          ]
        },
        {
          no: "01004002",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580625989560,
          paidAmount: "125.000000",
          items: [
            {
              itemCode: "0002BCE816610A20D8AC0CA9D86C407B93BDD4C7FE90D44E",
              itemName: "ปุ๋ยเม็ดเร่งดอกผล 702(1กก)",
              itemQty: 1,
              itemPrice: "25.000000",
              itemSubtotal: "25.000000"
            },
            {
              itemCode: "0002BCE816610A20FFDAB9A19FBB4793B0455D8B16303924",
              itemName: "ปุ๋ยมูลไส้เดือน",
              itemQty: 2,
              itemPrice: "50.000000",
              itemSubtotal: "100.000000"
            }
          ]
        },
        {
          no: "01004001",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580625691975,
          paidAmount: "0.000000",
          items: [
            {
              itemCode: "0002BCE816610A20C66A0773D1554EF58FED3B708874B232",
              itemName: "ปุ๋ยเม็ดบำรุงดิน 701(1กก)",
              itemQty: 1,
              itemPrice: "20.000000",
              itemSubtotal: "20.000000"
            }
          ]
        },
        {
          no: "01004000",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580625474491,
          paidAmount: "100.000000",
          items: [
            {
              itemCode: "0002BCE816610A204DF7C9D5A52D44B9A1C47FC8CBAAA39E",
              itemName: "ถั่วเหลือง 0.5 กก",
              itemQty: 1,
              itemPrice: "50.000000",
              itemSubtotal: "50.000000"
            },
            {
              itemCode: "0002BCE816610A202FAECB63235541EFBABEDEBE60D00626",
              itemName: "ถั่วแดง 0.5 กก",
              itemQty: 1,
              itemPrice: "50.000000",
              itemSubtotal: "50.000000"
            }
          ]
        },
        {
          no: "01003999",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580625466974,
          paidAmount: "950.000000",
          items: [
            {
              itemCode: "0002BCE816610A2043F618AC3C8E457EB28D148E4835D747",
              itemName: "ข้าวหอมมะลิ 5 กก",
              itemQty: 3,
              itemPrice: "250.000000",
              itemSubtotal: "750.000000"
            },
            {
              itemCode: "0002BCE816610A202FAECB63235541EFBABEDEBE60D00626",
              itemName: "ถั่วแดง 0.5 กก",
              itemQty: 1,
              itemPrice: "50.000000",
              itemSubtotal: "50.000000"
            },
            {
              itemCode: "0002BCE816610A20DC617D647B3B43FEB80BB560D5B143D1",
              itemName: "ถั่วเขียว 0.5 กก",
              itemQty: 1,
              itemPrice: "50.000000",
              itemSubtotal: "50.000000"
            },
            {
              itemCode: "0002BCE816610A204DF7C9D5A52D44B9A1C47FC8CBAAA39E",
              itemName: "ถั่วเหลือง 0.5 กก",
              itemQty: 1,
              itemPrice: "50.000000",
              itemSubtotal: "50.000000"
            },
            {
              itemCode: "0002BCE816610A20A4F67B569D0C4585A0829170BFAA8870",
              itemName: "น้ำยาล้างจาน",
              itemQty: 1,
              itemPrice: "50.000000",
              itemSubtotal: "50.000000"
            }
          ]
        },
        {
          no: "01003998",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580625193759,
          paidAmount: "250.000000",
          items: [
            {
              itemCode: "0002BCE816610A2043F618AC3C8E457EB28D148E4835D747",
              itemName: "ข้าวหอมมะลิ 5 กก",
              itemQty: 1,
              itemPrice: "250.000000",
              itemSubtotal: "250.000000"
            }
          ]
        },
        {
          no: "01003997",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580624417912,
          paidAmount: "120.000000",
          items: [
            {
              itemCode: "0002BCE816610A206774E754B2FC4A0AB8D0BC19AFBF651D",
              itemName: "เนยถั่ว",
              itemQty: 1,
              itemPrice: "70.000000",
              itemSubtotal: "70.000000"
            },
            {
              itemCode: "0002BCE816610A20DC617D647B3B43FEB80BB560D5B143D1",
              itemName: "ถั่วเขียว 0.5 กก",
              itemQty: 1,
              itemPrice: "50.000000",
              itemSubtotal: "50.000000"
            }
          ]
        },
        {
          no: "01003996",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580624284005,
          paidAmount: "145.000000",
          items: [
            {
              itemCode: "0002BCE816610A208D08A0D7F0FA4C95957B15817F834161",
              itemName: "ถั่วงาแผ่น",
              itemQty: 1,
              itemPrice: "60.000000",
              itemSubtotal: "60.000000"
            },
            {
              itemCode: "0002BCE816610A20B12E3997883A475F9A47C9AE1FF71BCF",
              itemName: "มะนาวดอง",
              itemQty: 1,
              itemPrice: "85.000000",
              itemSubtotal: "85.000000"
            }
          ]
        },
        {
          no: "01003995",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580623333396,
          paidAmount: "100.000000",
          items: [
            {
              itemCode: "0002BCE816610A20FF82B4A861674A18ACD6878C269B5FC3",
              itemName: "หัวเชื้อ SuperM",
              itemQty: 1,
              itemPrice: "100.000000",
              itemSubtotal: "100.000000"
            }
          ]
        },
        {
          no: "01003994",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580622979709,
          paidAmount: "100.000000",
          items: [
            {
              itemCode: "0002BCE816610A201F127D0061E748C5942E016AA689A461",
              itemName: "น้ำมันมะพร้าวมาว่า สกัดเย็น 85cc",
              itemQty: 1,
              itemPrice: "100.000000",
              itemSubtotal: "100.000000"
            }
          ]
        },
        {
          no: "04004038",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1581056789686,
          paidAmount: "50.000000",
          items: [
            {
              itemCode: "0002BCE816610A20CDBAA0139C3E43079530011D8C1C7035",
              itemName: "ข้าวกล้องเหนียวธรรมชาติ 1 กก.",
              itemQty: 1,
              itemPrice: "50.000000",
              itemSubtotal: "50.000000"
            }
          ]
        },
        {
          no: "04004037",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1581055261151,
          paidAmount: "50.000000",
          items: [
            {
              itemCode: "0002BCE816610A20CDBAA0139C3E43079530011D8C1C7035",
              itemName: "ข้าวกล้องเหนียวธรรมชาติ 1 กก.",
              itemQty: 1,
              itemPrice: "50.000000",
              itemSubtotal: "50.000000"
            }
          ]
        },
        {
          no: "04004036",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1581053857602,
          paidAmount: "60.000000",
          items: [
            {
              itemCode: "0002BCE816610A20895E4D7FEFE94E36B8D6FE5531B01085",
              itemName: "ข้าวหอมมะลิ 1 กก",
              itemQty: 1,
              itemPrice: "60.000000",
              itemSubtotal: "60.000000"
            }
          ]
        },
        {
          no: "04004035",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1581053837338,
          paidAmount: "100.000000",
          items: [
            {
              itemCode: "0002BCE816610A20CF6A9D60CF23456799AEE6DE64D9BF2C",
              itemName: "ข้าวกล้องเหนียวธรรมชาติ 2 กก",
              itemQty: 1,
              itemPrice: "100.000000",
              itemSubtotal: "100.000000"
            }
          ]
        },
        {
          no: "04004034",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1581053016152,
          paidAmount: "720.000000",
          items: [
            {
              itemCode: "0002BCE816610A2043F618AC3C8E457EB28D148E4835D747",
              itemName: "ข้าวหอมมะลิ 5 กก",
              itemQty: 1,
              itemPrice: "250.000000",
              itemSubtotal: "250.000000"
            },
            {
              itemCode: "0002BCE816610A20CD024F48D39244D9BDEB975193A4A051",
              itemName: "ข้าวเหนียวธรรมชาติ 5 กก",
              itemQty: 1,
              itemPrice: "250.000000",
              itemSubtotal: "250.000000"
            },
            {
              itemCode: "0002BCE816610A20DC617D647B3B43FEB80BB560D5B143D1",
              itemName: "ถั่วเขียว 0.5 กก",
              itemQty: 1,
              itemPrice: "50.000000",
              itemSubtotal: "50.000000"
            },
            {
              itemCode: "0002BCE816610A204C2AB58A535C4875855BF5650C29F1FF",
              itemName: "ถั่วดำ 0.5 กก",
              itemQty: 1,
              itemPrice: "50.000000",
              itemSubtotal: "50.000000"
            },
            {
              itemCode: "0002BCE816610A2078DD768FC40543738A1E911BFD187C14",
              itemName: "น้ำมะปี๊ดผสมน้ำผึ้ง",
              itemQty: 2,
              itemPrice: "60.000000",
              itemSubtotal: "120.000000"
            }
          ]
        },
        {
          no: "04004033",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1581052830007,
          paidAmount: "100.000000",
          items: [
            {
              itemCode: "0002BCE816610A20CF6A9D60CF23456799AEE6DE64D9BF2C",
              itemName: "ข้าวกล้องเหนียวธรรมชาติ 2 กก",
              itemQty: 1,
              itemPrice: "100.000000",
              itemSubtotal: "100.000000"
            }
          ]
        },
        {
          no: "04004032",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1581051689119,
          paidAmount: "250.000000",
          items: [
            {
              itemCode: "0002BCE816610A2043F618AC3C8E457EB28D148E4835D747",
              itemName: "ข้าวหอมมะลิ 5 กก",
              itemQty: 1,
              itemPrice: "250.000000",
              itemSubtotal: "250.000000"
            }
          ]
        },
        {
          no: "04004031",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1581050204439,
          paidAmount: "110.000000",
          items: [
            {
              itemCode: "0002BCE816610A20CDBAA0139C3E43079530011D8C1C7035",
              itemName: "ข้าวกล้องเหนียวธรรมชาติ 1 กก.",
              itemQty: 1,
              itemPrice: "50.000000",
              itemSubtotal: "50.000000"
            },
            {
              itemCode: "0002BCE816610A20895E4D7FEFE94E36B8D6FE5531B01085",
              itemName: "ข้าวหอมมะลิ 1 กก",
              itemQty: 1,
              itemPrice: "60.000000",
              itemSubtotal: "60.000000"
            }
          ]
        },
        {
          no: "04004030",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1581049512370,
          paidAmount: "100.000000",
          items: [
            {
              itemCode: "0002BCE816610A203AE52D0527D546568C81BEB79FA25FC1",
              itemName: "สบู่ข้าว",
              itemQty: 1,
              itemPrice: "50.000000",
              itemSubtotal: "50.000000"
            },
            {
              itemCode: "0002BCE816610A20D0B45A67E0234C11B088730936BCFF0E",
              itemName: "สบู่ถ่าน",
              itemQty: 1,
              itemPrice: "50.000000",
              itemSubtotal: "50.000000"
            }
          ]
        },
        {
          no: "04004029",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1581049477656,
          paidAmount: "50.000000",
          items: [
            {
              itemCode: "0002BCE816610A20CDBAA0139C3E43079530011D8C1C7035",
              itemName: "ข้าวกล้องเหนียวธรรมชาติ 1 กก.",
              itemQty: 1,
              itemPrice: "50.000000",
              itemSubtotal: "50.000000"
            }
          ]
        },
        {
          no: "04004028",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1581048167497,
          paidAmount: "60.000000",
          items: [
            {
              itemCode: "0002BCE816610A20895E4D7FEFE94E36B8D6FE5531B01085",
              itemName: "ข้าวหอมมะลิ 1 กก",
              itemQty: 1,
              itemPrice: "60.000000",
              itemSubtotal: "60.000000"
            }
          ]
        },
        {
          no: "04004027",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1581048167497,
          paidAmount: "470.000000",
          items: [
            {
              itemCode: "0002BCE816610A2061AA7F5285FC4CC58611D3F3AC6D178E",
              itemName: "ข้าวกล้องเหนียวธรรมชาติ 5 กก",
              itemQty: 1,
              itemPrice: "220.000000",
              itemSubtotal: "220.000000"
            },
            {
              itemCode: "0002BCE816610A2043F618AC3C8E457EB28D148E4835D747",
              itemName: "ข้าวหอมมะลิ 5 กก",
              itemQty: 1,
              itemPrice: "250.000000",
              itemSubtotal: "250.000000"
            }
          ]
        },
        {
          no: "04004026",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1581048167497,
          paidAmount: "220.000000",
          items: [
            {
              itemCode: "0002BCE816610A2061AA7F5285FC4CC58611D3F3AC6D178E",
              itemName: "ข้าวกล้องเหนียวธรรมชาติ 5 กก",
              itemQty: 1,
              itemPrice: "220.000000",
              itemSubtotal: "220.000000"
            }
          ]
        },
        {
          no: "04004025",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1581048167497,
          paidAmount: "205.000000",
          items: [
            {
              itemCode: "0002BCE816610A208AD03B1C412A4059ADA85030EB721A86",
              itemName: "กล้วยตาก Fruitboy",
              itemQty: 1,
              itemPrice: "55.000000",
              itemSubtotal: "55.000000"
            },
            {
              itemCode: "0002BCE816610A20CDBAA0139C3E43079530011D8C1C7035",
              itemName: "ข้าวกล้องเหนียวธรรมชาติ 1 กก.",
              itemQty: 1,
              itemPrice: "50.000000",
              itemSubtotal: "50.000000"
            },
            {
              itemCode: "0002BCE816610A20CF6A9D60CF23456799AEE6DE64D9BF2C",
              itemName: "ข้าวกล้องเหนียวธรรมชาติ 2 กก",
              itemQty: 1,
              itemPrice: "100.000000",
              itemSubtotal: "100.000000"
            }
          ]
        },
        {
          no: "04004024",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1581048167497,
          paidAmount: "100.000000",
          items: [
            {
              itemCode: "0002BCE816610A20CF6A9D60CF23456799AEE6DE64D9BF2C",
              itemName: "ข้าวกล้องเหนียวธรรมชาติ 2 กก",
              itemQty: 1,
              itemPrice: "100.000000",
              itemSubtotal: "100.000000"
            }
          ]
        },
        {
          no: "01004053",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1581138642684,
          paidAmount: "220.000000",
          items: [
            {
              itemCode: "0002BCE816610A2061AA7F5285FC4CC58611D3F3AC6D178E",
              itemName: "ข้าวกล้องเหนียวธรรมชาติ 5 กก",
              itemQty: 1,
              itemPrice: "220.000000",
              itemSubtotal: "220.000000"
            }
          ]
        },
        {
          no: "01004052",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1581137428737,
          paidAmount: "120.000000",
          items: [
            {
              itemCode: "0002BCE816610A208D08A0D7F0FA4C95957B15817F834161",
              itemName: "ถั่วงาแผ่น",
              itemQty: 2,
              itemPrice: "60.000000",
              itemSubtotal: "120.000000"
            }
          ]
        },
        {
          no: "01004051",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1581137168256,
          paidAmount: "145.000000",
          items: [
            {
              itemCode: "0002BCE816610A20B12E3997883A475F9A47C9AE1FF71BCF",
              itemName: "มะนาวดอง",
              itemQty: 1,
              itemPrice: "85.000000",
              itemSubtotal: "85.000000"
            },
            {
              itemCode: "0002BCE816610A20895E4D7FEFE94E36B8D6FE5531B01085",
              itemName: "ข้าวหอมมะลิ 1 กก",
              itemQty: 1,
              itemPrice: "60.000000",
              itemSubtotal: "60.000000"
            }
          ]
        },
        {
          no: "01004050",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1581136896046,
          paidAmount: "45.000000",
          items: [
            {
              itemCode: "0002BCE8185EF1EDD5F4946F92154D4B9F144F8E7E467749",
              itemName: "มะขามตาโต",
              itemQty: 1,
              itemPrice: "45.000000",
              itemSubtotal: "45.000000"
            }
          ]
        },
        {
          no: "01004049",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1581136757109,
          paidAmount: "315.000000",
          items: [
            {
              itemCode: "0002BCE816610A20C469BA7D62D147109C1BAF53827469B8",
              itemName: "แชมพูมะกรูดไม่มีฟอง",
              itemQty: 1,
              itemPrice: "95.000000",
              itemSubtotal: "95.000000"
            },
            {
              itemCode: "0002BCE816610A208AD03B1C412A4059ADA85030EB721A86",
              itemName: "กล้วยตาก Fruitboy",
              itemQty: 4,
              itemPrice: "55.000000",
              itemSubtotal: "220.000000"
            }
          ]
        },
        {
          no: "01004048",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1581136421782,
          paidAmount: "1015.000000",
          items: [
            {
              itemCode: "0002BCE816610A20C469BA7D62D147109C1BAF53827469B8",
              itemName: "แชมพูมะกรูดไม่มีฟอง",
              itemQty: 1,
              itemPrice: "95.000000",
              itemSubtotal: "95.000000"
            },
            {
              itemCode: "0002BCE81689F26EED528BD1B7C14D20989C3FDEFEB520F8",
              itemName: "สบู่เหลวน้ำนมข้าว&น้ำผึ้ง",
              itemQty: 1,
              itemPrice: "115.000000",
              itemSubtotal: "115.000000"
            },
            {
              itemCode: "0002BCE816610A206106D0F349D34E6BBBC577FC650AD9E4",
              itemName: "ข้าวเหนียวธรรมชาติ 1 กก",
              itemQty: 2,
              itemPrice: "50.000000",
              itemSubtotal: "100.000000"
            },
            {
              itemCode: "0002BCE816610A2061AA7F5285FC4CC58611D3F3AC6D178E",
              itemName: "ข้าวกล้องเหนียวธรรมชาติ 5 กก",
              itemQty: 2,
              itemPrice: "220.000000",
              itemSubtotal: "440.000000"
            },
            {
              itemCode: "0002BCE816610A203C1496F7F0F54580BB1E43F780165188",
              itemName: "ยาหม่องสเลดพังพอน",
              itemQty: 1,
              itemPrice: "45.000000",
              itemSubtotal: "45.000000"
            },
            {
              itemCode: "0002BCE816610A20FA05329D2A184E5D9FC4DBB87042F8AF",
              itemName: "น้ำมันมะพร้าวมาว่า สกัดเย็น 250cc",
              itemQty: 1,
              itemPrice: "220.000000",
              itemSubtotal: "220.000000"
            }
          ]
        },
        {
          no: "01004047",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1581133418526,
          paidAmount: "150.000000",
          items: [
            {
              itemCode: "0002BCE816610A20CDBAA0139C3E43079530011D8C1C7035",
              itemName: "ข้าวกล้องเหนียวธรรมชาติ 1 กก.",
              itemQty: 1,
              itemPrice: "50.000000",
              itemSubtotal: "50.000000"
            },
            {
              itemCode: "0002BCE816610A206106D0F349D34E6BBBC577FC650AD9E4",
              itemName: "ข้าวเหนียวธรรมชาติ 1 กก",
              itemQty: 1,
              itemPrice: "50.000000",
              itemSubtotal: "50.000000"
            },
            {
              itemCode: "0002BCE816610A204DF7C9D5A52D44B9A1C47FC8CBAAA39E",
              itemName: "ถั่วเหลือง 0.5 กก",
              itemQty: 1,
              itemPrice: "50.000000",
              itemSubtotal: "50.000000"
            }
          ]
        },
        {
          no: "01004046",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1581133170842,
          paidAmount: "400.000000",
          items: [
            {
              itemCode: "0002BCE816610A204DF7C9D5A52D44B9A1C47FC8CBAAA39E",
              itemName: "ถั่วเหลือง 0.5 กก",
              itemQty: 4,
              itemPrice: "50.000000",
              itemSubtotal: "200.000000"
            },
            {
              itemCode: "0002BCE816610A208DC573C6E0A043DE986EDFC6B8C6F805",
              itemName: "ถั่วลิสง 0.5 กก",
              itemQty: 4,
              itemPrice: "50.000000",
              itemSubtotal: "200.000000"
            }
          ]
        },
        {
          no: "01004045",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1581132809492,
          paidAmount: "250.000000",
          items: [
            {
              itemCode: "0002BCE816610A2043F618AC3C8E457EB28D148E4835D747",
              itemName: "ข้าวหอมมะลิ 5 กก",
              itemQty: 1,
              itemPrice: "250.000000",
              itemSubtotal: "250.000000"
            }
          ]
        },
        {
          no: "01004044",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1581132668931,
          paidAmount: "420.000000",
          items: [
            {
              itemCode: "0002BCE816610A20FF82B4A861674A18ACD6878C269B5FC3",
              itemName: "หัวเชื้อ SuperM",
              itemQty: 2,
              itemPrice: "100.000000",
              itemSubtotal: "200.000000"
            },
            {
              itemCode: "0002BCE816610A2061AA7F5285FC4CC58611D3F3AC6D178E",
              itemName: "ข้าวกล้องเหนียวธรรมชาติ 5 กก",
              itemQty: 1,
              itemPrice: "220.000000",
              itemSubtotal: "220.000000"
            }
          ]
        },
        {
          no: "04004043",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1581060955618,
          paidAmount: "50.000000",
          items: [
            {
              itemCode: "0002BCE816610A20CDBAA0139C3E43079530011D8C1C7035",
              itemName: "ข้าวกล้องเหนียวธรรมชาติ 1 กก.",
              itemQty: 1,
              itemPrice: "50.000000",
              itemSubtotal: "50.000000"
            }
          ]
        },
        {
          no: "04004042",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1581060093910,
          paidAmount: "80.000000",
          items: [
            {
              itemCode: "0002BCE816610A20804F44A3DAAB49339427A40083231597",
              itemName: "น้ำมันเขียว",
              itemQty: 1,
              itemPrice: "80.000000",
              itemSubtotal: "80.000000"
            }
          ]
        },
        {
          no: "04004041",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1581057916126,
          paidAmount: "130.000000",
          items: [
            {
              itemCode: "0002BCE816610A208DC573C6E0A043DE986EDFC6B8C6F805",
              itemName: "ถั่วลิสง 0.5 กก",
              itemQty: 1,
              itemPrice: "50.000000",
              itemSubtotal: "50.000000"
            },
            {
              itemCode: "0002BCE816610A20804F44A3DAAB49339427A40083231597",
              itemName: "น้ำมันเขียว",
              itemQty: 1,
              itemPrice: "80.000000",
              itemSubtotal: "80.000000"
            }
          ]
        },
        {
          no: "04004040",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1581057628789,
          paidAmount: "80.000000",
          items: [
            {
              itemCode: "0002BCE816610A20804F44A3DAAB49339427A40083231597",
              itemName: "น้ำมันเขียว",
              itemQty: 1,
              itemPrice: "80.000000",
              itemSubtotal: "80.000000"
            }
          ]
        },
        {
          no: "04004039",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1581057590972,
          paidAmount: "435.000000",
          items: [
            {
              itemCode: "0002BCE816610A2061AA7F5285FC4CC58611D3F3AC6D178E",
              itemName: "ข้าวกล้องเหนียวธรรมชาติ 5 กก",
              itemQty: 1,
              itemPrice: "220.000000",
              itemSubtotal: "220.000000"
            },
            {
              itemCode: "0002BCE816610A20DC617D647B3B43FEB80BB560D5B143D1",
              itemName: "ถั่วเขียว 0.5 กก",
              itemQty: 1,
              itemPrice: "50.000000",
              itemSubtotal: "50.000000"
            },
            {
              itemCode: "0002BCE816610A20E0604B85ADF94E58AC13418EE94BF4CF",
              itemName: "กล้วยไส้มะขาม",
              itemQty: 1,
              itemPrice: "45.000000",
              itemSubtotal: "45.000000"
            },
            {
              itemCode: "0002BCE816610A208D08A0D7F0FA4C95957B15817F834161",
              itemName: "ถั่วงาแผ่น",
              itemQty: 1,
              itemPrice: "60.000000",
              itemSubtotal: "60.000000"
            },
            {
              itemCode: "0002BCE816610A200A52F7FBF58040CF93FF416B35B25C0E",
              itemName: "สเปรย์ไล่ยุงสมุนไพร",
              itemQty: 1,
              itemPrice: "60.000000",
              itemSubtotal: "60.000000"
            }
          ]
        },
        {
          no: "01003963",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580540899546,
          paidAmount: "100.000000",
          items: [
            {
              itemCode: "0002BCE816610A20CF6A9D60CF23456799AEE6DE64D9BF2C",
              itemName: "ข้าวกล้องเหนียวธรรมชาติ 2 กก",
              itemQty: 1,
              itemPrice: "100.000000",
              itemSubtotal: "100.000000"
            }
          ]
        },
        {
          no: "01003962",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580540862523,
          paidAmount: "100.000000",
          items: [
            {
              itemCode: "0002BCE816610A20CF6A9D60CF23456799AEE6DE64D9BF2C",
              itemName: "ข้าวกล้องเหนียวธรรมชาติ 2 กก",
              itemQty: 1,
              itemPrice: "100.000000",
              itemSubtotal: "100.000000"
            }
          ]
        },
        {
          no: "01003961",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580540775781,
          paidAmount: "620.000000",
          items: [
            {
              itemCode: "0002BCE816610A2061AA7F5285FC4CC58611D3F3AC6D178E",
              itemName: "ข้าวกล้องเหนียวธรรมชาติ 5 กก",
              itemQty: 2,
              itemPrice: "220.000000",
              itemSubtotal: "440.000000"
            },
            {
              itemCode: "0002BCE816610A20667508ED09D64126931E23EDB40DAA68",
              itemName: "ข้าวกล้องดอกมะขาม 1 กก",
              itemQty: 1,
              itemPrice: "60.000000",
              itemSubtotal: "60.000000"
            },
            {
              itemCode: "0002BCE816610A20007BE4C86E664B288F5083C6A873EBBB",
              itemName: "ข้าวกล้องหอมมะลิ 1 กก",
              itemQty: 2,
              itemPrice: "60.000000",
              itemSubtotal: "120.000000"
            }
          ]
        },
        {
          no: "01003960",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580540191813,
          paidAmount: "100.000000",
          items: [
            {
              itemCode: "0002BCE816610A20CDBAA0139C3E43079530011D8C1C7035",
              itemName: "ข้าวกล้องเหนียวธรรมชาติ 1 กก.",
              itemQty: 2,
              itemPrice: "50.000000",
              itemSubtotal: "100.000000"
            }
          ]
        },
        {
          no: "01003959",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580537638859,
          paidAmount: "220.000000",
          items: [
            {
              itemCode: "0002BCE816610A2061AA7F5285FC4CC58611D3F3AC6D178E",
              itemName: "ข้าวกล้องเหนียวธรรมชาติ 5 กก",
              itemQty: 1,
              itemPrice: "220.000000",
              itemSubtotal: "220.000000"
            }
          ]
        },
        {
          no: "01003958",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580536295131,
          paidAmount: "80.000000",
          items: [
            {
              itemCode: "0002BCE816610A20804F44A3DAAB49339427A40083231597",
              itemName: "น้ำมันเขียว",
              itemQty: 1,
              itemPrice: "80.000000",
              itemSubtotal: "80.000000"
            }
          ]
        },
        {
          no: "01003957",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580536175810,
          paidAmount: "240.000000",
          items: [
            {
              itemCode: "0002BCE816610A20E3A5EBF03C264649BDA3FF3A8F574FF2",
              itemName: "หนังสือ สวน",
              itemQty: 1,
              itemPrice: "160.000000",
              itemSubtotal: "160.000000"
            },
            {
              itemCode: "0002BCE816610A208D58B0D537EE47F599626EA7E56C93C6",
              itemName: "คู่มือเก็บเมล็ดพันธุ์ประจำบ้าน",
              itemQty: 1,
              itemPrice: "80.000000",
              itemSubtotal: "80.000000"
            }
          ]
        },
        {
          no: "01003956",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580536097534,
          paidAmount: "100.000000",
          items: [
            {
              itemCode: "0002BCE816610A201F127D0061E748C5942E016AA689A461",
              itemName: "น้ำมันมะพร้าวมาว่า สกัดเย็น 85cc",
              itemQty: 1,
              itemPrice: "100.000000",
              itemSubtotal: "100.000000"
            }
          ]
        },
        {
          no: "01003955",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580535986034,
          paidAmount: "440.000000",
          items: [
            {
              itemCode: "0002BCE816610A2061AA7F5285FC4CC58611D3F3AC6D178E",
              itemName: "ข้าวกล้องเหนียวธรรมชาติ 5 กก",
              itemQty: 2,
              itemPrice: "220.000000",
              itemSubtotal: "440.000000"
            }
          ]
        },
        {
          no: "01003954",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580535927010,
          paidAmount: "100.000000",
          items: [
            {
              itemCode: "0002BCE816610A20DC617D647B3B43FEB80BB560D5B143D1",
              itemName: "ถั่วเขียว 0.5 กก",
              itemQty: 2,
              itemPrice: "50.000000",
              itemSubtotal: "100.000000"
            }
          ]
        },
        {
          no: "01003953",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580535523621,
          paidAmount: "220.000000",
          items: [
            {
              itemCode: "0002BCE816610A2061AA7F5285FC4CC58611D3F3AC6D178E",
              itemName: "ข้าวกล้องเหนียวธรรมชาติ 5 กก",
              itemQty: 1,
              itemPrice: "220.000000",
              itemSubtotal: "220.000000"
            }
          ]
        },
        {
          no: "01003952",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580535272932,
          paidAmount: "1250.000000",
          items: [
            {
              itemCode: "0002BCE816610A2043F618AC3C8E457EB28D148E4835D747",
              itemName: "ข้าวหอมมะลิ 5 กก",
              itemQty: 4,
              itemPrice: "250.000000",
              itemSubtotal: "1000.000000"
            },
            {
              itemCode: "0002BCE816610A20CD024F48D39244D9BDEB975193A4A051",
              itemName: "ข้าวเหนียวธรรมชาติ 5 กก",
              itemQty: 1,
              itemPrice: "250.000000",
              itemSubtotal: "250.000000"
            }
          ]
        },
        {
          no: "01003951",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580534907607,
          paidAmount: "240.000000",
          items: [
            {
              itemCode: "0002BCE816610A203A4E3FA50DD44E729019EE17CA13464A",
              itemName: "หนังสือ ลูกโจน",
              itemQty: 1,
              itemPrice: "160.000000",
              itemSubtotal: "160.000000"
            },
            {
              itemCode: "0002BCE816610A208D58B0D537EE47F599626EA7E56C93C6",
              itemName: "คู่มือเก็บเมล็ดพันธุ์ประจำบ้าน",
              itemQty: 1,
              itemPrice: "80.000000",
              itemSubtotal: "80.000000"
            }
          ]
        },
        {
          no: "01003950",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580534763329,
          paidAmount: "40.000000",
          items: [
            {
              itemCode: "0002BCE816610A20A9F697A0469B4CA896E40CBF94084E34",
              itemName: "ผงล้างผักผสมถ่าน",
              itemQty: 1,
              itemPrice: "40.000000",
              itemSubtotal: "40.000000"
            }
          ]
        },
        {
          no: "01003949",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580534530671,
          paidAmount: "225.000000",
          items: [
            {
              itemCode: "0002BCE816610A20458FFC884BF04AEAB427107CD0C6D89A",
              itemName: "ขนมปังกรอบไข่เค็ม",
              itemQty: 2,
              itemPrice: "55.000000",
              itemSubtotal: "110.000000"
            },
            {
              itemCode: "0002BCE81689F26EED528BD1B7C14D20989C3FDEFEB520F8",
              itemName: "สบู่เหลวน้ำนมข้าว&น้ำผึ้ง",
              itemQty: 1,
              itemPrice: "115.000000",
              itemSubtotal: "115.000000"
            }
          ]
        },
        {
          no: "04004023",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1581048167497,
          paidAmount: "55.000000",
          items: [
            {
              itemCode: "0002BCE816610A208AD03B1C412A4059ADA85030EB721A86",
              itemName: "กล้วยตาก Fruitboy",
              itemQty: 1,
              itemPrice: "55.000000",
              itemSubtotal: "55.000000"
            }
          ]
        },
        {
          no: "04004022",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1581048167497,
          paidAmount: "250.000000",
          items: [
            {
              itemCode: "0002BCE816610A20DC617D647B3B43FEB80BB560D5B143D1",
              itemName: "ถั่วเขียว 0.5 กก",
              itemQty: 1,
              itemPrice: "50.000000",
              itemSubtotal: "50.000000"
            },
            {
              itemCode: "0002BCE816610A202FAECB63235541EFBABEDEBE60D00626",
              itemName: "ถั่วแดง 0.5 กก",
              itemQty: 1,
              itemPrice: "50.000000",
              itemSubtotal: "50.000000"
            },
            {
              itemCode: "0002BCE816610A204C2AB58A535C4875855BF5650C29F1FF",
              itemName: "ถั่วดำ 0.5 กก",
              itemQty: 1,
              itemPrice: "50.000000",
              itemSubtotal: "50.000000"
            },
            {
              itemCode: "0002BCE816610A20CDBAA0139C3E43079530011D8C1C7035",
              itemName: "ข้าวกล้องเหนียวธรรมชาติ 1 กก.",
              itemQty: 1,
              itemPrice: "50.000000",
              itemSubtotal: "50.000000"
            },
            {
              itemCode: "0002BCE816610A206106D0F349D34E6BBBC577FC650AD9E4",
              itemName: "ข้าวเหนียวธรรมชาติ 1 กก",
              itemQty: 1,
              itemPrice: "50.000000",
              itemSubtotal: "50.000000"
            }
          ]
        },
        {
          no: "04004021",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1581048167497,
          paidAmount: "500.000000",
          items: [
            {
              itemCode: "0002BCE816610A20CD024F48D39244D9BDEB975193A4A051",
              itemName: "ข้าวเหนียวธรรมชาติ 5 กก",
              itemQty: 2,
              itemPrice: "250.000000",
              itemSubtotal: "500.000000"
            }
          ]
        },
        {
          no: "04004020",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580639394665,
          paidAmount: "200.000000",
          items: [
            {
              itemCode: "0002BCEA0BE1913017427225B7B742548D95AC851D211716",
              itemName: "นมปรุงแต่งรสสตรอเบอร์รี่ 200cc.",
              itemQty: 4,
              itemPrice: "20.000000",
              itemSubtotal: "80.000000"
            },
            {
              itemCode: "0002BCEA0BE1913094CADB994FBD414AB27AF1C9277EDC96",
              itemName: "นมปรุงแต่งรสช็อกโกแล็ต 200cc.",
              itemQty: 5,
              itemPrice: "20.000000",
              itemSubtotal: "100.000000"
            },
            {
              itemCode: "0002BCEA0B5A6D341EB0C469B0F04B7F841F89370F744BFB",
              itemName: "นมพาสเจอร์ไรส์ 200cc",
              itemQty: 1,
              itemPrice: "20.000000",
              itemSubtotal: "20.000000"
            }
          ]
        },
        {
          no: "01004019",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580638062230,
          paidAmount: "140.000000",
          items: [
            {
              itemCode: "0002BCE816610A20659887AC5BEC443C8AA310555194CB2C",
              itemName: "น้ำผึ้งดอกไม้ป่า",
              itemQty: 1,
              itemPrice: "140.000000",
              itemSubtotal: "140.000000"
            }
          ]
        },
        {
          no: "01004018",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580637924402,
          paidAmount: "80.000000",
          items: [
            {
              itemCode: "000305B1177C34F57A442E32B2404059965736E813053EC5",
              itemName: "นมอัดเม็ด แดรี่โฮม",
              itemQty: 2,
              itemPrice: "30.000000",
              itemSubtotal: "60.000000"
            },
            {
              itemCode: "0002BCEA0BE1913017427225B7B742548D95AC851D211716",
              itemName: "นมปรุงแต่งรสสตรอเบอร์รี่ 200cc.",
              itemQty: 1,
              itemPrice: "20.000000",
              itemSubtotal: "20.000000"
            }
          ]
        },
        {
          no: "01004017",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580637092166,
          paidAmount: "120.000000",
          items: [
            {
              itemCode: "0002BCE816610A20F069FE803E564B65A2B875FBC64F345C",
              itemName: "ชาอัสสัมคั่วเตาฟืน",
              itemQty: 2,
              itemPrice: "60.000000",
              itemSubtotal: "120.000000"
            }
          ]
        },
        {
          no: "01004016",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580637036852,
          paidAmount: "95.000000",
          items: [
            {
              itemCode: "0002BCE816610A20C469BA7D62D147109C1BAF53827469B8",
              itemName: "แชมพูมะกรูดไม่มีฟอง",
              itemQty: 1,
              itemPrice: "95.000000",
              itemSubtotal: "95.000000"
            }
          ]
        },
        {
          no: "01004015",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580636992764,
          paidAmount: "500.000000",
          items: [
            {
              itemCode: "0002BCE816610A2043F618AC3C8E457EB28D148E4835D747",
              itemName: "ข้าวหอมมะลิ 5 กก",
              itemQty: 2,
              itemPrice: "250.000000",
              itemSubtotal: "500.000000"
            }
          ]
        },
        {
          no: "01004014",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580636049911,
          paidAmount: "415.000000",
          items: [
            {
              itemCode: "0002BCEA082E1E4E261D1B904A9E4186815E505FB87364CA",
              itemName: "Cappuccino",
              itemQty: 1,
              itemPrice: "60.000000",
              itemSubtotal: "60.000000"
            },
            {
              itemCode: "0002BCEA082E1E4EE4F4CAAD6FA740AF9882F65CC18C88D9",
              itemName: "Late",
              itemQty: 1,
              itemPrice: "50.000000",
              itemSubtotal: "50.000000"
            },
            {
              itemCode: "0002BCEA082E1E4EE4F4CAAD6FA740AF9882F65CC18C88D9",
              itemName: "Late",
              itemQty: 1,
              itemPrice: "60.000000",
              itemSubtotal: "60.000000"
            },
            {
              itemCode: "0002BCEA082E1E4E4C72072018D44CCF8E1C711C887B9795",
              itemName: "Americano",
              itemQty: 3,
              itemPrice: "40.000000",
              itemSubtotal: "120.000000"
            },
            {
              itemCode: "0002BCEA082E1E4EEF340AE379FC4FF2B039FB77F50163BF",
              itemName: "Kombucha",
              itemQty: 1,
              itemPrice: "60.000000",
              itemSubtotal: "60.000000"
            },
            {
              itemCode: "0002BCEA082E1E4E92DC22ABEA63490AB956B6181DCD305D",
              itemName: "กรีนบาลานซ์",
              itemQty: 1,
              itemPrice: "60.000000",
              itemSubtotal: "65.000000"
            }
          ]
        },
        {
          no: "01004013",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580637761589,
          paidAmount: "325.000000",
          items: [
            {
              itemCode: "0002BCEA082E1E4E4C72072018D44CCF8E1C711C887B9795",
              itemName: "Americano",
              itemQty: 1,
              itemPrice: "40.000000",
              itemSubtotal: "45.000000"
            },
            {
              itemCode: "0002BCEA082E1E4EEF340AE379FC4FF2B039FB77F50163BF",
              itemName: "Kombucha",
              itemQty: 2,
              itemPrice: "60.000000",
              itemSubtotal: "120.000000"
            },
            {
              itemCode: "0002BCEA082E1E4E261D1B904A9E4186815E505FB87364CA",
              itemName: "Cappuccino",
              itemQty: 1,
              itemPrice: "60.000000",
              itemSubtotal: "65.000000"
            },
            {
              itemCode: "0002BCEA082E1E4EE4F4CAAD6FA740AF9882F65CC18C88D9",
              itemName: "Late",
              itemQty: 1,
              itemPrice: "60.000000",
              itemSubtotal: "60.000000"
            },
            {
              itemCode: "000305B1177C34F57A442E32B2404059965736E813053EC5",
              itemName: "นมอัดเม็ด แดรี่โฮม",
              itemQty: 1,
              itemPrice: "35.000000",
              itemSubtotal: "35.000000"
            }
          ]
        },
        {
          no: "01004012",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580635226183,
          paidAmount: "25.000000",
          items: [
            {
              itemCode: "0002BCE816610A20D8AC0CA9D86C407B93BDD4C7FE90D44E",
              itemName: "ปุ๋ยเม็ดเร่งดอกผล 702(1กก)",
              itemQty: 1,
              itemPrice: "25.000000",
              itemSubtotal: "25.000000"
            }
          ]
        },
        {
          no: "01004011",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580634097792,
          paidAmount: "140.000000",
          items: [
            {
              itemCode: "0002BCE816610A20659887AC5BEC443C8AA310555194CB2C",
              itemName: "น้ำผึ้งดอกไม้ป่า",
              itemQty: 1,
              itemPrice: "140.000000",
              itemSubtotal: "140.000000"
            }
          ]
        },
        {
          no: "01004010",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580633850792,
          paidAmount: "1020.000000",
          items: [
            {
              itemCode: "0002BCE816610A20804F44A3DAAB49339427A40083231597",
              itemName: "น้ำมันเขียว",
              itemQty: 12,
              itemPrice: "80.000000",
              itemSubtotal: "960.000000"
            },
            {
              itemCode: "0002BCE816610A208D08A0D7F0FA4C95957B15817F834161",
              itemName: "ถั่วงาแผ่น",
              itemQty: 1,
              itemPrice: "60.000000",
              itemSubtotal: "60.000000"
            }
          ]
        },
        {
          no: "01004009",
          status: "shipped",
          paymentProvider: "cash",
          paidAt: 1580632901595,
          paidAmount: "85.000000",
          items: [
            {
              itemCode: "0002BCE816610A206106D0F349D34E6BBBC577FC650AD9E4",
              itemName: "ข้าวเหนียวธรรมชาติ 1 กก",
              itemQty: 1,
              itemPrice: "50.000000",
              itemSubtotal: "50.000000"
            },
            {
              itemCode: "0002BCE816610A20A2EE5B59771C418CB47BCD2BF9A974E7",
              itemName: "ถั่วคั่วทราย",
              itemQty: 1,
              itemPrice: "35.000000",
              itemSubtotal: "35.000000"
            }
          ]
        }
      ]
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

  it("should be Sale post import use token", done => {
    request(app)
      .post("/api/import/sales")
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
  afterEach(done => {
    Sale.deleteMany().exec(done);
  });
});

describe("ocha interface test", () => {
  it("should be get sale data from ochar", done => {
    // Step 1 : get shop list
    request(app)
      .post("/api/interface/ocha/shops")
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        var resp = res.body;
        // Step 2 : User choose shop for get set-cookie
        request(app)
          .post("/api/interface/ocha/shops/selected")
          .send({ branch_shop_id: resp[3].shop_id })
          .expect(200)
          .end((err, res) => {
            if (err) {
              return done(err);
            }
            var payload = {
              posocha: res.body.posocha,
              filter: { start_time: 1580490000, end_time: 1582995599 },
              pagination: { page_size: 15, pagination_result_count: 100 }
            };
            // Step 3 : get first page to 15 orders
            request(app)
              .post("/api/interface/ocha")
              .send(payload)
              .expect(200)
              .end((err, res) => {
                if (err) {
                  return done(err);
                }
                done();
              });
          });
      });
  });
});
