const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const dotenv = require('dotenv');
const {NOVEL, addReading} = require('../models/novel');
const CLASS = require('../models/class');

dotenv.config();

aws.config.update({
  secretAccessKey: process.env.AWS_SECRET,
  accessKeyId: process.env.AWS_KEY,
  region: process.env.REGION
});

const s3 = new aws.S3();
const BUCKET = process.env.BUCKET;

const upload = multer({
  storage: multerS3({
    bucket: BUCKET,
    s3: s3,
    key: (req, file, cb) => {
      console.log(file.originalname);
      cb(null, file.originalname);
    }
  })
});

exports.uploadFile = upload.single('file');

exports.uploadResource = async (req, res) => {
  try {
    const { typeOfResource } = req.params;
    const { title, author, genre, language, publicationYear } = req.body;
    console.log(typeOfResource, req.body);
    const query = {
      genres: [genre],
      author,
      language,
      title,
      filename: req.file.originalname,
      publicationYear,
    };

    const newPDF = typeOfResource === 'class' ? new CLASS({ ...req.body, filename: req.file.originalname }) : new NOVEL(query);
    await newPDF.save();
    console.log(query, newPDF);
    res.send('Successfully uploaded ' + req.file.location + ' location!');
  } catch (e) {
    console.log(e);
  }
};

exports.listFiles = async (req, res) => {
  let r = await s3.listObjectsV2({ Bucket: BUCKET }).promise();
  let x = r.Contents.map(item => item.Key);
  res.send(x);
};

exports.downloadFile = async (req, res) => {
  try {
    const { filename } = req.params;
    console.log(filename)
    const { userId, novelId, typeOfResource } = req.query;
    let x = await s3.getObject({ Bucket: BUCKET, Key: filename }).promise();
    if (typeOfResource === 'novel') await addReading(novelId, userId);
    res.send(x.Body);
  } catch (e) {
    console.log(e.message);
    res.status(500).send('An error occurred while downloading the file.');
  }
};

exports.deleteFile = async (req, res) => {
  const filename = req.params.filename;
  await s3.deleteObject({ Bucket: BUCKET, Key: filename }).promise();
  await PDF.findOneAndDelete({ filename });
  res.send('file deleted successfully');
};
