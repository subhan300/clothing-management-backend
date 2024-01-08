// api/savepdf.js

const fs = require("fs");

export default async function handler(req, res) {
  //Send the data for the pdf in the request as query params such as the title and filename
  const {
    query: { title, filename },
  } = req;
  //use the tmp serverless function folder to create the write stream for the pdf
  let writeStream = fs.createWriteStream(`/tmp/${filename}.csv`);

  writeStream.on("finish", async function () {
    //once the doc stream is completed, read the file from the tmp folder
    const fileContent = fs.readFileSync(`/tmp/${filename}.csv`);
    try {
      const response = await axios.post(
        "https://system-backend-three.vercel.app//api/upload/upload-file",
        formData
      );

      return response;
    } catch (err) {
      return err;
    }
  });
}
