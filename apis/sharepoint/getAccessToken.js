var express = require("express");
var router = express.Router();
var axios = require("axios");
const clientData = require("../../constants/clientData");
var FormData = require("form-data");


/*   
API url: -   
http://localhost:9000/apis/sharepoint/getAccessToken
*/

router.get("/", async function (req, res, next) {
  try {
    let authData = new FormData();
    authData.append("grant_type", clientData.grant_type);
    authData.append("client_id", clientData.client_id);
    authData.append("client_secret", clientData.client_secret);
    authData.append("resource", clientData.resource);

    axios
      .post(
        `https://accounts.accesscontrol.windows.net/${clientData.resourceId}/tokens/OAuth/2/`,
        authData
      )
      .then((response) => {
        res.send({ access_token: response.data.access_token });
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (e) {
    console.log({ error: e, fileName: __filename });
    res.send({ error: e, fileName: __filename });
  }
});

module.exports = router;
