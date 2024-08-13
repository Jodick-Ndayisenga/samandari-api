const CLASS = require('../models/class');

exports.getClassPdfs = async (req, res) => {
  try {
    const query = req.query;
    Object.keys(query).forEach(key => {
      query[key] = query[key]['value'];
    });
    const pdfs = await CLASS.find(query);
    res.send(pdfs);
  } catch (e) {
    console.log(e);
    res.status(500).send('An error occurred while retrieving the files.');
  }
};
