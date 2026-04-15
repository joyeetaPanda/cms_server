var express = require("express");
var router = express.Router();
var axios = require("axios");
const clientData = require("../../constants/clientData");

/*   
API url: -   
http://localhost:9000/apis/sharepoint/loginDataCreate

Payload: -
{
  token:abcd
}
*/

router.post("/", async function (req, res, next) {
  try {
    let token = req.body.token;
    let loginPayload = req.body.loginPayload;
    console.log("lkasjc", loginPayload);
    axios
      .post(
        `https://${clientData.tenant}/sites/${clientData.site}/_api/Web/Lists/getbytitle('loginList')/items`,
        {
          __metadata: { type: "SP.Data.LoginListListItem" },
          // designation: "asdas",
          empID: loginPayload.empID.toString(),
          empEmail: loginPayload.empEmail,
          loggedOn: new Date(loginPayload.loggedOn).toISOString(),
        },
        {
          headers: {
            "Content-Type": "application/json;odata=verbose",
            Accept: "application/json;odata=verbose",
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((response) => {
        res.send({ message: "Dropdown option created", INVALID_CHARS: false });
      })
      .catch((error) => {
        console.log(error);
        return res.status(500).send({ error: "Internal Server Error" });
      });
  } catch (e) {
    console.log({ error: e, fileName: __filename });
    res.send({ error: e, fileName: __filename });
  }
});

module.exports = router;
