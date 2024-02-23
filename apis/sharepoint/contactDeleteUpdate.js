var express = require("express");
var router = express.Router();
var axios = require("axios");
const clientData = require("../../constants/clientData");

/*   
API url: -   
http://localhost:9000/apis/sharepoint/contactDeleteUpdate?token=abcd$contactDataId=123

Payload:-
  {
role:"admin"
  }

*/

router.post("/", async function (req, res, next) {
  try {
    let token = req.query.token;
    let contactDataId = req.query.contactDataId;
    axios
      .post(
        `https://${clientData.tenant}/sites/${clientData.site}/_api/Web/Lists/getbytitle('contactmanagementlist')/items/getbyid('${contactDataId}')`,
        {
          __metadata: { type: "SP.Data.ContactmanagementlistListItem" },
          // designation: "asdas",
          isRemoved: "Yes",
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
        res.send({ message: "Contact Deleted" });
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
