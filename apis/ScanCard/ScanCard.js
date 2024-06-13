const express = require("express");
const router = express.Router();
const {
  AzureKeyCredential,
  DocumentAnalysisClient,
} = require("@azure/ai-form-recognizer");
const fs = require("fs");
const path = require("path");

router.post("/", async function (req, res) {
  try {
    const files = req.files;
    if (!files) return res.status(400).send("No file uploaded");

    const fileKeys = Object.keys(files);

    for (const key of fileKeys) {
      const file = files[key];
      const fileExt = file.name.split(".").pop();
      const localImagePath = path.join(
        __dirname,
        `../../../assets/business_card/contactCard.${fileExt}`
      );

      await new Promise((resolve, reject) => {
        file.mv(localImagePath, async function (err) {
          if (err) return reject(err);

          try {
            const key = "YOUR_AZURE_KEY";
            const endpoint = "YOUR_AZURE_ENDPOINT";
            const fileBuffer = fs.readFileSync(localImagePath);
            const client = new DocumentAnalysisClient(
              endpoint,
              new AzureKeyCredential(key)
            );
            const poller = await client.beginAnalyzeDocument(
              "prebuilt-businessCard",
              fileBuffer
            );
            const analysisResult = await poller.pollUntilDone();

            // Process analysis result here
            const contactData = {}; // Customize this according to your analysis result

            res.status(200).json(contactData);
          } catch (error) {
            console.error("Error during document analysis:", error);
            res.status(500).send("Error processing document");
          } finally {
            // Delete the temporary file after processing
            fs.unlinkSync(localImagePath);
          }
        });
      });
    }
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
