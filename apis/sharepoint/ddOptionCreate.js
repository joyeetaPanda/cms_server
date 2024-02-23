var express = require("express");
var router = express.Router();
var axios = require("axios");
const clientData = require("../../constants/clientData");

/*   
API url: -   
http://localhost:9000/apis/sharepoint/ddOptionCreate?token=abcd

Payload:-
  {

  }

*/

router.post("/", async function (req, res, next) {
  try {
    let token = req.query.token;
    let optionPayload = req.body;
    axios
      .post(
        `https://${clientData.tenant}/sites/${clientData.site}/_api/Web/Lists/getbytitle('dropdownOptions')/items`,
        {
          __metadata: { type: "SP.Data.DropdownOptionsListItem" },
          // designation: "asdas",
          ...optionPayload,
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
        res.send({ message: "Dropdown option created" });
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
