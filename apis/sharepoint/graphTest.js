var express = require("express");
var router = express.Router();
var axios = require("axios");
const clientData = require("../../constants/clientData");
var FormData = require("form-data");
const fs = require("fs"); // Required to read files from the file system
const path = require("path");

/*   
API url: -   
http://localhost:9000/apis/sharepoint/graphTest
*/

router.post("/", async function (req, res, next) {
  try {
    console.log("hsdfjsgdf", req.files);
    let SourceAccount = "itsm_testing@samishti.com";
    let token =
      "eyJ0eXAiOiJKV1QiLCJub25jZSI6InpNbGh4ZTU3Y0RSdERLTnAzR0VhanZPdUxjMGJMTl9hcko1aDVkUFhsbXMiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik1jN2wzSXo5M2c3dXdnTmVFbW13X1dZR1BrbyIsImtpZCI6Ik1jN2wzSXo5M2c3dXdnTmVFbW13X1dZR1BrbyJ9.eyJhdWQiOiJodHRwczovL2dyYXBoLm1pY3Jvc29mdC5jb20iLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC80YTY1ZDM5ZS1iM2E4LTQwMmUtODZiMC1jMTMxNmJhMzcyYmEvIiwiaWF0IjoxNzI4ODQxNzkwLCJuYmYiOjE3Mjg4NDE3OTAsImV4cCI6MTcyODg0NTY5MCwiYWlvIjoiazJCZ1lKaHptbzFYSkgzaG1VUHZ2Z1FvL2k5cUFRQT0iLCJhcHBfZGlzcGxheW5hbWUiOiJpdHNtX3N1cHBvcnRQb3J0YWwiLCJhcHBpZCI6IjNlYWMzY2I2LWZiZDctNGI4Ny1hYmU5LTgxYmQxMjA2M2IwYSIsImFwcGlkYWNyIjoiMSIsImlkcCI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0LzRhNjVkMzllLWIzYTgtNDAyZS04NmIwLWMxMzE2YmEzNzJiYS8iLCJpZHR5cCI6ImFwcCIsIm9pZCI6IjVlNTYwYzg3LTM4NmMtNDM1Yy1iNDM0LTk4NzU4MmNjMGQxNyIsInJoIjoiMC5BVDBBbnRObFNxaXpMa0NHc01FeGE2Tnl1Z01BQUFBQUFBQUF3QUFBQUFBQUFBQTlBQUEuIiwicm9sZXMiOlsiTWFpbC5SZWFkV3JpdGUiLCJNYWlsLlJlYWRCYXNpYy5BbGwiLCJNYWlsLlJlYWQiLCJNYWlsLlNlbmQiXSwic3ViIjoiNWU1NjBjODctMzg2Yy00MzVjLWI0MzQtOTg3NTgyY2MwZDE3IiwidGVuYW50X3JlZ2lvbl9zY29wZSI6IkFTIiwidGlkIjoiNGE2NWQzOWUtYjNhOC00MDJlLTg2YjAtYzEzMTZiYTM3MmJhIiwidXRpIjoiSjhnak5pVmVGVWk2Qk1INjB0b3pBQSIsInZlciI6IjEuMCIsIndpZHMiOlsiMDk5N2ExZDAtMGQxZC00YWNiLWI0MDgtZDVjYTczMTIxZTkwIl0sInhtc19pZHJlbCI6IjcgMjYiLCJ4bXNfdGNkdCI6MTU2MTA5OTQ3OX0.FquWgCQ_CA8OBHaIl3Rwhv8IEtiqr0OjhsnqYSEOfKh3E8TPqCkS0XV7E8Q2wSaqK3tyD01271neT1qUHwaBrpBHBDLiTyl6O3GgW9VEYTT6pW3Thv9UhkIQHSs1ODowaoOOocgGXwqHQA-vDjcYh59vVTbeYdGwjqN79_51Exu3JKqOzFkZ_1dOaQu5YFaerNqbm5g82zM3prtnE4styw8jb73UgLsshF3t93DaV8w6hJwAuG6vhdZ9w6ebvUir3Ry5QQ8vEMLyY18F3T52xnenqJjKKU0QWhZ2l2Y7zp3m9TM3X1y9clTYNJ8PEGiTWN-R7d6zl5Lq0Tvy1ca1Tg";
    // let messageId =
    //   "AAMkADYxMTFjY2ZiLWZhMjItNGVmMi1iYTU1LWZjZGQ3MDI5Yjc2YgBGAAAAAAALmWEug-h6SrWJw-2mwUDXBwBfTUgHrr6YSZG_FDUqyKSnAAAAAAEMAABfTUgHrr6YSZG_FDUqyKSnAAAowDOMAAA=";
    let conversationid =
      "AAQkADYxMTFjY2ZiLWZhMjItNGVmMi1iYTU1LWZjZGQ3MDI5Yjc2YgAQABL0BELy2kiri25yo0eob7c=";
    // let conversationid =
    //   "AAQkADYxMTFjY2ZiLWZhMjItNGVmMi1iYTU1LWZjZGQ3MDI5Yjc2YgAQANBMmF8oJXFPitIvMr4rObY=";
    cc = ["joyeeta.b@samishti.com"];
    let messageId =
      "AAMkADYxMTFjY2ZiLWZhMjItNGVmMi1iYTU1LWZjZGQ3MDI5Yjc2YgBGAAAAAAALmWEug-h6SrWJw-2mwUDXBwBfTUgHrr6YSZG_FDUqyKSnAAAAAAEMAABfTUgHrr6YSZG_FDUqyKSnAAAw446wAAA=";

    async function createAndSendReply(
      originalMessageId,
      accessToken,
      ccEmails,
      attachments
    ) {
      const replyUrl = `https://graph.microsoft.com/v1.0/users/${SourceAccount}/messages/${originalMessageId}/createreply`;

      try {
        // Step 1: Create the reply draft
        const draftResponse = await fetch(replyUrl, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!draftResponse.ok) {
          const errorDetails = await draftResponse.json();
          console.error(
            "Error creating reply draft:",
            draftResponse.status,
            draftResponse.statusText,
            errorDetails
          );
          res.send({ errorDetails });

          return;
        }

        const draftMessage = await draftResponse.json();
        const draftMessageId = draftMessage.id;
        const originalSubject = draftMessage.subject || ""; // Retrieve original subject

        console.log("Reply draft created successfully:");

        // Step 2: Update the draft with your custom body content
        const updateDraftUrl = `https://graph.microsoft.com/v1.0/users/${SourceAccount}/messages/${draftMessageId}`;
        const ccRecipients = ccEmails.map((email) => ({
          emailAddress: {
            address: email,
          },
        }));
        const updatedSubject = originalSubject.startsWith("Re:")
          ? originalSubject
          : `Re: Ticket_ID:25134615 ${originalSubject}`;

        const updatedContent = {
          subject: updatedSubject,
          body: {
            contentType: "HTML",
            content:
              "<html><body><div><p>This is your custom reply content. See original email below 1234.</p></div></body></html>",
          },
          ccRecipients,
        };

        const updateDraftResponse = await fetch(updateDraftUrl, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedContent),
        });

        if (!updateDraftResponse.ok) {
          const errorDetails = await updateDraftResponse.json();
          console.error(
            "Error updating the draft:",
            updateDraftResponse.status,
            updateDraftResponse.statusText,
            errorDetails
          );
          res.send({ errorDetails });

          return;
        }

        console.log("Draft body updated successfully.");
        if (attachments) {
          const attachmentUrl = `https://graph.microsoft.com/v1.0/users/${SourceAccount}/messages/${draftMessageId}/attachments`;

          // If ATTACHMENTS is a single object, convert it into an array
          const attachmentArray = Array.isArray(attachments)
            ? attachments
            : [attachments];

          for (const file of attachmentArray) {
            // Convert buffer to base64
            const base64Content = file.data.toString("base64");

            const attachmentContent = {
              "@odata.type": "#microsoft.graph.fileAttachment",
              name: file.name, // Original file name
              contentBytes: base64Content, // Base64 content
              contentType: file.mimetype, // MIME type (e.g., application/pdf, text/csv)
            };

            const attachmentResponse = await fetch(attachmentUrl, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(attachmentContent),
            });

            if (!attachmentResponse.ok) {
              const errorDetails = await attachmentResponse.json();
              console.error(
                `Error adding attachment '${file.name}':`,
                attachmentResponse.status,
                attachmentResponse.statusText,
                errorDetails
              );
              return { error: errorDetails };
            }

            console.log(`Attachment '${file.name}' added successfully.`);
          }
        }

        // Step 3: Send the updated reply draft
        const sendUrl = `https://graph.microsoft.com/v1.0/users/${SourceAccount}/messages/${draftMessageId}/send`;
        const sendResponse = await fetch(sendUrl, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!sendResponse.ok) {
          const errorDetails = await sendResponse.json();
          console.error(
            "Error sending the reply:",
            sendResponse.status,
            sendResponse.statusText,
            errorDetails
          );
          res.send({ errorDetails });
          return;
        }

        console.log("Reply sent successfully!");
        res.send("Reply sent successfully!");
      } catch (error) {
        console.error("Unexpected error:", error);
        res.send({ error });
      }
    }
    await createAndSendReply(messageId, token, cc, req.files.ATTACHMENTS);

    // async function sendMailReplyWithCC(messageId, accessToken, ccEmails) {
    //   // Step 1: Draft the reply
    //   const draftUrl = `https://graph.microsoft.com/v1.0/users/itsm_testing@samishti.com/messages/${messageId}/reply`;

    //   const replyBody = {
    //     message: {
    //       body: {
    //         contentType: "HTML",
    //         content: "This is a reply to your email.",
    //       },
    //     },
    //   };

    //   try {
    //     // Create the draft reply
    //     const draftResponse = await fetch(draftUrl, {
    //       method: "POST",
    //       headers: {
    //         Authorization: `Bearer ${accessToken}`,
    //         "Content-Type": "application/json",
    //       },
    //       body: replyBody,
    //     });

    //     // Check if the response contains content before parsing as JSON
    //     if (!draftResponse.ok) {
    //       let errorDetails;
    //       try {
    //         errorDetails = await draftResponse.json(); // Attempt to parse as JSON
    //       } catch (e) {
    //         errorDetails = await draftResponse.text(); // Fallback to text if not JSON
    //       }
    //       console.error(
    //         "Error drafting reply:",
    //         draftResponse.status,
    //         draftResponse.statusText,
    //         errorDetails
    //       );
    //       return;
    //     }
    //     console.log("Draft Response Status:", draftResponse.status);
    //     console.log("Draft Response Headers:", draftResponse.headers);
    //     // Only try to parse the JSON if there is content
    //     const contentLength = draftResponse.headers.get("content-length");
    //     if (contentLength && parseInt(contentLength) > 0) {
    //       const draftMessage = await draftResponse.json();
    //       const draftMessageId = draftMessage.id;

    //       // Step 2: Update the draft with CC recipients
    //       const updateUrl = `https://graph.microsoft.com/v1.0/users/itsm_testing@samishti.com/messages/${draftMessageId}`;

    //       // Create an array of CC recipients in the required format
    //       const ccRecipients = ccEmails.map((email) => ({
    //         emailAddress: {
    //           address: email,
    //         },
    //       }));

    //       const updateBody = {
    //         body: {
    //           contentType: "HTML",
    //           content: "This is a custom reply body message.",
    //         },
    //       };

    //       // Update the draft with CC recipients
    //       const updateResponse = await fetch(updateUrl, {
    //         method: "PATCH",
    //         headers: {
    //           Authorization: `Bearer ${accessToken}`,
    //           "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify(updateBody),
    //       });

    //       if (!updateResponse.ok) {
    //         let updateErrorDetails;
    //         try {
    //           updateErrorDetails = await updateResponse.json(); // Attempt to parse as JSON
    //         } catch (e) {
    //           updateErrorDetails = await updateResponse.text(); // Fallback to text if not JSON
    //         }
    //         console.error(
    //           "Error updating draft with CC:",
    //           updateResponse.status,
    //           updateResponse.statusText,
    //           updateErrorDetails
    //         );
    //         return;
    //       }

    //       // Step 3: Send the updated draft
    //       const sendUrl = `https://graph.microsoft.com/v1.0/users/itsm_testing@samishti.com/messages/${draftMessageId}/send`;
    //       const sendResponse = await fetch(sendUrl, {
    //         method: "POST",
    //         headers: {
    //           Authorization: `Bearer ${accessToken}`,
    //         },
    //       });

    //       if (sendResponse.ok) {
    //         console.log("Reply with CC sent successfully!");
    //         res.send("Reply with CC sent successfully!");
    //       } else {
    //         let sendErrorDetails;
    //         try {
    //           sendErrorDetails = await sendResponse.json(); // Attempt to parse as JSON
    //         } catch (e) {
    //           sendErrorDetails = await sendResponse.text(); // Fallback to text if not JSON
    //         }
    //         console.error(
    //           "Error sending the reply:",
    //           sendResponse.status,
    //           sendResponse.statusText,
    //           sendErrorDetails
    //         );
    //         res.send({ sendErrorDetails });
    //       }
    //     } else {
    //       console.error(
    //         "Error: The response body was empty when drafting the message."
    //       );
    //       res.send(
    //         "Error: The response body was empty when drafting the message."
    //       );
    //     }
    //   } catch (error) {
    //     console.error("Unexpected error:", error);
    //     res.send({ error });
    //   }
    // }

    // async function sendMailReply(messageId, accessToken) {
    //   // Construct the URL for replying to the message
    //   const url = `https://graph.microsoft.com/v1.0/users/itsm_testing@samishti.com/messages/${messageId}/reply`;

    //   const replyBody = {
    //     message: {
    //       body: {
    //         contentType: "HTML",
    //         content: "This is a reply to your email.",
    //       },
    //       ccRecipients: [
    //         {
    //           emailAddress: {
    //             address: "joyeeta.b@samishti.com",
    //           },
    //         },
    //       ],
    //     },
    //   };

    //   try {
    //     // Step 1: Make the reply request (this will also send the reply)
    //     const response = await fetch(url, {
    //       method: "POST",
    //       headers: {
    //         Authorization: `Bearer ${accessToken}`,
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify(replyBody),
    //     });

    //     // If the request fails, capture the error details
    //     if (!response.ok) {
    //       const errorDetails = await response.json();
    //       console.error(
    //         "Error sending reply:",
    //         response.status,
    //         response.statusText,
    //         errorDetails
    //       );
    //       res.send("Reply NOT sent successfully!");
    //     } else {
    //       console.log("Reply sent successfully!");
    //       res.send("Reply sent successfully!");
    //     }
    //   } catch (error) {
    //     // Log any unexpected errors
    //     console.error("Unexpected error:", error);
    //     res.send({ error });
    //   }
    // }
    // -------------from python---------------
    //     const headers = {
    //       Authorization: `Bearer ${token}`,
    //       "Content-Type": "application/json",
    //     };

    //     async function createReplyDraft(messageId) {
    //       const url = `https://graph.microsoft.com/v1.0/users/${SourceAccount}/messages/${messageId}/createReply`;

    //       try {
    //         const response = await axios.post(url, {}, { headers });
    //         return response.data;
    //       } catch (error) {
    //         if (error.response && error.response.status === 403) {
    //           console.error("Error response:", error.response.data);
    //         }
    //         throw error;
    //       }
    //     }

    //     async function updateSubject(draftMessageId, jsonData) {
    //       const url = `https://graph.microsoft.com/v1.0/users/${SourceAccount}/messages/${draftMessageId}`;

    //       const body = {
    //         // subject: `This is updated subject 5674`,
    //         body: {
    //           contentType: "HTML",
    //           content: `
    // <html>
    // <body>
    //               <p>This is reply email 5674</p>
    // </body>
    // </html>
    //             `,
    //         },
    //       };

    //       try {
    //         const response = await axios.patch(url, body, { headers });
    //         return response.data;
    //       } catch (error) {
    //         console.error(
    //           "Error updating subject:",
    //           error.response ? error.response.data : error.message
    //         );
    //         throw error;
    //       }
    //     }
    //     async function attachFiles(draftMessageId, bodyDict) {
    //       const attachments = bodyDict.ATTACHMENT;

    //       for (const file of attachments) {
    //         const fileName = file.filename;
    //         const fileContent = fs.readFileSync(file.filePath).toString("base64");

    //         // Attachment payload
    //         const attachmentPayload = {
    //           "@odata.type": "#microsoft.graph.fileAttachment",
    //           name: fileName,
    //           contentType: file.contentType,
    //           contentBytes: fileContent,
    //         };

    //         // URL for attaching the file
    //         const attachmentUrl = `https://graph.microsoft.com/v1.0/users/${SourceAccount}/messages/${draftMessageId}/attachments`;

    //         try {
    //           const response = await axios.post(attachmentUrl, attachmentPayload, {
    //             headers,
    //           });
    //           if (response.status === 201) {
    //             console.log(`Attachment '${fileName}' added successfully.`);
    //           } else {
    //             console.log(
    //               `Failed to add attachment '${fileName}': ${response.status}`
    //             );
    //           }
    //         } catch (error) {
    //           console.error(
    //             "Error attaching file:",
    //             error.response ? error.response.data : error.message
    //           );
    //         }
    //       }
    //     }
    //     async function ackEmailSend(messageId, bodyDict) {
    //       try {
    //         const draftedMessage = await createReplyDraft(messageId);
    //         const draftMessageId = draftedMessage.id;

    //         //  await attachFiles(draftMessageId, bodyDict);
    //         await updateSubject(draftMessageId, bodyDict);

    //         const url = `https://graph.microsoft.com/v1.0/users/${SourceAccount}/messages/${draftMessageId}/send`;

    //         const response = await axios.post(url, {}, { headers });

    //         if (response.status === 202) {
    //           console.log("Email sent successfully.");
    //         } else {
    //           console.log(
    //             `Failed to send email: ${response.status} - ${response.data}`
    //           );
    //         }
    //       } catch (error) {
    //         console.error("Error sending acknowledgment email:", error.message);
    //       }
    //     }

    //     ackEmailSend(messageId);
    // -------------from python end---------------
  } catch (e) {
    console.log({ error: e, fileName: __filename });
    res.send({ error: e, fileName: __filename });
  }
});

module.exports = router;
