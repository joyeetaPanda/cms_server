var express = require("express");
var router = express.Router();
var axios = require("axios");
const clientData = require("../../constants/clientData");

/*   
API url: -   
http://localhost:9000/apis/sharepoint/adoptionTrackingDataGet

Payload: -
{
  token:abcd
}
*/
async function getAllItemsWithPagination(url, token) {
  let results = [];
  let nextUrl = url;

  do {
    const response = await axios.get(nextUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json;odata=verbose",
      },
    });

    const data = response.data.d;
    results = results.concat(data.results);

    // If SharePoint provides __next, use it. Otherwise stop.
    nextUrl = data.__next || null;
  } while (nextUrl);

  return results;
}

router.post("/", async function (req, res, next) {
  try {
    let token = req.body.token;
    let reqData = req.body.data;
    let startDateISO, endDateISO, startDate, endDate;
    console.log("mshbdjasbh", reqData);
    const monthOptions = [
      { label: "January", value: "01" },
      { label: "February", value: "02" },
      { label: "March", value: "03" },
      { label: "April", value: "04" },
      { label: "May", value: "05" },
      { label: "June", value: "06" },
      { label: "July", value: "07" },
      { label: "August", value: "08" },
      { label: "September", value: "09" },
      { label: "October", value: "10" },
      { label: "November", value: "11" },
      { label: "December", value: "12" },
    ];
    const formatDate = (date) => {
      let d = new Date(date);
      let day = String(d.getDate()).padStart(2, "0");
      let month = String(d.getMonth() + 1).padStart(2, "0");
      let year = d.getFullYear();
      return `${day}-${month}-${year}`;
    };
    function getMonthYearRange(startMonth, startYear, endMonth, endYear) {
      const result = [];

      let currentMonth = parseInt(startMonth, 10);
      let currentYear = parseInt(startYear, 10);
      const finalMonth = parseInt(endMonth, 10);
      const finalYear = parseInt(endYear, 10);

      while (
        currentYear < finalYear ||
        (currentYear === finalYear && currentMonth <= finalMonth)
      ) {
        const monthStr = currentMonth.toString().padStart(2, "0");
        result.push({ month: monthStr, year: currentYear });

        currentMonth++;
        if (currentMonth > 12) {
          currentMonth = 1;
          currentYear++;
        }
      }

      return result;
    }

    let dataArr = [];

    if (reqData.tenure == "daily") {
      startDate = new Date(reqData.startDate);
      endDate = new Date(reqData.endDate);
      startDateISO = new Date(startDate.setHours(0, 0, 0, 0)).toISOString();
      endDateISO = new Date(endDate.setHours(23, 59, 59, 999)).toISOString();
      const apiUrl = `https://${clientData.tenant}/sites/${clientData.site}/_api/Web/Lists/getbytitle('contactmanagementlist')/items?$top=50000&$filter=Created ge datetime'${startDateISO}' and Created le datetime'${endDateISO}'`;
      const loginUrl = `https://${clientData.tenant}/sites/${clientData.site}/_api/Web/Lists/getbytitle('loginList')/items?$top=50000&$filter=loggedOn ge datetime'${startDateISO}' and loggedOn le datetime'${endDateISO}'`;
      console.log("apiUrl", apiUrl);
      console.log("loginUrl", loginUrl);

      try {
        // const response = await axios.get(apiUrl, {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //     Accept: "application/json;odata=verbose",
        //   },
        // });
        // console.log("jdsfhjskfhs");

        // const items = response.data.d.results;

        // const loginResponse = await axios.get(loginUrl, {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //     Accept: "application/json;odata=verbose",
        //   },
        // });

        // const loginItems = loginResponse.data.d.results;
        const items = await getAllItemsWithPagination(apiUrl, token);
        const loginItems = await getAllItemsWithPagination(loginUrl, token);

        // Build full date range for that month
        let currentDate = new Date(startDate);

        while (currentDate <= endDate) {
          let formattedDate = formatDate(currentDate);

          // Filter SharePoint items for this particular date
          let filteredItems = items.filter((item) => {
            return formatDate(item.Created) === formattedDate;
          });
          let loginFilteredItems = loginItems.filter((item) => {
            return formatDate(item.loggedOn) === formattedDate;
          });

          let contactCreatedList = filteredItems.map((item) => ({
            ID: item.ID,
            name0: item.name0, // replace field name if needed
          }));

          let loggedList = loginFilteredItems.map((item) => ({
            empID: item.empID,
            empEmail: item.empEmail, // replace field name if needed
            loggedOn: item.loggedOn,
          }));

          dataArr.push({
            date_range: formattedDate,
            contactCreatedCount: contactCreatedList.length,
            contactCreatedList: contactCreatedList,
            loggedInCount: loggedList.length,
            loggedInList: loggedList,
          });

          // Move to next date
          currentDate.setDate(currentDate.getDate() + 1);
        }

        // console.log(dataArr);
        return res.send(dataArr);
        // Send/return this dataArr as needed
      } catch (error) {
        console.error("Error fetching SharePoint data:", error);
        return res.send("Error fetching SharePoint data");
      }
    } else if (reqData.tenure == "monthly") {
      let month = reqData.month; // e.g., 5 for May
      let year = reqData.year; // e.g., 2025
      let endMonth = reqData.endMonth; // e.g., 5 for May
      let endYear = reqData.endYear; // e.g., 2025
      let loggedInArr = [];
      // --------------------------------------
      let monthArray = getMonthYearRange(month, year, endMonth, endYear);
      console.log("Month Array:", monthArray);
      for (const item of monthArray) {
        try {
          const year = item.year;
          const month = parseInt(item.month, 10);

          // start date: 1st day of month 00:00:00
          const startDate = new Date(year, month - 1, 1, 0, 0, 0);
          const startDateISO = startDate.toISOString();

          // end date: last day of month 23:59:59
          const endDate = new Date(year, month, 0, 23, 59, 59);
          const endDateISO = endDate.toISOString();

          const apiUrl = `https://${clientData.tenant}/sites/${clientData.site}/_api/Web/Lists/getbytitle('contactmanagementlist')/items?$top=50000&$filter=createdOn ge datetime'${startDateISO}' and createdOn le datetime'${endDateISO}'`;
          const loginUrl = `https://${clientData.tenant}/sites/${clientData.site}/_api/Web/Lists/getbytitle('loginList')/items?$top=50000&$filter=loggedOn ge datetime'${startDateISO}' and loggedOn le datetime'${endDateISO}'`;
          // const loginUrl = `https://${clientData.tenant}/sites/${clientData.site}/_api/Web/Lists/getbytitle('loginList')/items?$top=50000&$filter=loggedOn ge datetime'${startDateISO}' and loggedOn le datetime'${endDateISO}'`;

          const response = await axios.get(apiUrl, {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json;odata=verbose",
            },
          });

          const items = response.data.d.results;
          console.log("nxksnksnck");

          const loginResponse = await axios.get(loginUrl, {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json;odata=verbose",
            },
          });

          const loginItems = loginResponse.data.d.results;
          dataArr.push({
            date_range:
              monthOptions.find((val) => val.value === item.month).label +
              " " +
              item.year,
            contactCreatedCount: items.length,
            contactCreatedList: items,
            loggedInCount: loginItems.length,
            loggedInList: loginItems,
          });
        } catch (err) {
          console.error(
            "Error fetching SharePoint data for month:",
            item.month,
            err.message
          );
          return res.send(
            "Error fetching SharePoint data for month: " + item.month
          );
        }

        // console.log(dataArr);
      }
      res.send(dataArr);
      // --------------------------------------
    } else {
      return res.send([]);
    }
  } catch (e) {
    console.log({ error: e, fileName: __filename });
    res.send({ error: e, fileName: __filename });
  }
});

module.exports = router;
