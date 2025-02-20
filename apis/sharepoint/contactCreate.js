var express = require("express");
var router = express.Router();
var axios = require("axios");
const clientData = require("../../constants/clientData");
const mySalt = "dcbuyft3i476ofl5c8j9m0^&%JSDCYhjs%@#$kfjvkf";

/*   
API url: -   
http://localhost:9000/apis/sharepoint/contactCreate

Payload:-
  {
    token:"",
    ...
  }

*/

router.post("/", async function (req, res, next) {
  try {
    let token = req.body.token;
    let code = req.body.code;
    let contactPayload = req.body.contactPayload;

    const decrypt = (salt, encoded) => {
      const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
      const applySaltToChar = (code) =>
        textToChars(salt).reduce((a, b) => a ^ b, code);

      return encoded
        .match(/.{1,2}/g) // Split hex string into bytes
        .map((hex) => parseInt(hex, 16)) // Convert hex to integer
        .map(applySaltToChar) // Apply XOR with salt
        .map((charCode) => String.fromCharCode(charCode)) // Convert back to characters
        .join(""); // Join characters into string
    };
    let email = decrypt(mySalt, code);

    function validateInput(input) {
      const invalidChars = /[<>;\"\\\[\]{}$%!\*^*]/;
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
      // ---------------------
      axios
        .get(
          `https://${clientData.tenant}/sites/${clientData.site}/_api/Web/Lists/getbytitle('employeeDetails')/items?$top=50000&$filter=email_id eq '${email}'`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        )
        .then((response) => {
          let empData = response.data.value;
          if (empData.length == 0) {
            res.send({ empExists: "notExist" });
          } else {
            let lm = empData[0].employee_name;
            contactPayload.leasingMember = lm;
            axios
              .post(
                `https://${clientData.tenant}/sites/${clientData.site}/_api/Web/Lists/getbytitle('contactmanagementlist')/items`,
                {
                  __metadata: { type: "SP.Data.ContactmanagementlistListItem" },
                  ...contactPayload,
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
                res.send({ message: "Contact created", INVALID_CHARS: false });
              })
              .catch((error) => {
                console.log(error);
              });
          }
        });
    }
  } catch (e) {
    console.log({ error: e, fileName: __filename });
    res.send({ error: e, fileName: __filename });
  }
});

module.exports = router;
