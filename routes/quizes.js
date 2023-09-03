const express = require('express');
const quizrouter = express.Router();
const quizcontrol = require('../controller/quiz');


quizrouter
// .get('/' , async (req,res)=>{
//     try {
//         const allData = await Quiz.find(); // Retrieve all documents from the collection
//         res.json(allData);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//         res.status(500).json({ error: 'Internal server error' });
//       }
// })

// .post('/', quizcontrol.createquiz)

// .put('/', quizcontrol.changequiz)

// .patch('/',quizcontrol.updatequiz)

// .delete('/', quizcontrol.deletequiz);

exports.router = quizrouter;