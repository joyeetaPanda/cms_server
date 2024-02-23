var express = require("express");
var router = express.Router();
var nodemailer = require("nodemailer");
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

let fromMail = "support@samishti.com";
let password = "Em@ilserver#321";

router.post("/", async function (req, res, next) {
  const sendMailToUsers = (
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
    console.log("sendMail called");

    var mailOptions = {
      from: fromMail,
      to: toMail,
      subject: subject,
      cc: cc,
      bcc: bcc,
      // text: content,

      html:
        `<body style='background-color: #fff;'>    <div class='es-wrapper-color' style='background-color: #fff;'> <p>${name}</p>` +
        `<p>` +
        content +
        `</p>` +
        html +
        `</div></body>`,
      attachments: attachments,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("failed", error);
        // sendMailToUsers(toMail);
        if (error.responseCode == 432) {
          sendMailToUsers(
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
          );
        }
      } else {
        if (currentIndex == TotalLength - 1) {
          res.send({
            STATUS_CODE: 200,
            MESSAGE: "Mail sent successfully",
          });
        }
        console.log({
          msg: "success",
        });
      }
    });
  };
  try {
    // let db = await LocalConnect();
    const formData = req.body;
    let MAILTO = JSON.parse(formData.MAILTO);
    let bcc = JSON.parse(formData.BCC);
    let cc = JSON.parse(formData.CC);
    let files = req.files;
    let mailToId = [];
    MAILTO.map((val) => {
      mailToId.push(val.EMAIL_ID);
    });

    console.log("mail api called", MAILTO);
    console.log("mailToId", mailToId);
    console.log("bcc", bcc);
    console.log("cc", cc);

    let attach = [];
    for (var i in files) {
      console.log("file name", files[i].name);

      let fileObj = { filename: files[i].name, content: files[i].data };
      attach.push(fileObj);
    }
    console.log("the attachment to be sent", attach);
    var transporter = nodemailer.createTransport({
      //   service: "gmail",
      host: "smtp-mail.outlook.com",
      port: 587,
      secure: false,
      auth: {
        user: fromMail,
        pass: password,
      },
    });

    if (MAILTO.length > 0) {
      MAILTO.map((val, index) => {
        sendMailToUsers(
          val.EMAIL_ID,
          cc,
          bcc,
          val.NAME,
          index,
          MAILTO.length,
          formData.SUBJECT,
          formData.CONTENT,
          formData.HTML,
          attach
        );
      });
    }
    // res.send("test:comment if sendMailToUsers function called");
  } catch (e) {
    console.log({ error: e, fileName: __filename });
    res.send({ error: e, fileName: __filename });
  }
});

module.exports = router;
