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
        s3,
        bucket: BUCKET,
        key: function (req, file, callback) {
            console.log(file);
            callback(null, file.originalname)
        }
    })
})

app.post('/upload', upload.single('file'), function (req, res) {
    
    if(!upload){
        res.status(400).send('Failed to Upload')
    }

    console.log(upload)
    res.status(200).send('Successfully Uploaded')

})


app.delete("/delete/:filename", async (req, res) => {
    
    const filename = req.params.filename

    await s3.deleteObject({ Bucket: BUCKET, Key: filename }).promise();
    
    res.status(200).send('File Deleted')

})

app.listen(process.env.PORT || port, ()=>console.log(`Now listens to port ${process.env.PORT || port}`))     
