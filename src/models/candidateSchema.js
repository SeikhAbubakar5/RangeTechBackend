const mongoose = require("mongoose");

const CandidateSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true,
     unique: true
     },
  avatar: { 
    type: String 
  },
  experience: { 
    type: Number 
  },
  skills: {
     type: [String] 
    },
  location: {
     type: String 
    },
  preferredJobRoles: {
     type: [String] 
    },
  linkedinProfile: {
     type: String 
    },
}, { timestamps: true });

const Candidate = mongoose.model("Candidate", CandidateSchema);
module.exports = Candidate;
