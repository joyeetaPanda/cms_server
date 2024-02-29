// var createError = require("http-errors");
var express = require("express");
var path = require("path");
var app = express();
const cors = require("cors");
const session = require("express-session");
const fileUpload = require("express-fileupload");

app.use(cors());
app.use(express.json());
app.use(
  session({
    secret: "abcd1234key",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(fileUpload());

// app.set('view engine', 'html');
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

// app.use((req, res, next) => {
//   const allowedOrigins = ["https://14.142.244.14:443/","https://inorbitcontactmanagement.kraheja.com"];
//   const origin = req.headers.origin;
//   console.log("header", req.headers.origin);
//   if (allowedOrigins.includes(origin)) {
//     res.setHeader("Access-Control-Allow-Origin", origin);
//     return next();
//   }
// });

var mailAccessToken = require("./apis/MailSend/getAccessToken");
app.use("/apis/MailSend/getAccessToken", mailAccessToken);

var bulkMailSend = require("./apis/MailSend/BulkMailSend");
app.use("/apis/MailSend/BulkMailSend", bulkMailSend);

var scanCardRouter = require("./apis/ScanCard/ScanCard");
app.use("/apis/ScanCard/ScanCard", scanCardRouter);

var getAccessTokenRouter = require("./apis/sharepoint/getAccessToken");
app.use("/apis/sharepoint/getAccessToken", getAccessTokenRouter);

var contactDataGetRouter = require("./apis/sharepoint/contactDataGet");
app.use("/apis/sharepoint/contactDataGet", contactDataGetRouter);

var ddOptionsGetRouter = require("./apis/sharepoint/ddOptionsGet");
app.use("/apis/sharepoint/ddOptionsGet", ddOptionsGetRouter);

var employeeDetailsGetRouter = require("./apis/sharepoint/employeeDetailsGet");
app.use("/apis/sharepoint/employeeDetailsGet", employeeDetailsGetRouter);

var mailHistoryGetRouter = require("./apis/sharepoint/mailHistoryGet");
app.use("/apis/sharepoint/mailHistoryGet", mailHistoryGetRouter);

var meetingDataGetRouter = require("./apis/sharepoint/meetingDataGet");
app.use("/apis/sharepoint/meetingDataGet", meetingDataGetRouter);

var empRoleUpdateRouter = require("./apis/sharepoint/empRoleUpdate");
app.use("/apis/sharepoint/empRoleUpdate", empRoleUpdateRouter);

var employeeCreateRouter = require("./apis/sharepoint/employeeCreate");
app.use("/apis/sharepoint/employeeCreate", employeeCreateRouter);

var employeeDeleteRouter = require("./apis/sharepoint/employeeDelete");
app.use("/apis/sharepoint/employeeDelete", employeeDeleteRouter);

var contactCreateRouter = require("./apis/sharepoint/contactCreate");
app.use("/apis/sharepoint/contactCreate", contactCreateRouter);

var meetingDataCreateRouter = require("./apis/sharepoint/meetingDataCreate");
app.use("/apis/sharepoint/meetingDataCreate", meetingDataCreateRouter);

var ddOptionDeleteRouter = require("./apis/sharepoint/ddOptionDelete");
app.use("/apis/sharepoint/ddOptionDelete", ddOptionDeleteRouter);

var ddOptionCreateRouter = require("./apis/sharepoint/ddOptionCreate");
app.use("/apis/sharepoint/ddOptionCreate", ddOptionCreateRouter);

var contactDeleteUpdateRouter = require("./apis/sharepoint/contactDeleteUpdate");
app.use("/apis/sharepoint/contactDeleteUpdate", contactDeleteUpdateRouter);

var contactUpdateRouter = require("./apis/sharepoint/contactUpdate");
app.use("/apis/sharepoint/contactUpdate", contactUpdateRouter);

var meetingDeleteRouter = require("./apis/sharepoint/meetingDelete");
app.use("/apis/sharepoint/meetingDelete", meetingDeleteRouter);

var mailHistoryCreateRouter = require("./apis/sharepoint/mailHistoryCreate");
app.use("/apis/sharepoint/mailHistoryCreate", mailHistoryCreateRouter);

// app.use(express.static(__dirname + "/assets/tax_documents"));

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error", {
    message: err.message,
    error: err,
  });
});

module.exports = app;
