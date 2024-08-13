const Application = require("../models/application.model");
const User = require("../models/user.model");
const mongoose = require("mongoose");

exports.instructorApplication = async (req, res) => {
  try {
    const application = req.body;
    const applicantId = application.applicantId
    const already = await Application.findOne({applicantId});
    if (already) {
      console.log(already);
      res.status(200).json({success:false, already:true})
    } else {
      const newApplication = await Application.create(application);
      if (newApplication) {
        res.status(200).json({ success: true });
      }
    }
  } catch (err) {
    res.status(400).json({ err });
  }
};

exports.getApps = async (req, res) => {
  try {
    const Ids = req.query.fetchedApplicationIds;
    let fetchedApplicationIds = Ids ? Ids.split(",") : [];
    const applications = await Application.find({
      _id: { $nin: fetchedApplicationIds.map((id) => new mongoose.Types.ObjectId(id)) },
      read:false
    })
    .populate('applicantId')
    .limit(5);
    const unreadCount = await Application.countDocuments({ read: false });
    res.status(200).json({applications, unreadCount})

  } catch (error) {
    console.error("Failed to fetch applications:", error);
    res.status(500).json({ error: "Failed to fetch applications" });
  }

};

exports.reviewApplication = async (req, res) => {
  try {
    const {message,userId, AppId} = req.body;

    const user = await User.findById(userId);
    const app = await Application.findById(AppId);
    if ( user && app ) {
      if(message === "approve"){
        user.isInstructor = true;
        app.read = true;
        await app.save();
        await user.save();
        res.status(200).json({success: true});
      }
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update the application" });
  }
};
