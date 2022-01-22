"use strict";

const { removeUndefined } = require('strapi-utils');
let nodemailer = require("nodemailer");
let aws = require("@aws-sdk/client-ses");

module.exports = {
     init: (providerOptions = {}, settings = {}) => {
      const ses = new aws.SES({
        apiVersion: "2010-12-01",
        region: providerOptions.region,
        credentials: {accessKeyId: providerOptions.accessKeyId, secretAccessKey: providerOptions.secretAccessKey}
      });
       return {
         send: async options => {
   		    // create Nodemailer SES transporter
          let transporter = nodemailer.createTransport({
            SES: { ses, aws },
          });
  
           options.from = options.from || settings.defaultFrom;
           options.replyTo = options.replyTo || settings.defaultReplyTo;
           options.text = options.text || options.html;
  
           let msg = {
             from: options.from,
             to: options.to,
             cc: options.cc,
             bcc: options.bcc,
             replyTo: options.replyTo,
             subject: options.subject,
             html: options.text,
             ses: {
              // optional extra arguments for SendRawEmail
              Tags: [
                {
                  Name: "tag_name",
                  Value: "tag_value",
                },
              ],
            },
           };
      
           var info = await transporter.sendMail(removeUndefined(msg));
           return info;
         },
       };
     },
   };