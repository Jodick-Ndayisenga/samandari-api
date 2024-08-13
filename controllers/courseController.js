const Course = require("../models/course.model");
const User = require("../models/user.model");
const mongoose = require("mongoose");

exports.createCourse = async (req, res) => {
    console.log(req)
  try {
    const course = req.body;
    const user = await User.findById(course.instructor);
    if (user) {
      const newCourse = await Course.create(course);
      if (newCourse) {
        res.status(200).json({ success: true });
      }
    }else{
        res.status(404).json({message:"User not found"});
    }
  } catch (error) {
    console.error("Error creating course: ", error);
  }
};

exports.getCourses = async (req, res) => {
  try {
    const {userId} = req.params;
    const Ids = req.query.fetchedCoursesIds;
    let fetchedCoursesIds = Ids ? Ids.split(",") : [];
    const user = await User.findById(userId);
    if(user){
      const courses = await Course.find({
        _id:{
          $nin: fetchedCoursesIds.map((id) => new mongoose.Types.ObjectId(id)),
        }
      })
      .limit(5)
      .select('_id image title seats description enrolledStudents')
      .exec();
      if(courses){
        res.status(200).json(courses);
      }
    }
    
  } catch (error) {
    console.log("Error when fetching courses: ", error)
  }
};

exports.findCourse = async (req, res) => {
  try {
    const {id}= req.params;
    const course = await Course.findById(id)
    .populate("instructor", "firstName lastName profileUrl _id education experience school skills");
    if(course){
      res.status(200).json(course);
    }
  } catch (error) {
    console.log("Error when fetching courses: ", error)
  }
};

exports.findCourseSuggestions = async (req, res)=>{
  try {
    const courses = await Course.find({})
    .limit(5)
    .sort({ updatedAt: -1 })
    .exec();
    if(courses){
      res.status(200).json(courses);
    }
  } catch (error) {
    console.log("Error when fetching courses: ", error)
  }
}
