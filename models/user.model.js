const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema(
  {
    skill: {
      type: String,
      default: "",
      required: false,
    },
    description: {
      type: String,
      default: "",
      required: false,
    },
  },
  { _id: false }
);

const educationSchema = new mongoose.Schema(
  {
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      default: "",
      required: false,
    },
    school: {
      type: String,
      default: "",
      required: false,
    },
    degree: {
      type: String,
      default: "",
      required: false,
    },
    schoolDescription: {
      type: String,
      default: "",
      required: false,
    },
  },
  { _id: false }
);

const experienceSchema = new mongoose.Schema(
  {
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: false,
    },
    company: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    experienceDescription: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First name is required"],
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: [true, "Email already exists"],
  },
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: [true, "Username already exists"],
  },
  phoneNumber: {
    type: String,
    required: [true, "Phone number is required"],
    unique: [true, "Phone number already exists"],
  },
  school: {
    type: String,
    required: [true, "School is required"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  followers: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
    ref: "User",
  },
  following: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
    ref: "User",
  },
  personalStatement: {
    type: String,
    default: "",
    required: false,
  },
  origin: {
    type: String,
    default: "",
    required: false,
  },
  about: {
    type: String,
    default: "",
    required: false,
  },
  skills: {
    type: [skillSchema],
    default: [], // Correct array default
  },
  experience: {
    type: [experienceSchema],
    default: [], // Correct array default
  },
  education: {
    type: [educationSchema],
    default: [], // Correct array default
  },
  verified: {
    type: Boolean,
    required: true,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
  isInstructor: {
    type: Boolean,
    required: true,
    default: false,
  },
  profileUrl: {
    type: String,
    default:
      "",
  },
  backgroundUrl: {
    type: String,
    default:
      "",
  },
  token: {
    type: String,
    default: "",
    required: true,
  },
},{ timestamps: true });

userSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoError" && error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    let message = "";
    switch (field) {
      case "email":
        message = "Email already exists";
        break;
      case "username":
        message = "Username already exists";
        break;
      case "phoneNumber":
        message = "Phone number already exists";
        break;
      default:
        message = "Duplicate field value";
    }
    next(new Error(message));
  } else {
    next(error);
  }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
