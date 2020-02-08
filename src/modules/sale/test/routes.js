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
    mockup = [
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
        ],
        shopId: 66344,
        shopName: "ข้าวแปรรูป พระราม๙"
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
        ],
        shopId: 66344,
        shopName: "ข้าวแปรรูป พระราม๙"
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
        ],
        shopId: 66344,
        shopName: "ข้าวแปรรูป พระราม๙"
      },
      {
        no: "02005612",
        status: "shipped",
        paymentProvider: "cash",
        paidAt: 1581133031421,
        paidAmount: "74.000000",
        items: [
          {
            itemCode: "0002D57E089144268C96302117264EEBA56350C3B7779A2D",
            itemName: "ต้นหอม",
            itemQty: 1,
            itemPrice: "100.000000",
            itemSubtotal: "16.000000"
          },
          {
            itemCode: "0002D57E089ECD4BD30ED08F4A2B41CC9107B938438A6104",
            itemName: "สะระแหน่",
            itemQty: 1,
            itemPrice: "100.000000",
            itemSubtotal: "20.000000"
          },
          {
            itemCode: "0002D57E08903662577136E9FD58427A9B6ABF1DAA747A22",
            itemName: "มะเขือเปราะ",
            itemQty: 1,
            itemPrice: "50.000000",
            itemSubtotal: "38.000000"
          }
        ],
        shopId: 67459,
        shopName: "ผัก พระราม๙"
      },
      {
        no: "02005611",
        status: "shipped",
        paymentProvider: "cash",
        paidAt: 1581132921972,
        paidAmount: "108.000000",
        items: [
          {
            itemCode: "0002D57E150FA1974E1E00B30E5747429642666C1D037AFC",
            itemName: "กะหล่ำดอก",
            itemQty: 1,
            itemPrice: "60.000000",
            itemSubtotal: "24.000000"
          },
          {
            itemCode: "0002D57D18A2CDD53ECF8F58FA80409BB6EAE39A0AF5A2E6",
            itemName: "บร๊อคโคลี่",
            itemQty: 1,
            itemPrice: "60.000000",
            itemSubtotal: "40.200000"
          },
          {
            itemCode: "0002D57E08914426FE4080591EC24348B2D483EB6BC60F70",
            itemName: "มะเขือพวง",
            itemQty: 1,
            itemPrice: "100.000000",
            itemSubtotal: "16.000000"
          },
          {
            itemCode: "0002D57E0890366256E7E71DCC1E456DACCADBF71FFA0118",
            itemName: "ฝรั่ง",
            itemQty: 1,
            itemPrice: "60.000000",
            itemSubtotal: "28.200000"
          }
        ],
        shopId: 67459,
        shopName: "ผัก พระราม๙"
      },
      {
        no: "02005610",
        status: "shipped",
        paymentProvider: "cash",
        paidAt: 1581132719713,
        paidAmount: "118.000000",
        items: [
          {
            itemCode: "0002D57E089ECD4BD30ED08F4A2B41CC9107B938438A6104",
            itemName: "สะระแหน่",
            itemQty: 1,
            itemPrice: "100.000000",
            itemSubtotal: "10.000000"
          },
          {
            itemCode: "0002D57E150FA1974E1E00B30E5747429642666C1D037AFC",
            itemName: "กะหล่ำดอก",
            itemQty: 1,
            itemPrice: "60.000000",
            itemSubtotal: "18.000000"
          },
          {
            itemCode: "0002D57E0C32B8438D484CBED85D4D6A9E63FA113E3F2999",
            itemName: "มะระขี้นก",
            itemQty: 1,
            itemPrice: "100.000000",
            itemSubtotal: "30.000000"
          },
          {
            itemCode: "0002D57E08914426DA59BDAA3BE341E7854114ABD08DABC8",
            itemName: "ผักปลัง",
            itemQty: 1,
            itemPrice: "100.000000",
            itemSubtotal: "20.000000"
          },
          {
            itemCode: "0002D57E0C32B843E949308AA5DD444DAC7F705B403ACF5A",
            itemName: "ใบเหลียง",
            itemQty: 1,
            itemPrice: "40.000000",
            itemSubtotal: "40.000000"
          }
        ],
        shopId: 67459,
        shopName: "ผัก พระราม๙"
      },
      {
        no: "02005609",
        status: "shipped",
        paymentProvider: "cash",
        paidAt: 1581132532546,
        paidAmount: "677.000000",
        items: [
          {
            itemCode: "0002D57E089036628BC10D28666147A3B0DA5657A6FFF3EB",
            itemName: "กล้วยน้ำว้า",
            itemQty: 2,
            itemPrice: "30.000000",
            itemSubtotal: "60.000000"
          },
          {
            itemCode: "0002D57E089036624127EC7D5F3B48338A0BA5CFC8922F69",
            itemName: "มะละกอสุก",
            itemQty: 1,
            itemPrice: "50.000000",
            itemSubtotal: "60.000000"
          },
          {
            itemCode: "0002D57E08903662C44DC8DA9A0D41238E2F77BF9EF4C68A",
            itemName: "ฟักทอง",
            itemQty: 1,
            itemPrice: "50.000000",
            itemSubtotal: "80.000000"
          },
          {
            itemCode: "0002D57E08903662F1C531BF505944388BDD884FB14482C3",
            itemName: "มะนาว(กก)",
            itemQty: 1,
            itemPrice: "60.000000",
            itemSubtotal: "50.400000"
          },
          {
            itemCode: "0002D57E089F3E482E4BD6B1FCD04CF9AFC53612A25B33CA",
            itemName: "มันม่วง",
            itemQty: 1,
            itemPrice: "50.000000",
            itemSubtotal: "50.000000"
          },
          {
            itemCode: "0002D57E089144264526A921150B41509804A2E40A73A1E1",
            itemName: "แตงกวา",
            itemQty: 1,
            itemPrice: "50.000000",
            itemSubtotal: "17.000000"
          },
          {
            itemCode: "0002D57E08914426F1A152820A73409FAB836D8A4A9A2430",
            itemName: "กวางตุ้งฮ่องเต้",
            itemQty: 1,
            itemPrice: "100.000000",
            itemSubtotal: "56.000000"
          },
          {
            itemCode: "0002D57D09A96E912AA0B9325BAB41DCAAF193879D060136",
            itemName: "ถั่วฝักยาว",
            itemQty: 1,
            itemPrice: "100.000000",
            itemSubtotal: "50.000000"
          },
          {
            itemCode: "0002D57E08914426F1A152820A73409FAB836D8A4A9A2430",
            itemName: "กวางตุ้งฮ่องเต้",
            itemQty: 1,
            itemPrice: "0.000000",
            itemSubtotal: "0.000000"
          },
          {
            itemCode: "0002D57E089144269D27537CA81D4B29BE564519B93B0A8B",
            itemName: "กะหล่ำปลี",
            itemQty: 1,
            itemPrice: "50.000000",
            itemSubtotal: "40.000000"
          },
          {
            itemCode: "0002D57E08914426B6E1DA8F801349DA945D32FA561D552D",
            itemName: "คะน้า",
            itemQty: 1,
            itemPrice: "100.000000",
            itemSubtotal: "58.000000"
          },
          {
            itemCode: "0002D57D18A2CDD5F0D0D9C08EB34A4785DC74B3C8F01B78",
            itemName: "มะเขือเทศเชอรี่",
            itemQty: 1,
            itemPrice: "100.000000",
            itemSubtotal: "37.000000"
          },
          {
            itemCode: "0002D57E08903662BB68DF62F7DD4AFB98FFBE341CF05A7A",
            itemName: "มะเขือม่วง",
            itemQty: 1,
            itemPrice: "50.000000",
            itemSubtotal: "20.000000"
          },
          {
            itemCode: "0002D57E0891442662011640356A4761AE5CD7939D4DCA2A",
            itemName: "วอเตอร์เครส",
            itemQty: 1,
            itemPrice: "100.000000",
            itemSubtotal: "100.000000"
          }
        ],
        shopId: 67459,
        shopName: "ผัก พระราม๙"
      },
      {
        no: "02005608",
        status: "shipped",
        paymentProvider: "cash",
        paidAt: 1581131938869,
        paidAmount: "232.000000",
        items: [
          {
            itemCode: "0002D57E089144269D27537CA81D4B29BE564519B93B0A8B",
            itemName: "กะหล่ำปลี",
            itemQty: 1,
            itemPrice: "50.000000",
            itemSubtotal: "39.000000"
          },
          {
            itemCode: "0002D57E08903662A6FF2C2C4D2149B29A6A9C277972695F",
            itemName: "หัวไชเท้า",
            itemQty: 1,
            itemPrice: "50.000000",
            itemSubtotal: "15.000000"
          },
          {
            itemCode: "0002D57E0891442682B3CB4598B24BB7B73DCDAF07D7283C",
            itemName: "ผักสลัด",
            itemQty: 1,
            itemPrice: "100.000000",
            itemSubtotal: "40.000000"
          },
          {
            itemCode: "0002D57E08914426CF7589E3E28049F2A04E9F2F153793BE",
            itemName: "กวางตุ้ง",
            itemQty: 1,
            itemPrice: "100.000000",
            itemSubtotal: "20.000000"
          },
          {
            itemCode: "0002D57E08914426F1FD0AEA3F2641E6882A184E6C06D4AC",
            itemName: "ผักชี",
            itemQty: 1,
            itemPrice: "100.000000",
            itemSubtotal: "7.000000"
          },
          {
            itemCode: "0002D57E08914426B6E1DA8F801349DA945D32FA561D552D",
            itemName: "คะน้า",
            itemQty: 1,
            itemPrice: "100.000000",
            itemSubtotal: "18.000000"
          },
          {
            itemCode: "0002D57D18A2CDD53ECF8F58FA80409BB6EAE39A0AF5A2E6",
            itemName: "บร๊อคโคลี่",
            itemQty: 1,
            itemPrice: "60.000000",
            itemSubtotal: "23.400000"
          },
          {
            itemCode: "0002D57E08903662577136E9FD58427A9B6ABF1DAA747A22",
            itemName: "มะเขือเปราะ",
            itemQty: 1,
            itemPrice: "50.000000",
            itemSubtotal: "9.000000"
          },
          {
            itemCode: "0002D57E17696BD846292B8BFF084033BA5A63C0A37940B4",
            itemName: "มะเขือไข่เต่า",
            itemQty: 1,
            itemPrice: "100.000000",
            itemSubtotal: "6.000000"
          },
          {
            itemCode: "0002D57E08914426CF7589E3E28049F2A04E9F2F153793BE",
            itemName: "กวางตุ้ง",
            itemQty: 1,
            itemPrice: "100.000000",
            itemSubtotal: "55.000000"
          }
        ],
        shopId: 67459,
        shopName: "ผัก พระราม๙"
      },
      {
        no: "02000009",
        status: "shipped",
        paymentProvider: "cash",
        paidAt: 1580544990026,
        paidAmount: "7500.000000",
        items: [
          {
            itemCode: "00045A98182F447192A2CDE9C2A247968AB7462E04E291FB",
            itemName: "Seaview",
            itemQty: 1,
            itemPrice: "0.000000",
            itemSubtotal: "1500.000000"
          },
          {
            itemCode: "00045A98182F44719F74C2DD1DC3409EB274E89FCFF58FF5",
            itemName: "ค่าตั๋วสยามคาตามาราน",
            itemQty: 4,
            itemPrice: "1500.000000",
            itemSubtotal: "6000.000000"
          }
        ],
        shopId: 83227,
        shopName: "Front ชุมพรคาบาน่า"
      },
      {
        no: "02000054",
        status: "shipped",
        paymentProvider: "cash",
        paidAt: 1581135700695,
        paidAmount: "1500.000000",
        items: [
          {
            itemCode: "00045A98182F447192A2CDE9C2A247968AB7462E04E291FB",
            itemName: "Seaview",
            itemQty: 1,
            itemPrice: "1500.000000",
            itemSubtotal: "1500.000000"
          }
        ],
        shopId: 83227,
        shopName: "Front ชุมพรคาบาน่า"
      },
      {
        no: "02000053",
        status: "shipped",
        paymentProvider: "cash",
        paidAt: 1581131468251,
        paidAmount: "150.000000",
        items: [
          {
            itemCode: "00045AD7183F20C78310C001B62848BAB66D110257824651",
            itemName: "น้ำมันมะพร้าว MATI",
            itemQty: 1,
            itemPrice: "150.000000",
            itemSubtotal: "150.000000"
          }
        ],
        shopId: 83227,
        shopName: "Front ชุมพรคาบาน่า"
      },
      {
        no: "02000052",
        status: "shipped",
        paymentProvider: "cash",
        paidAt: 1581080817303,
        paidAmount: "0.000000",
        items: [
          {
            itemCode: "00045A98182F4471C2EE7628109449EBBB64F6357C5A3651",
            itemName: "Standard Room F.1",
            itemQty: 1,
            itemPrice: "0.000000",
            itemSubtotal: "0.000000"
          }
        ],
        shopId: 83227,
        shopName: "Front ชุมพรคาบาน่า"
      },
      {
        no: "02000051",
        status: "shipped",
        paymentProvider: "cash",
        paidAt: 1581047893681,
        paidAmount: "1200.000000",
        items: [
          {
            itemCode: "00045A98182F4471C2EE7628109449EBBB64F6357C5A3651",
            itemName: "Standard Room F.1",
            itemQty: 1,
            itemPrice: "0.000000",
            itemSubtotal: "1200.000000"
          }
        ],
        shopId: 83227,
        shopName: "Front ชุมพรคาบาน่า"
      },
      {
        no: "02000050",
        status: "shipped",
        paymentProvider: "cash",
        paidAt: 1581046130546,
        paidAmount: "1500.000000",
        items: [
          {
            itemCode: "00045A98182F447192A2CDE9C2A247968AB7462E04E291FB",
            itemName: "Seaview",
            itemQty: 1,
            itemPrice: "1500.000000",
            itemSubtotal: "1500.000000"
          }
        ],
        shopId: 83227,
        shopName: "Front ชุมพรคาบาน่า"
      },
      {
        no: "02000049",
        status: "shipped",
        paymentProvider: "cash",
        paidAt: 1580987513688,
        paidAmount: "1500.000000",
        items: [
          {
            itemCode: "00045A98182F447192A2CDE9C2A247968AB7462E04E291FB",
            itemName: "Seaview",
            itemQty: 1,
            itemPrice: "1500.000000",
            itemSubtotal: "1500.000000"
          }
        ],
        shopId: 83227,
        shopName: "Front ชุมพรคาบาน่า"
      },
      {
        no: "02000048",
        status: "shipped",
        paymentProvider: "cash",
        paidAt: 1580974701057,
        paidAmount: "500.000000",
        items: [
          {
            itemCode: "00045AD7187D8B4BE7E5EFD4048A418CB9A020160A38E6ED",
            itemName: "มัดจำ",
            itemQty: 1,
            itemPrice: "500.000000",
            itemSubtotal: "500.000000"
          }
        ],
        shopId: 83227,
        shopName: "Front ชุมพรคาบาน่า"
      },
      {
        no: "02000047",
        status: "shipped",
        paymentProvider: "cash",
        paidAt: 1580912034336,
        paidAmount: "500.000000",
        items: [
          {
            itemCode: "00045AD7187D8B4BE7E5EFD4048A418CB9A020160A38E6ED",
            itemName: "มัดจำ",
            itemQty: 1,
            itemPrice: "500.000000",
            itemSubtotal: "500.000000"
          }
        ],
        shopId: 83227,
        shopName: "Front ชุมพรคาบาน่า"
      },
      {
        no: "02000046",
        status: "shipped",
        paymentProvider: "cash",
        paidAt: 1580905125952,
        paidAmount: "1200.000000",
        items: [
          {
            itemCode: "00045A98182F4471E921A637B1D7477BA4D3D95C4AA2591D",
            itemName: "Gardenview Bungalow",
            itemQty: 1,
            itemPrice: "0.000000",
            itemSubtotal: "1200.000000"
          }
        ],
        shopId: 83227,
        shopName: "Front ชุมพรคาบาน่า"
      },
      {
        no: "02000045",
        status: "shipped",
        paymentProvider: "cash",
        paidAt: 1580901650489,
        paidAmount: "39.000000",
        items: [
          {
            itemCode: "00045AD718793DE17B87CBE5A3C743C2ACE5E89844B97E41",
            itemName: "ผ้าอนามัย",
            itemQty: 1,
            itemPrice: "39.000000",
            itemSubtotal: "39.000000"
          }
        ],
        shopId: 83227,
        shopName: "Front ชุมพรคาบาน่า"
      },
      {
        no: "02000044",
        status: "shipped",
        paymentProvider: "cash",
        paidAt: 1580894892142,
        paidAmount: "1000.000000",
        items: [
          {
            itemCode: "00045A98182F447192A2CDE9C2A247968AB7462E04E291FB",
            itemName: "Seaview",
            itemQty: 1,
            itemPrice: "1000.000000",
            itemSubtotal: "1000.000000"
          }
        ],
        shopId: 83227,
        shopName: "Front ชุมพรคาบาน่า"
      },
      {
        no: "02000043",
        status: "shipped",
        paymentProvider: "cash",
        paidAt: 1580893897129,
        paidAmount: "1200.000000",
        items: [
          {
            itemCode: "00045A98182F4471C2EE7628109449EBBB64F6357C5A3651",
            itemName: "Standard Room F.1",
            itemQty: 1,
            itemPrice: "0.000000",
            itemSubtotal: "1200.000000"
          }
        ],
        shopId: 83227,
        shopName: "Front ชุมพรคาบาน่า"
      },
      {
        no: "02000042",
        status: "shipped",
        paymentProvider: "cash",
        paidAt: 1580893875270,
        paidAmount: "1200.000000",
        items: [
          {
            itemCode: "00045A98182F4471C2EE7628109449EBBB64F6357C5A3651",
            itemName: "Standard Room F.1",
            itemQty: 1,
            itemPrice: "0.000000",
            itemSubtotal: "1200.000000"
          }
        ],
        shopId: 83227,
        shopName: "Front ชุมพรคาบาน่า"
      },
      {
        no: "02000041",
        status: "shipped",
        paymentProvider: "cash",
        paidAt: 1580884569616,
        paidAmount: "750.000000",
        items: [
          {
            itemCode: "00045A98182F447192A2CDE9C2A247968AB7462E04E291FB",
            itemName: "Seaview",
            itemQty: 1,
            itemPrice: "750.000000",
            itemSubtotal: "750.000000"
          }
        ],
        shopId: 83227,
        shopName: "Front ชุมพรคาบาน่า"
      },
      {
        no: "02000040",
        status: "shipped",
        paymentProvider: "cash",
        paidAt: 1580883925364,
        paidAmount: "1068.000000",
        items: [
          {
            itemCode: "00045AD7187953FC00B557D7D3364D8FB1DC585164C98368",
            itemName: "ค่าขายของเก่า",
            itemQty: 1,
            itemPrice: "1068.000000",
            itemSubtotal: "1068.000000"
          }
        ],
        shopId: 83227,
        shopName: "Front ชุมพรคาบาน่า"
      },
      {
        no: "02000039",
        status: "shipped",
        paymentProvider: "cash",
        paidAt: 1580883592614,
        paidAmount: "39.000000",
        items: [
          {
            itemCode: "00045AD718793DE17B87CBE5A3C743C2ACE5E89844B97E41",
            itemName: "ผ้าอนามัย",
            itemQty: 1,
            itemPrice: "39.000000",
            itemSubtotal: "39.000000"
          }
        ],
        shopId: 83227,
        shopName: "Front ชุมพรคาบาน่า"
      },
      {
        no: "02000038",
        status: "shipped",
        paymentProvider: "cash",
        paidAt: 1580820124093,
        paidAmount: "3000.000000",
        items: [
          {
            itemCode: "00045A98182F447192A2CDE9C2A247968AB7462E04E291FB",
            itemName: "Seaview",
            itemQty: 2,
            itemPrice: "0.000000",
            itemSubtotal: "3000.000000"
          }
        ],
        shopId: 83227,
        shopName: "Front ชุมพรคาบาน่า"
      },
      {
        no: "02000037",
        status: "shipped",
        paymentProvider: "cash",
        paidAt: 1580726534583,
        paidAmount: "80.000000",
        items: [
          {
            itemCode: "00045AD7185F228D1E95C968F76C48998721AF3C90296448",
            itemName: "ต้นไม้",
            itemQty: 1,
            itemPrice: "80.000000",
            itemSubtotal: "80.000000"
          }
        ],
        shopId: 83227,
        shopName: "Front ชุมพรคาบาน่า"
      },
      {
        no: "02000036",
        status: "shipped",
        paymentProvider: "cash",
        paidAt: 1580635293890,
        paidAmount: "2700.000000",
        items: [
          {
            itemCode: "00045A98182F447192A2CDE9C2A247968AB7462E04E291FB",
            itemName: "Seaview",
            itemQty: 1,
            itemPrice: "0.000000",
            itemSubtotal: "1500.000000"
          },
          {
            itemCode: "00045A98182F447192A2CDE9C2A247968AB7462E04E291FB",
            itemName: "Seaview",
            itemQty: 1,
            itemPrice: "0.000000",
            itemSubtotal: "1200.000000"
          }
        ],
        shopId: 83227,
        shopName: "Front ชุมพรคาบาน่า"
      },
      {
        no: "02000035",
        status: "shipped",
        paymentProvider: "cash",
        paidAt: 1580630008074,
        paidAmount: "2400.000000",
        items: [
          {
            itemCode: "00045A98182F4471C2EE7628109449EBBB64F6357C5A3651",
            itemName: "Standard Room F.1",
            itemQty: 2,
            itemPrice: "0.000000",
            itemSubtotal: "2400.000000"
          }
        ],
        shopId: 83227,
        shopName: "Front ชุมพรคาบาน่า"
      },
      {
        no: "02000034",
        status: "shipped",
        paymentProvider: "cash",
        paidAt: 1580566593169,
        paidAmount: "450.000000",
        items: [
          {
            itemCode: "00045A98182F4471529C9A96B316403A82837C8BAD787302",
            itemName: "ค่ารถเฟมทัวร์/คน",
            itemQty: 3,
            itemPrice: "150.000000",
            itemSubtotal: "450.000000"
          }
        ],
        shopId: 83227,
        shopName: "Front ชุมพรคาบาน่า"
      },
      {
        no: "02000033",
        status: "shipped",
        paymentProvider: "cash",
        paidAt: 1580566529034,
        paidAmount: "300.000000",
        items: [
          {
            itemCode: "00045A98182F4471529C9A96B316403A82837C8BAD787302",
            itemName: "ค่ารถเฟมทัวร์/คน",
            itemQty: 2,
            itemPrice: "150.000000",
            itemSubtotal: "300.000000"
          }
        ],
        shopId: 83227,
        shopName: "Front ชุมพรคาบาน่า"
      },
      {
        no: "02000032",
        status: "shipped",
        paymentProvider: "cash",
        paidAt: 1580566482108,
        paidAmount: "200.000000",
        items: [
          {
            itemCode: "00045AD7183F20C78310C001B62848BAB66D110257824651",
            itemName: "น้ำมันมะพร้าว MATI",
            itemQty: 2,
            itemPrice: "100.000000",
            itemSubtotal: "200.000000"
          }
        ],
        shopId: 83227,
        shopName: "Front ชุมพรคาบาน่า"
      },
      {
        no: "02000031",
        status: "shipped",
        paymentProvider: "cash",
        paidAt: 1580566319055,
        paidAmount: "800.000000",
        items: [
          {
            itemCode: "00045A98182F4471684F05FB96A74D638AC961818581BA24",
            itemName: "เตียงเสริม",
            itemQty: 1,
            itemPrice: "800.000000",
            itemSubtotal: "800.000000"
          }
        ],
        shopId: 83227,
        shopName: "Front ชุมพรคาบาน่า"
      },
      {
        no: "02000030",
        status: "shipped",
        paymentProvider: "cash",
        paidAt: 1580566250910,
        paidAmount: "800.000000",
        items: [
          {
            itemCode: "00045A98182F4471684F05FB96A74D638AC961818581BA24",
            itemName: "เตียงเสริม",
            itemQty: 1,
            itemPrice: "800.000000",
            itemSubtotal: "800.000000"
          }
        ],
        shopId: 83227,
        shopName: "Front ชุมพรคาบาน่า"
      },
      {
        no: "02000029",
        status: "shipped",
        paymentProvider: "cash",
        paidAt: 1580566149557,
        paidAmount: "885.000000",
        items: [
          {
            itemCode: "00045AD7183F20C7653CDE5D1F954E5FBC48A64349C21B30",
            itemName: "ค่าซักรีด",
            itemQty: 1,
            itemPrice: "885.000000",
            itemSubtotal: "885.000000"
          }
        ],
        shopId: 83227,
        shopName: "Front ชุมพรคาบาน่า"
      },
      {
        no: "02000028",
        status: "shipped",
        paymentProvider: "cash",
        paidAt: 1580565918655,
        paidAmount: "7500.000000",
        items: [
          {
            itemCode: "00045A98182F447192A2CDE9C2A247968AB7462E04E291FB",
            itemName: "Seaview",
            itemQty: 5,
            itemPrice: "0.000000",
            itemSubtotal: "7500.000000"
          }
        ],
        shopId: 83227,
        shopName: "Front ชุมพรคาบาน่า"
      },
      {
        no: "02000027",
        status: "shipped",
        paymentProvider: "cash",
        paidAt: 1580565865963,
        paidAmount: "7500.000000",
        items: [
          {
            itemCode: "00045A98182F447192A2CDE9C2A247968AB7462E04E291FB",
            itemName: "Seaview",
            itemQty: 5,
            itemPrice: "0.000000",
            itemSubtotal: "7500.000000"
          }
        ],
        shopId: 83227,
        shopName: "Front ชุมพรคาบาน่า"
      },
      {
        no: "02000026",
        status: "shipped",
        paymentProvider: "cash",
        paidAt: 1580565796892,
        paidAmount: "6000.000000",
        items: [
          {
            itemCode: "00045A98182F447192A2CDE9C2A247968AB7462E04E291FB",
            itemName: "Seaview",
            itemQty: 4,
            itemPrice: "0.000000",
            itemSubtotal: "6000.000000"
          }
        ],
        shopId: 83227,
        shopName: "Front ชุมพรคาบาน่า"
      },
      {
        no: "02000025",
        status: "shipped",
        paymentProvider: "cash",
        paidAt: 1580552534331,
        paidAmount: "1100.000000",
        items: [
          {
            itemCode: "00045A98182F44710F55C969B2BD4FF5B083503B07BC504C",
            itemName: "Bungalow V",
            itemQty: 2,
            itemPrice: "0.000000",
            itemSubtotal: "0.000000"
          },
          {
            itemCode: "00045A98182F4471684F05FB96A74D638AC961818581BA24",
            itemName: "เตียงเสริม",
            itemQty: 2,
            itemPrice: "800.000000",
            itemSubtotal: "1600.000000"
          }
        ],
        shopId: 83227,
        shopName: "Front ชุมพรคาบาน่า"
      },
      {
        no: "02000024",
        status: "shipped",
        paymentProvider: "cash",
        paidAt: 1580551699219,
        paidAmount: "3000.000000",
        items: [
          {
            itemCode: "00045A98182F447192A2CDE9C2A247968AB7462E04E291FB",
            itemName: "Seaview",
            itemQty: 2,
            itemPrice: "0.000000",
            itemSubtotal: "3000.000000"
          }
        ],
        shopId: 83227,
        shopName: "Front ชุมพรคาบาน่า"
      },
      {
        no: "02000023",
        status: "shipped",
        paymentProvider: "cash",
        paidAt: 1580551160529,
        paidAmount: "5250.000000",
        items: [
          {
            itemCode: "00045AD7183F20C78310C001B62848BAB66D110257824651",
            itemName: "น้ำมันมะพร้าว MATI",
            itemQty: 7,
            itemPrice: "750.000000",
            itemSubtotal: "5250.000000"
          }
        ],
        shopId: 83227,
        shopName: "Front ชุมพรคาบาน่า"
      },
      {
        no: "02000022",
        status: "shipped",
        paymentProvider: "cash",
        paidAt: 1580551003957,
        paidAmount: "750.000000",
        items: [
          {
            itemCode: "00045AD7183F20C78310C001B62848BAB66D110257824651",
            itemName: "น้ำมันมะพร้าว MATI",
            itemQty: 1,
            itemPrice: "750.000000",
            itemSubtotal: "750.000000"
          }
        ],
        shopId: 83227,
        shopName: "Front ชุมพรคาบาน่า"
      },
      {
        no: "02000021",
        status: "shipped",
        paymentProvider: "cash",
        paidAt: 1580550939452,
        paidAmount: "220.000000",
        items: [
          {
            itemCode: "00045AD7183F20C78310C001B62848BAB66D110257824651",
            itemName: "น้ำมันมะพร้าว MATI",
            itemQty: 1,
            itemPrice: "220.000000",
            itemSubtotal: "220.000000"
          }
        ],
        shopId: 83227,
        shopName: "Front ชุมพรคาบาน่า"
      },
      {
        no: "02000020",
        status: "shipped",
        paymentProvider: "cash",
        paidAt: 1580550906565,
        paidAmount: "100.000000",
        items: [
          {
            itemCode: "00045AD7183F20C78310C001B62848BAB66D110257824651",
            itemName: "น้ำมันมะพร้าว MATI",
            itemQty: 1,
            itemPrice: "100.000000",
            itemSubtotal: "100.000000"
          }
        ],
        shopId: 83227,
        shopName: "Front ชุมพรคาบาน่า"
      },
      {
        no: "02000019",
        status: "shipped",
        paymentProvider: "cash",
        paidAt: 1580549492172,
        paidAmount: "1000.000000",
        items: [
          {
            itemCode: "00045A98182F447192A2CDE9C2A247968AB7462E04E291FB",
            itemName: "Seaview",
            itemQty: 1,
            itemPrice: "0.000000",
            itemSubtotal: "1500.000000"
          }
        ],
        shopId: 83227,
        shopName: "Front ชุมพรคาบาน่า"
      },
      {
        no: "02000018",
        status: "shipped",
        paymentProvider: "cash",
        paidAt: 1580549442353,
        paidAmount: "3000.000000",
        items: [
          {
            itemCode: "00045A98182F447192A2CDE9C2A247968AB7462E04E291FB",
            itemName: "Seaview",
            itemQty: 2,
            itemPrice: "0.000000",
            itemSubtotal: "3000.000000"
          }
        ],
        shopId: 83227,
        shopName: "Front ชุมพรคาบาน่า"
      },
      {
        no: "02000017",
        status: "shipped",
        paymentProvider: "cash",
        paidAt: 1580549197998,
        paidAmount: "7150.000000",
        items: [
          {
            itemCode: "00045A98182F44711B050C98FA8D4A6B919793E44BE2F8D8",
            itemName: "Standard Room F.2",
            itemQty: 2,
            itemPrice: "0.000000",
            itemSubtotal: "4800.000000"
          },
          {
            itemCode: "00045A98182F4471684F05FB96A74D638AC961818581BA24",
            itemName: "เตียงเสริม",
            itemQty: 1,
            itemPrice: "800.000000",
            itemSubtotal: "800.000000"
          },
          {
            itemCode: "00045A98182F4471529C9A96B316403A82837C8BAD787302",
            itemName: "ค่ารถเฟมทัวร์/คน",
            itemQty: 1,
            itemPrice: "150.000000",
            itemSubtotal: "150.000000"
          },
          {
            itemCode: "00045AD7183F20C7653CDE5D1F954E5FBC48A64349C21B30",
            itemName: "ค่าซักรีด",
            itemQty: 1,
            itemPrice: "400.000000",
            itemSubtotal: "400.000000"
          },
          {
            itemCode: "00045AD7183F20C78310C001B62848BAB66D110257824651",
            itemName: "น้ำมันมะพร้าว MATI",
            itemQty: 2,
            itemPrice: "750.000000",
            itemSubtotal: "1500.000000"
          }
        ],
        shopId: 83227,
        shopName: "Front ชุมพรคาบาน่า"
      },
      {
        no: "02000016",
        status: "shipped",
        paymentProvider: "cash",
        paidAt: 1580547047794,
        paidAmount: "1000.000000",
        items: [
          {
            itemCode: "00045A98182F4471C2EE7628109449EBBB64F6357C5A3651",
            itemName: "Standard Room F.1",
            itemQty: 1,
            itemPrice: "0.000000",
            itemSubtotal: "1000.000000"
          }
        ],
        shopId: 83227,
        shopName: "Front ชุมพรคาบาน่า"
      },
      {
        no: "02000015",
        status: "shipped",
        paymentProvider: "cash",
        paidAt: 1580546704068,
        paidAmount: "1850.000000",
        items: [
          {
            itemCode: "00045A98182F447192A2CDE9C2A247968AB7462E04E291FB",
            itemName: "Seaview",
            itemQty: 1,
            itemPrice: "0.000000",
            itemSubtotal: "1800.000000"
          },
          {
            itemCode: "00045A98182F4471E770FE87681940B2B043C6883EF6284C",
            itemName: "ค่ารถไปท่าเรือ",
            itemQty: 1,
            itemPrice: "750.000000",
            itemSubtotal: "750.000000"
          }
        ],
        shopId: 83227,
        shopName: "Front ชุมพรคาบาน่า"
      },
      {
        no: "02000014",
        status: "shipped",
        paymentProvider: "cash",
        paidAt: 1580546584637,
        paidAmount: "80.000000",
        items: [
          {
            itemCode: "00045A98182F4471E770FE87681940B2B043C6883EF6284C",
            itemName: "ค่ารถไปท่าเรือ",
            itemQty: 1,
            itemPrice: "750.000000",
            itemSubtotal: "750.000000"
          },
          {
            itemCode: "00045A98182F4471529C9A96B316403A82837C8BAD787302",
            itemName: "ค่ารถเฟมทัวร์/คน",
            itemQty: 1,
            itemPrice: "150.000000",
            itemSubtotal: "150.000000"
          }
        ],
        shopId: 83227,
        shopName: "Front ชุมพรคาบาน่า"
      },
      {
        no: "02000013",
        status: "shipped",
        paymentProvider: "cash",
        paidAt: 1580546241729,
        paidAmount: "3820.000000",
        items: [
          {
            itemCode: "00045A98182F447192A2CDE9C2A247968AB7462E04E291FB",
            itemName: "Seaview",
            itemQty: 2,
            itemPrice: "0.000000",
            itemSubtotal: "3000.000000"
          },
          {
            itemCode: "00045A98182F4471E770FE87681940B2B043C6883EF6284C",
            itemName: "ค่ารถไปท่าเรือ",
            itemQty: 1,
            itemPrice: "750.000000",
            itemSubtotal: "750.000000"
          },
          {
            itemCode: "00045A98182F4471529C9A96B316403A82837C8BAD787302",
            itemName: "ค่ารถเฟมทัวร์/คน",
            itemQty: 1,
            itemPrice: "150.000000",
            itemSubtotal: "150.000000"
          }
        ],
        shopId: 83227,
        shopName: "Front ชุมพรคาบาน่า"
      },
      {
        no: "02000012",
        status: "shipped",
        paymentProvider: "cash",
        paidAt: 1580545634712,
        paidAmount: "3000.000000",
        items: [
          {
            itemCode: "00045A98182F447192A2CDE9C2A247968AB7462E04E291FB",
            itemName: "Seaview",
            itemQty: 2,
            itemPrice: "0.000000",
            itemSubtotal: "3000.000000"
          }
        ],
        shopId: 83227,
        shopName: "Front ชุมพรคาบาน่า"
      },
      {
        no: "02000011",
        status: "shipped",
        paymentProvider: "cash",
        paidAt: 1580545246247,
        paidAmount: "6000.000000",
        items: [
          {
            itemCode: "00045A98182F44711B050C98FA8D4A6B919793E44BE2F8D8",
            itemName: "Standard Room F.2",
            itemQty: 2,
            itemPrice: "0.000000",
            itemSubtotal: "6000.000000"
          }
        ],
        shopId: 83227,
        shopName: "Front ชุมพรคาบาน่า"
      },
      {
        no: "02000010",
        status: "shipped",
        paymentProvider: "cash",
        paidAt: 1580545131513,
        paidAmount: "4000.000000",
        items: [
          {
            itemCode: "00045A98182F44710F55C969B2BD4FF5B083503B07BC504C",
            itemName: "Bungalow V",
            itemQty: 2,
            itemPrice: "0.000000",
            itemSubtotal: "4000.000000"
          }
        ],
        shopId: 83227,
        shopName: "Front ชุมพรคาบาน่า"
      },
      {
        no: "03000001",
        status: "shipped",
        paymentProvider: "cash",
        paidAt: 1580907523294,
        paidAmount: "2260.000000",
        items: [
          {
            itemCode: "00045CD1187DC6A8E572DFDDD0574FAFB9FD1CC16272A28F",
            itemName: "ข้าวกล้องเหนียว 1 กก.",
            itemQty: 10,
            itemPrice: "50.000000",
            itemSubtotal: "500.000000"
          },
          {
            itemCode: "00045CD1187DC6A83855F59F5AA34574B6418C89861C686A",
            itemName: "เสื้อหม้อห้อม คอปก แขนยาว",
            itemQty: 1,
            itemPrice: "280.000000",
            itemSubtotal: "280.000000"
          },
          {
            itemCode: "00045CD1187DC6A8352AC7C8034E489B88D740B8F715FF07",
            itemName: "หนังสือสวน",
            itemQty: 1,
            itemPrice: "160.000000",
            itemSubtotal: "160.000000"
          },
          {
            itemCode: "00045CD1187DC6A87ACAF0AD583F408688268D3BBDB9F10F",
            itemName: "ข้าวกล้องเหนียว 5 กก.",
            itemQty: 6,
            itemPrice: "220.000000",
            itemSubtotal: "1320.000000"
          }
        ],
        shopId: 83316,
        shopName: "ฐานธรรม สันป่าตอง"
      }
    ];
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
