var express = require("express");
var router = express.Router();
var axios = require("axios");
const clientData = require("../../constants/clientData");

/*   
API url: -   
http://localhost:9000/apis/sharepoint/contactUpdate

Payload:-
  {

  }
*/

router.post("/", async function (req, res, next) {
  try {
    let token = req.body.token;
    let contactDataId = req.body.contactDataId;
    let contactPayload = req.body.contactPayload;
    if (contactPayload.company) {
      contactPayload.company = contactPayload.company.trim();
    }
    delete contactPayload.leasingMember;
    console.log("hsadfhags", contactPayload);
    function validateInput(input) {
      const invalidChars = /[<>:;\"\\\[\]{}()#$%!+\-*^*]/;
      return !invalidChars.test(input);
    }
    function hasInvalidChars(obj) {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const value = obj[key];
          if (typeof value === "object" && value !== null) {
            if (hasInvalidChars(value)) {
              return true;
            }
          } else if (typeof value === "string") {
            if (!validateInput(value)) {
              return true;
            }
          }
        }
      }
      return false;
    }
    if (hasInvalidChars(contactPayload)) {
      res.send({ INVALID_CHARS: true });
    } else {
      axios
        .post(
          `https://${clientData.tenant}/sites/${clientData.site}/_api/Web/Lists/getbytitle('contactmanagementlist')/items/getbyid('${contactDataId}')`,
          {
            __metadata: { type: "SP.Data.ContactmanagementlistListItem" },
            // designation: "asdas",
            ...contactPayload,
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
          res.send({ message: "Contact Updated", INVALID_CHARS: false });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  } catch (e) {
    console.log({ error: e, fileName: __filename });
    res.send({ error: e, fileName: __filename });
  }
});

module.exports = router;
