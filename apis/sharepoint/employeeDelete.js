var express = require("express");
var router = express.Router();
var axios = require("axios");
const clientData = require("../../constants/clientData");

/*   
API url: -   
http://localhost:9000/apis/sharepoint/employeeDelete

Payload:-
  {
role:"admin"
  }

*/

router.post("/", async function (req, res, next) {
  try {
    let token = req.body.token;
    let deleteID = req.body.deleteID;
    axios
      .delete(
        `https://${clientData.tenant}/sites/${clientData.site}/_api/Web/Lists/getbytitle('employeeDetails')/items/getbyid('${deleteID}')`,

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
        res.send({ message: "Employee deleted" });
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
