const mongoose = require('mongoose');
const User = require('./user.model'); 
const opportunitySchema = new mongoose.Schema({
  posterID: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
    ref: 'User'
  },
  title: {
    type: String
  },
  description: {
    type: String
  },
  postingTime: {
    type: Date,
    default: Date.now    
  },
  deadline: {
    type: Date, 
    required:[true, 'The opportunity should have a deadline']
  },
  likes: {
    type: Number, 
    default: 0     
  },
  pay: {
    type: Number
  },
  application_link:{
    type: String, 
    required: [true, 'You should add a link to the application form']
  }
}, { timestamps: true })
module.exports = mongoose.model('Opportunity', opportunitySchema);