var express = require("express");
var router = express.Router();
const axios = require("axios");
const qs = require("qs");
const clientData = require("../../constants/clientData");

/*   
API url: -   
http://localhost:9000/apis/MailSend/getAccessToken
*/

router.get("/", async function (req, res, next) {
  try {
    let data = qs.stringify({
      client_id: "7d203557-0b58-4cc6-a0e6-ea307cab4fe2",
      client_secret: "eeQ8Q~w-lwo1ECTLrdy7X7FiArU6O8MZEoxbNcrb",
      scope: "https://graph.microsoft.com/.default",
      grant_type: "client_credentials",
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://login.microsoftonline.com/4a65d39e-b3a8-402e-86b0-c1316ba372ba/oauth2/v2.0/token",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Cookie:
          "fpc=AnJsRAhfEMxGpcCziqQfLDa13N-iAQAAADMEcd0OAAAA; stsservicecookie=estsfd; x-ms-gateway-slice=estsfd",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        res.send(response.data.access_token);
      })
      .catch((error) => {
        console.log(error);
        res.send("Mail access token error:", error);
      });
  } catch (e) {
    console.log({ error: e, fileName: __filename });
    res.send({ error: e, fileName: __filename });
  }
});

module.exports = router;
