const express = require("express");
const path = require("path");
const cors = require("cors");
const session = require("express-session");
const fileUpload = require("express-fileupload");
const helmet = require("helmet");

const app = express();

// Configure CORS options
// const corsOptions = {
//   origin: "https://inorbitcontactmanagement.kraheja.com",
//   methods: ["GET", "POST"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   credentials: true, // Allow credentials if needed
// };

// Apply CORS middleware first
// app.use(cors(corsOptions));
app.use(cors());

// Middleware to check referer or origin
const checkReferer = (req, res, next) => {
  const referer = req.get("referer");
  const origin = req.get("origin");
  if (
    referer &&
    origin &&
    (referer === "https://inorbitcontactmanagement.kraheja.com" ||
      origin === "https://inorbitcontactmanagement.kraheja.com")
  ) {
    next();
  } else {
    res.status(403).send("Forbidden");
  }
};
// app.use(checkReferer);

// Apply security-related middleware
app.use(helmet());

// Configure HSTS with helmet
app.use(
  helmet.hsts({
    maxAge: 31536000, // 1 year in seconds
    includeSubDomains: true,
    preload: true,
  })
);

// Ensure 'X-XSS-Protection' header is set correctly
app.use((req, res, next) => {
  res.setHeader("X-XSS-Protection", "1; mode=block");
  next();
});

// Disable 'X-Powered-By' header
app.disable("x-powered-by");

// Middleware to remove/mask sensitive headers
app.use((req, res, next) => {
  res.removeHeader("X-Powered-By");
  res.removeHeader("Server");
  next();
});

// Middleware to set cache control headers
app.use((req, res, next) => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0"
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("X-Permitted-Cross-Domain-Policies", "none");
  next();
});

// Middleware to log request and response headers
app.use((req, res, next) => {
  // console.log("Request Headers:", req.headers);

  // Intercept and log headers before sending the response
  const originalSend = res.send;
  res.send = function (body) {
    // console.log("Response Headers:", res.getHeaders());
    res.send = originalSend; // Restore original send method
    return res.send(body);
  };

  next();
});

app.use(express.json());
app.use(
  session({
    secret: "abcd1234key",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(fileUpload());

// Configure view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

// Middleware to block disallowed methods
app.use((req, res, next) => {
  const allowedMethods = ["GET", "POST"];
  if (!allowedMethods.includes(req.method)) {
    res.status(405).send("Method Not Allowed");
  } else {
    next();
  }
});

// Define your routes here...
app.use(
  "/apis/MailSend/getAccessToken",
  require("./apis/MailSend/getAccessToken")
);
app.use("/apis/MailSend/BulkMailSend", require("./apis/MailSend/BulkMailSend"));
app.use("/apis/ScanCard/ScanCard", require("./apis/ScanCard/ScanCard"));
app.use(
  "/apis/sharepoint/getAccessToken",
  require("./apis/sharepoint/getAccessToken")
);
app.use(
  "/apis/sharepoint/clientAssertion",
  require("./apis/sharepoint/clientAssertion")
);
app.use(
  "/apis/sharepoint/contactDataGet",
  require("./apis/sharepoint/contactDataGet")
);
app.use(
  "/apis/sharepoint/ddOptionsGet",
  require("./apis/sharepoint/ddOptionsGet")
);
app.use(
  "/apis/sharepoint/employeeDetailsGet",
  require("./apis/sharepoint/employeeDetailsGet")
);
app.use(
  "/apis/sharepoint/mailHistoryGet",
  require("./apis/sharepoint/mailHistoryGet")
);
app.use(
  "/apis/sharepoint/meetingDataGet",
  require("./apis/sharepoint/meetingDataGet")
);
app.use(
  "/apis/sharepoint/empRoleUpdate",
  require("./apis/sharepoint/empRoleUpdate")
);
app.use(
  "/apis/sharepoint/employeeCreate",
  require("./apis/sharepoint/employeeCreate")
);
app.use(
  "/apis/sharepoint/employeeDelete",
  require("./apis/sharepoint/employeeDelete")
);
app.use(
  "/apis/sharepoint/contactCreate",
  require("./apis/sharepoint/contactCreate")
);
app.use(
  "/apis/sharepoint/meetingDataCreate",
  require("./apis/sharepoint/meetingDataCreate")
);
app.use(
  "/apis/sharepoint/ddOptionDelete",
  require("./apis/sharepoint/ddOptionDelete")
);
app.use(
  "/apis/sharepoint/ddOptionCreate",
  require("./apis/sharepoint/ddOptionCreate")
);
app.use(
  "/apis/sharepoint/contactDeleteUpdate",
  require("./apis/sharepoint/contactDeleteUpdate")
);
app.use(
  "/apis/sharepoint/contactUpdate",
  require("./apis/sharepoint/contactUpdate")
);
app.use(
  "/apis/sharepoint/meetingDelete",
  require("./apis/sharepoint/meetingDelete")
);
app.use(
  "/apis/sharepoint/mailHistoryCreate",
  require("./apis/sharepoint/mailHistoryCreate")
);
app.use(
  "/apis/sharepoint/meetingDataUpdate",
  require("./apis/sharepoint/meetingDataUpdate")
);
app.use("/apis/sharepoint/graphTest", require("./apis/sharepoint/graphTest"));

// Static files
app.use(express.static(path.join(__dirname, "assets/mailImage")));

// Error handling
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error", {
    message: err.message,
    error: err,
  });
});

module.exports = app;
