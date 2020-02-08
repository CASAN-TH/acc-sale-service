'use strict';
// use model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var SaleSchema = new Schema({
    no: String,
    createdAt:Date,	
    status:String,	
    customerName:String,	
    customerPhone:String,	
    customerEmail: String,	
    customerAddress:String,	
    trackingNumber:String,
    paymentProvider:String,	
    accountNo : String,
    accountName: String,	
    shippingOption: String,	
    shippingCost:Number,	
    subtotal:Number,	
    discount:Number,	
    total: Number,	
    paidAt: Date,	
    paidAmount:Number,	
    note:String,	
    items: [{
        itemCode:String,	
        variantName:String,	
        itemName:String,	
        itemQty:Number,	
        itemPrice:Number,	
        itemSubtotal:Number,	
        itemNote:String,
    }],
    shopId: String,
    shopName: String,
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date
    },
    createBy: {
        _id: {
            type: String
        },
        username: {
            type: String
        },
        displayname: {
            type: String
        }
    },
    updateBy: {
        _id: {
            type: String
        },
        username: {
            type: String
        },
        displayname: {
            type: String
        }
    }
});

mongoose.model("Sale", SaleSchema);