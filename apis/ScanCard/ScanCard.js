var express = require("express");
var router = express.Router();
const {
  AzureKeyCredential,
  DocumentAnalysisClient,
} = require("@azure/ai-form-recognizer");
const fs = require("fs");
const path = require("path");

/*   
API url: -   
http://localhost:9000/apis/ScanCard/ScanCard
 


*/

router.post("/", async function (req, res, next) {
  try {
    let files = req.files;

    if (files) {
      Object.keys(files).forEach(function (key, index) {
        var fileExt = files[key].name.split(".").pop();
        var pathName =
          __dirname + "../../../assets/business_card/contactCard." + fileExt;

        files[key].mv(path.join(pathName), async function (err) {
          if (err) {
            return res.status(500).send(err);
          } else {
            console.log("Doc uploaded");
            // -----------------------------------------------
            const key = "b28919856b07403784d01eb6b7c9a0d1"; //KRC key

            const endpoint =
              "https://inorbit-cms-doc-intelligence.cognitiveservices.azure.com/"; //KRC endpoint

            const localImagePath =
              __dirname +
              "../../../assets/business_card/contactCard." +
              fileExt;
            // const localImagePath = __dirname + "../../../../business_cards/card4.png";

            const client = new DocumentAnalysisClient(
              endpoint,
              new AzureKeyCredential(key)
            );
            if (client) {
              // Read the file into a buffer
              const fileBuffer = fs.readFileSync(localImagePath);

              const poller = await client.beginAnalyzeDocument(
                "prebuilt-businessCard",
                fileBuffer
              );

              //  const {
              //    documents: [result],
              //  } =

              await poller
                .pollUntilDone()
                .then((response) => {
                  let result;
                  if (response != null) {
                    result = response.documents[0];
                  }
                  let contactData = {};

                  if (result) {
                    const businessCard = result.fields;
                    // console.log("=== Business Card Information ===", businessCard);

                    const name =
                      businessCard.ContactNames &&
                      businessCard.ContactNames.values[0];
                    if (name) {
                      const { FirstName, LastName } = name.properties;
                      // console.log(
                      //   "Name:",
                      //   FirstName && FirstName.content,
                      //   LastName && LastName.content
                      // );
                      contactData.name0 =
                        FirstName.content + " " + LastName.content;
                    }
                    const company =
                      businessCard.CompanyNames &&
                      businessCard.CompanyNames.values[0];
                    if (company) {
                      // console.log("Company:", company.content);
                      contactData.company = company.content;
                    }

                    const address =
                      businessCard.Addresses &&
                      businessCard.Addresses.values[0];
                    if (address) {
                      // console.log("Address:", address.content);
                      contactData.address = address.content;
                    }

                    const job_titles =
                      businessCard.JobTitles &&
                      businessCard.JobTitles.values[0];
                    if (job_titles) {
                      // console.log("Job Title:", job_titles.content);
                      contactData.designation = job_titles.content;
                    }

                    const email =
                      businessCard.Emails && businessCard.Emails.values[0];
                    if (email) {
                      // console.log("Email:", email.content);
                      contactData.email = email.content;
                    }

                    const mobile_no =
                      businessCard.MobilePhones &&
                      businessCard.MobilePhones.values[0];
                    if (mobile_no) {
                      // console.log("Mobile Number:", mobile_no.content);
                      contactData.mobile = mobile_no.content;
                    }
                    const otherphone =
                      businessCard.OtherPhones &&
                      businessCard.OtherPhones.values[0];

                    if (otherphone) {
                      // console.log("Other Phone:", otherphones.content);
                      if (mobile_no) {
                        contactData.landline = otherphone.content;
                      } else {
                        contactData.mobile = otherphone.content;
                        if (
                          businessCard.OtherPhones &&
                          businessCard.OtherPhones.values.length > 1
                        ) {
                          contactData.landline =
                            businessCard.OtherPhones.values[1].content;
                        }
                      }
                    }

                    const workphone =
                      businessCard.WorkPhones &&
                      businessCard.WorkPhones.values[0];
                    if (workphone) {
                      // console.log("Work Phone:", workphone.content);
                      if (mobile_no) {
                        contactData.landline = workphone.content;
                      } else {
                        contactData.mobile = workphone.content;
                        if (
                          businessCard.WorkPhones &&
                          businessCard.WorkPhones.values.length > 1
                        ) {
                          contactData.landline =
                            businessCard.WorkPhones.values[1].content;
                        }
                      }
                    }
                    //   console.log("businessCard", businessCard.WorkPhones.values);
                    res.send(contactData);
                  } else {
                    // throw new Error(
                    //   "Expected at least one business card in the result."
                    // );
                    res.send("Error");
                  }
                })
                .catch((err) => {
                  console.log("asdasdasd", err);
                });
            } else {
              res.send("No client");
            }

            // ------------------
          }
        });
      });
    } else {
      res.send("No file");
    }
  } catch (e) {
    console.log({ error: e, fileName: __filename });
    res.send({ error: e, fileName: __filename });
  }
});

module.exports = router;
