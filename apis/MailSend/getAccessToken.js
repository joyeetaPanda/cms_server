var express = require("express");
var router = express.Router();
const axios = require("axios");
const qs = require("qs");
const clientData = require("../../constants/clientData");
const cors=require("cors")
/*   
API url: -   
http://localhost:9000/apis/MailSend/getAccessToken
*/
router.options("/",cors())
router.get("/", async function (req, res, next) {
  try {
    const tenant_id = clientData.tenant_id;
    let data = qs.stringify({
      client_id: clientData.client_id_teams,
      client_secret: clientData.client_secret_teams,
      scope: "https://graph.microsoft.com/.default",
      grant_type: "client_credentials",
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `https://login.microsoftonline.com/${tenant_id}/oauth2/v2.0/token`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        // Cookie:
        //   "fpc=AnJsRAhfEMxGpcCziqQfLDa13N-iAQAAADMEcd0OAAAA; stsservicecookie=estsfd; x-ms-gateway-slice=estsfd",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
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
