const User = require("../models/user.model");
const Session = require("../models/session.model");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const Notification = require("../models/notification.model");
const MAX_FAILED_LOGIN_ATTEMPTS = 3;
const LOCK_TIME = 5 * 60 * 1000; // 5 minutes

exports.getUserByEmail = async (req, res) => {
  const { password } = req.body;
  try {
    const user = req.user;
    const session = req.session;

    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!user.verified) {
        res.status(200).json({ verified: false });
      } else if (!isPasswordValid) {
        await handleFailedLogin(user._id, session.ip);
        res.status(200).json({ password: "Invalid password" });
      } else {
        await handleSuccessfulLogin(session);
        const { password: userPassword, ...userInfo } = user.toObject();
        res.status(200).json({ user: userInfo });
      }
    }
  } catch (err) {
    console.error("Error in loginUser: ", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const handleSuccessfulLogin = async (session) => {
  if (session) {
    session.isLocked = false;
    session.lockUntil = null;
    session.createdAt = Date.now();
    session.failedLoginAttempts = 0;
    await session.save();
  }
};

const handleFailedLogin = async (userId, ip) => {
  const session = await Session.findOne({ userId, ip });
  session.failedLoginAttempts += 1;

  if (session.failedLoginAttempts >= MAX_FAILED_LOGIN_ATTEMPTS) {
    session.isLocked = true;
    session.lockUntil = Date.now() + LOCK_TIME;
  }
  await session.save();
};

exports.getUserById = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message }); // Use "error" for consistency
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message }); // Use "error" for consistency
  }
};

exports.getUserDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (user) {
      const { password, isAdmin, isInstructor, verified, token, ...userInfo } =
        user.toObject();
      res.status(200).json({ user: userInfo });
    } else if (!user) {
      res.status(400).json({ success: false });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
};

exports.getUsersToFollow = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId)
      .populate({
        path: "followers",
        select: "_id",
        populate: { path: "followers following", select: "_id" },
      })
      .populate({
        path: "following",
        select: "_id",
        populate: { path: "followers following", select: "_id" },
      })
      .exec();

    if (!user) {
      throw new Error("User not found");
    }

    // Collect all the followers and following of the user's followers and following
    const allExtendedUsers = new Set();

    user.following.forEach((followingUser) => {
      followingUser.followers.forEach((follower) =>
        allExtendedUsers.add(follower._id.toString())
      );
      followingUser.following.forEach((following) =>
        allExtendedUsers.add(following._id.toString())
      );
    });

    user.followers.forEach((followerUser) => {
      followerUser.followers.forEach((follower) =>
        allExtendedUsers.add(follower._id.toString())
      );
      followerUser.following.forEach((following) =>
        allExtendedUsers.add(following._id.toString())
      );
    });

    // Filter out users already being followed by the current user and the user itself
    const followingIds = user.following.map((followingUser) =>
      followingUser._id.toString()
    );
    const userIdStr = userId.toString();
    const filteredExtendedUsers = Array.from(allExtendedUsers).filter(
      (extendedUserId) =>
        !followingIds.includes(extendedUserId) && extendedUserId !== userIdStr
    );

    // Fetch the user details for the filtered user IDs
    let userDetails = await User.find(
      {
        _id: { $in: filteredExtendedUsers },
      },
      "_id firstName lastName username profileUrl"
    );

    // If userDetails length is less than 8, fetch random users
    if (userDetails.length < 8) {
      const neededUsersCount = 8 - userDetails.length;
      const excludedIds = [
        ...followingIds.map((id) => new mongoose.Types.ObjectId(id)),
        new mongoose.Types.ObjectId(userId),
        ...userDetails.map((user) => new mongoose.Types.ObjectId(user._id)),
      ];
      const additionalUsers = await User.aggregate([
        {
          $match: {
            _id: {
              $nin: excludedIds.map((id) => new mongoose.Types.ObjectId(id)),
            },
          },
        },
        { $sample: { size: neededUsersCount } },
        {
          $project: {
            _id: 1,
            firstName: 1,
            lastName: 1,
            username: 1,
            profileUrl: 1,
          },
        },
      ]);
      userDetails = userDetails.concat(additionalUsers);
      res.status(200).json({ users: userDetails });
    }

    // Return the first 8 users
    return userDetails.slice(0, 8);
  } catch (error) {
    console.error("Error fetching extended following info:", error);
    throw error;
  }
};


exports.logoutUser = async (req, res) => {
  try {
    await Session.deleteMany({ userId: req.params.userId });
    res.cookie(process.env.TOKEN_NAME, "", { maxAge: 0 });
    res.status(200).json({ success: true, message: "User logged out as fuck" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUnreadNotifications = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId).select("_id").exec();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const notifications = await Notification.find({
      userId: userId,
      isRead: false,
    })
      .sort({ createdAt: -1 })
      .exec();
    res.status(200).json({ notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.fetchNotifications = async (req, res) => {
  try {
    const notifIds = req.query.notificationIds;
    let ids = notifIds ? notifIds.split(",") : [];
    let allNotifications = [];
    const notifications = await Notification.find({ _id: { $in: ids } })
      .sort({ createdAt: -1 })
      .populate({
        path: "source",
        select: "_id firstName lastName username profileUrl",
      })
      .exec();

    allNotifications.push(...notifications);
    if (allNotifications.length < 10) {
      const newNotifications = await Notification.find({ _id: { $nin: ids } })
        .sort({ createdAt: -1 })
        .populate({
          path: "source",
          select: "_id firstName lastName username profileUrl",
        })
        .limit(10 - allNotifications.length)
        .exec();
      allNotifications.push(...newNotifications);
    }

    if (allNotifications.length < 10) {
      const newNotifications = await Notification.find({
        userId: { $in: [new mongoose.Types.ObjectId(req.params.userId)] },
      })
        .sort({ createdAt: -1 })
        .populate({
          path: "source",
          select: "_id firstName lastName username profileUrl",
        })
        .limit(10 - allNotifications.length)
        .exec();
      allNotifications.push(...newNotifications);
    }
    const uniqueNotifications = [
      ...new Set(allNotifications.map((notification) => notification.id)),
    ].map((id) =>
      allNotifications.find((notification) => notification.id === id)
    );
    res.status(200).json({ notifications: uniqueNotifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.markNotificationsAsRead = async (req, res) => {
  try {
    const { ids } = req.body;
    await Notification.updateMany(
      { _id: { $in: ids } },
      { $set: { isRead: true } }
    );
    res
      .status(200)
      .json({ success: true, message: "Notifications marked as read" });
  } catch (error) {
    res.status(500).json({ error: "Failed to mark notifications as read" });
  }
};
