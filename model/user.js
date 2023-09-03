const mongoose = require('mongoose');
const  Schema  = mongoose.Schema;


const userschema = new Schema({
    email: {type: String},
    password: {type: String},
    username: {type: String},
    qgiven:[{joincode: String,
        score: Number,
        name: String
    }],
    qbuild: [{joincode: Number, name: String , date:{type: Date, default: Date.now}}],
    token: {type:String},
    date: {type: Date, default: Date.now }
  });

  module.exports = mongoose.model('Users',userschema);