var express = require("express");
var router = express.Router();
var nodemailer = require("nodemailer");
const axios = require("axios");
const qs = require("qs");
const clientData = require("../../constants/clientData");
// const LocalConnect = require("../../LocalDB");

/*   
API url: -   
http://localhost:9000/apis/MailSend/BulkMailSend
 

   [ {"EMAIL_ID":"rahul.rohilla1081@gmail.com",
    "NAME":"RAHUL",
"SUBJECT":"abcd",
"CONTENT":"abcd"
}]

*/

// let fromMail = "support@samishti.com";
// let password = "Em@ilserver#321";

router.post("/", async function (req, res, next) {
  try {
    const formData = req.body;
    console.log("reqData.",formData)
    let fromMail = formData.fromMail;
    let MAILTO = JSON.parse(formData.MAILTO);
    let bcc = JSON.parse(formData.BCC);
    let cc = JSON.parse(formData.CC);
    // console.log("hsdgfhsg", formData.CONTENT);
    let ccMail = [];
    let bccMail = [];
    cc.map((val) => {
      ccMail.push({
        emailAddress: {
          address: val,
        },
      });
    });
    bcc.map((val) => {
      bccMail.push({
        emailAddress: {
          address: val,
        },
      });
    });

    let files = req.files;
    let mailToId = [];
    MAILTO.map((val) => {
      mailToId.push(val.EMAIL_ID);
    });

    let attach = [];
    for (var i in files) {
      let fileObj = {
        "@odata.type": "#microsoft.graph.fileAttachment",
        // name: "attachment.txt",
        // contentType: "text/plain",
        contentType: "*",
        // contentBytes: "SGVsbG8gV29ybGQh",
      };
      fileObj.name = files[i].name;
      fileObj.contentBytes = files[i].data.toString("base64");
      // console.log("file name", files[i].name);

      // let fileObj = { filename: files[i].name, content: files[i].data };
      attach.push(fileObj);
    }
    const sendMailToUsers = (
      token,
      toMail,
      cc,
      bcc,
      name,
      currentIndex,
      TotalLength,
      subject,
      content,
      html,
      attachments
    ) => {
      let dataMail = JSON.stringify({
        message: {
          subject: subject,
          body: {
            contentType: "html",
            content: `<body style='background-color: #fff;'> <div class='es-wrapper-color' style='background-color: #fff;'> 
        <p> ${content} </p>${html}</div></body>`,
          },
          toRecipients: [
            {
              emailAddress: {
                address: toMail,
              },
            },
          ],
          ccRecipients: cc,
          bccRecipients: bcc,
          attachments: attachments,
        },
      });
      let configMail = {
        method: "post",
        maxBodyLength: Infinity,
        url: `https://graph.microsoft.com/v1.0/users/${fromMail}/sendMail`,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        data: dataMail,
      };

      axios
        .request(configMail)
        .then((responseMail) => {
          if (currentIndex == TotalLength - 1) {
            res.status(200).send({
              STATUS_CODE: 200,
              MESSAGE: "Mail sent successfully",
            });
          }
        })
        .catch((errorMail) => {
          res.status(500).send({ error: errorMail, fileName: __filename });
        });
    };
    let data = qs.stringify({
      client_id: clientData.client_id_teams,
      client_secret: clientData.client_secret_teams,
      scope: clientData.scope_teams,
      grant_type: clientData.grant_type,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `https://login.microsoftonline.com/${clientData.resourceId}/oauth2/v2.0/token`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: data,
    };
    // --------mail data------------

    axios
      .request(config)
      .then((response) => {
        // -------------mail send api-----------
        if (MAILTO.length > 0) {
          MAILTO.map((val, index) => {
            sendMailToUsers(
              response.data.access_token,
              val.EMAIL_ID,
              ccMail,
              bccMail,
              val.NAME,
              index,
              MAILTO.length,
              formData.SUBJECT,
              formData.CONTENT,
              // mailContent,
              formData.HTML,
              attach
            );
          });
        }
        // res.send("Done without sending mail"); //Comment if sendMailToUsers function called
        // -------------mail send api end-----------
      })
      .catch((error) => {
        // console.log("Mail Catch", error);
        res.status(500).send({ message: "Mail access token error:", error });
      });
  } catch (e) {
    // console.log({ error: e, fileName: __filename });
    res.status(500).send({ error: e.message, fileName: __filename });
  }
});

module.exports = router;
