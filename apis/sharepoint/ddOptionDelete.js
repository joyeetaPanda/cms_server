var express = require("express");
var router = express.Router();
var axios = require("axios");
const clientData = require("../../constants/clientData");

/*   
API url: -   
http://localhost:9000/apis/sharepoint/ddOptionDelete?token=abcd&deleteID=123
*/

router.post("/", async function (req, res, next) {
  try {
    let token = req.query.token;
    let deleteID = req.query.deleteID;
    const url = `https://${clientData.tenant}/sites/${clientData.site}/_api/Web/Lists/getbytitle('dropdownOptions')/items/getbyid('${deleteID}')`;

    axios
      .delete(
        url,

        {
          headers: {
            accept: "application/json;odata=verbose",
            "content-type": "application/json;odata=verbose",
            "If-Match": "*",
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((response) => {
        res.send({ message: "Dropdown option deleted" });
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
