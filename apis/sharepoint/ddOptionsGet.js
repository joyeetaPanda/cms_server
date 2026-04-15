var express = require("express");
var router = express.Router();
var axios = require("axios");
const clientData = require("../../constants/clientData");

/*   
API url: -   
http://localhost:9000/apis/sharepoint/ddOptionsGet
  

*/

router.post("/", async function (req, res, next) {
  try {
  

    let token = req.body.token;
    const listUrl = `https://${clientData.tenant}/sites/${clientData.site}/_api/Web/Lists/getbytitle('dropdownOptions')/items?$top=5000`;

    let allItems = [];
    let nextUrl = listUrl;

    while (nextUrl) {
      const response = await axios.get(nextUrl, {
        headers: {
          Authorization: "Bearer " + token,
          Accept: "application/json;odata=verbose",
        },
      });

      const data = response.data;

      if (data.d && data.d.results) {
        allItems = allItems.concat(data.d.results);
      }

      // Check for pagination
      if (data.d.__next) {
        nextUrl = data.d.__next; // SharePoint gives full URL
      } else {
        nextUrl = null;
      }
    }

    res.send({ value: allItems });
  } catch (e) {
    console.log({ error: e, fileName: __filename });
    res.send({ error: e, fileName: __filename });
  }
});

module.exports = router;
