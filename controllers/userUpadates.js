const { uploadFile, deleteFile } = require("./fileUploader");
const User = require("../models/user.model");
const Notification = require("../models/notification.model");
const raw = require("raw-body");

// exports.updateUserProfilePicture = async (req, res) => {
//   const { type, userId, field } = req.params;
//   const imageData = await raw(req);
//   try {
//     const result = await uploadFile(imageData, type, "userProfiles");
//     if (field === "profileUrl") {
//       const user = await User.findByIdAndUpdate(
//         userId,
//         { profileUrl: result.secure_url },
//         { new: true }
//       );
//       const { password, isAdmin, ...userInfo } = user.toObject();
//       res.status(200).json({ user:userInfo });
//     } else if (field === "backgroundUrl") {
//       const user = await User.findByIdAndUpdate(
//         userId,
//         { backgroundUrl: result.secure_url },
//         { new: true }
//       );
//       const { password, isAdmin, ...userInfo } = user.toObject();
//       res.status(200).json({ user:userInfo });
//     }

//   } catch (error) {
//     console.error("Failed to update profile picture:", error);
//     res.status(500).json({ error: "Failed to update profile picture" });
//   }
// };


exports.updateUserProfilePicture = async (req, res) => {
  const { type, userId, field } = req.params;
  const imageData = await raw(req);

  try {
    // Fetch the user to get the existing image URL
    const user = await User.findById(userId);

    // Determine the existing image URL field
    const existingImageUrl = field === 'profileUrl' ? user.profileUrl : user.backgroundUrl;

    if (existingImageUrl) {
      const urlParts = existingImageUrl.split('/');
      const versionIndex = urlParts.findIndex(part => part.startsWith('v'));
      const publicIdWithExtension = urlParts.slice(versionIndex + 1).join('/');
      const publicId = publicIdWithExtension.split('.').slice(0, -1).join('.');
      await deleteFile(publicId);
    }

    // Upload the new image
    const result = await uploadFile(imageData, type, "userProfiles");

    // Update the user document with the new image URL
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { [field]: result.secure_url },
      { new: true }
    );

    const { password, isAdmin, ...userInfo } = updatedUser.toObject();
    res.status(200).json({ user: userInfo });

  } catch (error) {
    console.error("Failed to update profile picture:", error);
    res.status(500).json({ error: "Failed to update profile picture" });
  }
};






exports.getUsers = async (req, res) => {
  const { startIndex, limit } = req.params;
  try {
    const users = await User.find()
      .select("firstName lastName email _id isInstructor") // Specify the fields to include
      .limit(limit)
      .skip(startIndex)
      .exec();
    const totalCount = await User.countDocuments();

    res.json({ users, totalCount });
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

exports.updateUserStatement = async (req, res) => {
  const currentUser = req.body;
  const id = req.params.id;
  try {
    const user = await User.findByIdAndUpdate(
      id,
      {
        personalStatement: currentUser.personalStatement,
        origin: currentUser.origin,
      },
      { new: true }
    );
    res
      .status(200)
      .json({ personalStatement: user.personalStatement, origin: user.origin });
  } catch (error) {
    console.error("Failed to update profile picture:", error);
    res.status(500).json({ error: "Failed to update profile picture" });
  }
};

exports.updateUserAbout = async (req, res) => {
  const aboutText = req.body.about;
  const id = req.params.id;
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { about: aboutText },
      { new: true }
    );
    const { password, isAdmin, ...userInfo } = user.toObject();
    res.status(200).json({ user: userInfo });
  } catch (error) {
    console.error("Failed to update profile picture:", error);
    res.status(500).json({ error: "Failed to update profile picture" });
  }
};

exports.addNewSkill = async (req, res) => {
  const { myNewSkill, newSkillDescription } = req.body; // Extract name and description from req.body
  const userID = req.params.id; // Extract user ID from req.params

  try {
    // Find the user by ID
    const user = await User.findById(userID);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Add the new skill to the user's skills array
    user.skills.push({ skill: myNewSkill, description: newSkillDescription });
    await user.save();
    const { password, isAdmin, ...userInfo } = user.toObject();
    res.status(200).json({ user: userInfo });
  } catch (err) {
    console.error("Error adding new skill:", err);
    return res.status(500).json({
      success: false,
      message: "An error occurred while adding the skill",
    });
  }
};

exports.addExperience = async (req, res) => {
  const userID = req.params.userId;
  const work = req.params.work;

  if (work === "add") {
    try {
      const { startTime, endTime, company, role, experienceDescription } =
        req.body;
      const user = await User.findById({ _id: userID });
      if (!user) {
        res.status(400).json({ success: false, message: "User not found" });
      }
      user.experience.push({
        startTime: startTime,
        endTime: endTime,
        company: company,
        role: role,
        experienceDescription: experienceDescription,
      });
      await user.save();

      const sortedExperiences = user.experience.sort((a, b) => {
        if (a.endTime && b.endTime) {
          return new Date(b.endTime) - new Date(a.endTime);
        } else if (!a.endTime) {
          return -1;
        } else if (!b.endTime) {
          return 1;
        }
        return new Date(b.startTime) - new Date(a.startTime);
      });
      const { password, isAdmin, ...userInfo } = user.toObject();
      userInfo.experience = sortedExperiences;
      res.status(200).json({ success: true, user: userInfo });
    } catch (err) {
      console.error("Error adding new experience:", err);
      return res.status(500).json({
        success: false,
        message: "An error occurred while adding the experience",
      });
    }
  } else if (work === "update") {
    try {
      const user = await User.findByIdAndUpdate(
        userID,
        { experience: req.body },
        { new: true }
      );
      if (!user) {
        res.status(400).json({ success: false, message: "User not found" });
      }

      const sortedExperiences = user.experience.sort((a, b) => {
        if (a.endTime && b.endTime) {
          return new Date(b.endTime) - new Date(a.endTime);
        } else if (!a.endTime) {
          return -1;
        } else if (!b.endTime) {
          return 1;
        }

        return new Date(b.startTime) - new Date(a.startTime);
      });
      const { password, isAdmin, ...userInfo } = user.toObject();
      userInfo.experience = sortedExperiences;
      res.status(200).json({ success: true, user: userInfo });
    } catch (err) {
      console.error("Error adding new experience:", err);
      return res.status(500).json({
        success: false,
        message: "An error occurred while adding the experience",
      });
    }
  }
};

exports.addEducation = async (req, res) => {
  const userID = req.params.userId;
  const work = req.params.work;
  if (work === "add") {
    try {
      const education = req.body;
      const user = await User.findById({ _id: userID });
      if (!user) {
        res.status(400).json({ success: false, message: "User not found" });
      }
      user.education.push(education);
      await user.save();

      const sortedEducations = user.education.sort((a, b) => {
        if (a.endTime && b.endTime) {
          return new Date(b.endTime) - new Date(a.endTime);
        } else if (!a.endTime) {
          return -1;
        } else if (!b.endTime) {
          return 1;
        }
        return new Date(b.startTime) - new Date(a.startTime);
      });
      const { password, isAdmin, ...userInfo } = user.toObject();
      userInfo.education = sortedEducations;
      res.status(200).json({ success: true, user: userInfo });
    } catch (err) {
      console.error("Error adding new experience:", err);
      return res.status(500).json({
        success: false,
        message: "An error occurred while adding the experience",
      });
    }
  } else if (work === "update") {
    try {
      const user = await User.findByIdAndUpdate(
        userID,
        { education: req.body },
        { new: true }
      );
      if (!user) {
        res.status(400).json({ success: false, message: "User not found" });
      }

      const sortedExperiences = user.education.sort((a, b) => {
        if (a.endTime && b.endTime) {
          return new Date(b.endTime) - new Date(a.endTime);
        } else if (!a.endTime) {
          return -1;
        } else if (!b.endTime) {
          return 1;
        }

        return new Date(b.startTime) - new Date(a.startTime);
      });
      const { password, isAdmin, ...userInfo } = user.toObject();
      userInfo.education = sortedExperiences;
      res.status(200).json({ success: true, user: userInfo });
    } catch (err) {
      console.error("Error adding new experience:", err);
      return res.status(500).json({
        success: false,
        message: "An error occurred while adding the experience",
      });
    }
  }
};

exports.followUnfollow = async (req, res) => {
  try {
    const { userId, followUserId } = req.body;
    const user = await User.findById(userId);
    const followUser = await User.findById(followUserId);

    if (!user || !followUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    else if (user.following.includes(followUserId)) {
      user.following = user.following.filter(
        (id) => id.toString() !== followUserId
      );
      followUser.followers = followUser.followers.filter(
        (id) => id.toString() !== userId
      );
      await user.save();
      await followUser.save();
      res.status(200).json({ success: true, user1:followUser, user2:user});
    }
    else{
      user.following.push(followUserId);
      followUser.followers.push(userId);
      await user.save();
      await followUser.save();
      const notification = await Notification.create({
        source: userId,
        userId:followUserId,
        targetId:followUserId,
        type: "follow",
      });
      res.status(200).json({ success: true, user1:followUser, user2:user, notification });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
