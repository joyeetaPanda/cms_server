var express = require("express");
var router = express.Router();
var axios = require("axios");
const clientData = require("../../constants/clientData");

/*   
API url: -   
http://localhost:9000/apis/sharepoint/contactDataGet?token=abcd
  

*/

router.get("/", async function (req, res, next) {
  try {
    let token = req.query.token;
    console.log("mdsvjsfk", JSON.stringify(token));
    axios
      .get(
        `https://${clientData.tenant}/sites/${clientData.site}/_api/Web/Lists/getbytitle('contactmanagementlist')/items?$top=50000`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((response) => {
        console.log(
          "hsgjgs",
          response.data.value.find(
            (val) => val.email == "kanav.sharma@bain.co.inabcd"
          )
        );
        res.send({ value: response.data.value });
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
