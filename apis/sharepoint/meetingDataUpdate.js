var express = require("express");
var router = express.Router();
var axios = require("axios");
const clientData = require("../../constants/clientData");

/*   
API url: -   
http://localhost:9000/apis/sharepoint/meetingDataUpdate?token=abcd&meetingDataId=123

Payload:-
  {
  }
*/

router.post("/", async function (req, res, next) {
  try {
    let token = req.query.token;
    let meetingDataId = req.query.meetingDataId;
    let meetingPayload = req.body;
    axios
      .post(
        `https://${clientData.tenant}/sites/${clientData.site}/_api/Web/Lists/getbytitle('meetingDetails')/items/getbyid('${meetingDataId}')`,
        {
          __metadata: { type: "SP.Data.MeetingDetailsListItem" },
          // designation: "asdas",
          ...meetingPayload,
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
        res.send({ message: "Contact Updated" });
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
