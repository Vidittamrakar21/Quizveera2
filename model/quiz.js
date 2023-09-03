const mongoose = require('mongoose');
const  Schema  = mongoose.Schema;


const quizschema = new Schema({
    buildq: {type: Array, default:[]},
    optionA: {type: Array, default:[]},
    optionB: {type: Array, default:[]},
    optionC: {type: Array, default:[]},
    optionD: {type: Array, default:[]},
    correct: {type: Array, default:[]},
    quizname: {type: String , required: true},
    joincode:  {type: Number, required: true},
    timer: {type: Number, required: true},
    date: {type: Date, default: Date.now }
  });

  module.exports = mongoose.model('quizzes',quizschema);