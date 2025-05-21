var express = require("express");
var router = express.Router();
var axios = require("axios");
const clientData = require("../../constants/clientData");
var FormData = require("form-data");
var fs = require("fs");
var forge = require("node-forge");
var jwt = require("jsonwebtoken");
var crypto = require("crypto");
const tenantId = require("../../constants/clientData").resourceId;
const clientId = require("../../constants/clientData").sharepoint_app_client_id;

/*   
API url: -   
http://localhost:9000/apis/sharepoint/getAccessToken
*/

// router.get("/", async function (req, res, next) {
//   try {
//     let authData = new FormData();
//     authData.append("grant_type", clientData.grant_type);
//     authData.append("client_id", clientData.client_id);
//     authData.append("client_secret", clientData.client_secret);
//     authData.append("resource", clientData.resource);

//     axios
//       .post(
//         `https://accounts.accesscontrol.windows.net/${clientData.resourceId}/tokens/OAuth/2/`,
//         authData
//       )
//       .then((response) => {
//         res.send({ access_token: response.data.access_token });
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   } catch (e) {
//     console.log({ error: e, fileName: __filename });
//     res.send({ error: e, fileName: __filename });
//   }
// });
router.get("/", async function (req, res, next) {
  try {
    function getClientAssertion() {
      const pfxPath = "./certs/Kraheja.pfx"; // put your pfx path here
      const pfxPassword = "Kraheja@321";

      // Read PFX file
      const pfxBuffer = fs.readFileSync(pfxPath);

      // Convert PFX to PEM (private key)
      const p12Asn1 = forge.asn1.fromDer(pfxBuffer.toString("binary"));
      const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, pfxPassword);
      // Try to get keyBag first
      let keyObj = p12.getBags({ bagType: forge.pki.oids.keyBag })[
        forge.pki.oids.keyBag
      ];

      // If keyBag not found, fallback to pkcs8ShroudedKeyBag
      if (!keyObj || keyObj.length === 0) {
        keyObj = p12.getBags({ bagType: forge.pki.oids.pkcs8ShroudedKeyBag })[
          forge.pki.oids.pkcs8ShroudedKeyBag
        ];
      }

      // If still nothing, throw error
      if (!keyObj || keyObj.length === 0) {
        throw new Error(
          "No private key found in the PFX file. Check the certificate and password."
        );
      }

      const pfxAsn1 = forge.asn1.fromDer(pfxBuffer.toString("binary"));
      const pfx = forge.pkcs12.pkcs12FromAsn1(pfxAsn1, pfxPassword);

      // Get certificate
      const certBag = pfx.getBags({ bagType: forge.pki.oids.certBag });
      const cert = certBag[forge.pki.oids.certBag][0].cert;
      const certDer = forge.asn1
        .toDer(forge.pki.certificateToAsn1(cert))
        .getBytes();
      const certRaw = Buffer.from(certDer, "binary");

      // Compute SHA-1 thumbprint
      const thumbprint = crypto
        .createHash("sha1")
        .update(certRaw)
        .digest("base64");

      const privateKey = forge.pki.privateKeyToPem(keyObj[0].key);

      // JWT claims
      const now = Math.floor(Date.now() / 1000);
      const tokenPayload = {
        aud: `https://login.microsoftonline.com/${tenantId}/v2.0`,
        iss: clientId,
        sub: clientId,
        jti: `${Math.random() * 100000}`,
        exp: now + 3600, // 1 hour validity
        nbf: now,
        iat: now,
      };

      // JWT header
      const tokenHeader = {
        alg: "RS256",
        typ: "JWT",
        x5t: thumbprint,
      };

      // Sign the JWT
      const clientAssertion = jwt.sign(tokenPayload, privateKey, {
        algorithm: "RS256",
        header: tokenHeader,
      });

      // Output the client assertion token
      // console.log("Client Assertion JWT:\n\n", clientAssertion);
      return clientAssertion;
    }
    let authData = new FormData();
    authData.append("grant_type", "client_credentials");
    authData.append("scope", clientData.scope);
    authData.append("client_assertion_type", clientData.client_assertion_type);
    authData.append("client_assertion", getClientAssertion());

    axios
      .post(
        `https://login.microsoftonline.com/${clientData.resourceId}/oauth2/v2.0/token`,
        authData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then((response) => {
        res.send({ access_token: response.data.access_token });
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
