var express = require("express");
var router = express.Router();
var axios = require("axios");
const clientData = require("../../constants/clientData");

/*   
API url: -   
http://localhost:9000/apis/sharepoint/empRoleUpdate?token=abcd$empDataId=123

Payload:-
  {
role:"admin"
  }

*/

router.post("/", async function (req, res, next) {
  try {
    let token = req.query.token;
    let empDataId = req.query.empDataId;
    let empRole = req.body.role;
    axios
      .post(
        `https://${clientData.tenant}/sites/${clientData.site}/_api/Web/Lists/getbytitle('employeeDetails')/items/getbyid('${empDataId}')`,
        {
          __metadata: { type: "SP.Data.EmployeeDetailsListItem" },
          // designation: "asdas",
          role: empRole,
        },

        {
          headers: {
            "X-HTTP-Method": "MERGE",
            accept: "application/json;odata=verbose",
            "content-type": "application/json;odata=verbose",
            "If-Match": "*",
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((response) => {
        res.send({ message: "Employee Role updated" });
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
