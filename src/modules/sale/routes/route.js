"use strict";
var controller = require("../controllers/controller"),
  mq = require("../../core/controllers/rabbitmq"),
  policy = require("../policy/policy");
module.exports = function(app) {
  var url = "/api/sales";
  var urlWithParam = "/api/sales/:saleId";
  app
    .route(url)
    .all(policy.isAllowed)
    .get(controller.getList)
    .post(controller.create);

  app
    .route(urlWithParam)
    .all(policy.isAllowed)
    .get(controller.read)
    .put(controller.update)
    .delete(controller.delete);

  app
    .route("/api/import/sales") //.all(policy.isAllowed)
    .post(controller.insertMany);

  app.route("/api/interface/ocha").post(controller.interfaceOcha);

  app.route("/api/interface/ocha/shops").post(controller.getOchaShopList);
  app.route("/api/interface/ocha/shops/selected").post(controller.selectOchaShop);

  app
    .route("/api/export/:startdate/:enddate")
    .get(controller.excelreports);

  app.param("saleId", controller.getByID);

  app.param('startdate', function (req, res, next, startdate) {
    req.startdate = startdate;
    next();
  });

  app.param('enddate', controller.startdate);

  /**
   * Message Queue
   * exchange : ชื่อเครือข่ายไปรษณีย์  เช่น casan
   * qname : ชื่อสถานีย่อย สาขา
   * keymsg : ชื่อผู้รับ
   */
  // mq.consume('exchange', 'qname', 'keymsg', (msg)=>{
  //     console.log(JSON.parse(msg.content));

  // });
};
