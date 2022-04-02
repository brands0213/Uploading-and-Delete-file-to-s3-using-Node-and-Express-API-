require("dotenv").config();
const express = require('express');
const app = express();
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');


aws.config.update({
    secretAccessKey: process.env.ACCESS_SERCRET,
    accessKeyId: process.env.ACCESS_KEY,
    region: process.env.REGION
});

const BUCKET = process.env.BUCKET

const s3 = new aws.S3();
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: BUCKET,
        key: function (req, file, cb) {
            console.log(file);
            cb(null, file.originalname)
        }
    })
})

app.post('/upload', upload.single('file'), async function (req, res, next) {
    
    res.status(200).send('Successfully Uploaded')

})


app.delete("/delete/:filename", async (req, res) => {
    
    const filename = req.params.filename

    await s3.deleteObject({ Bucket: BUCKET, Key: filename }).promise();
    
    res.send("File Deleted Successfully")

})

app.listen(process.env.PORT || port, ()=>console.log(`Now listens to port ${process.env.PORT || port}`))     
