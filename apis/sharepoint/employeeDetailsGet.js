var express = require("express");
var router = express.Router();
var axios = require("axios");
const clientData = require("../../constants/clientData");

/*   
API url: -   
http://localhost:9000/apis/sharepoint/employeeDetailsGet?token=abcd
  

*/

router.get("/", async function (req, res, next) {
  try {
    let token = req.query.token;

    axios
      .get(
        `https://${clientData.tenant}/sites/${clientData.site}/_api/Web/Lists/getbytitle('employeeDetails')/items?$top=50000`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((response) => {
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
