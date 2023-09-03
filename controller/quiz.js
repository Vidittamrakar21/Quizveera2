const model = require('../model/quiz');
const Quiz =    model.quizes;

// exports.getquiz = async (req,res) =>{
//     try {
//         const allData = await Quiz.find(); // Retrieve all documents from the collection
//         res.json(allData);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//         res.status(500).json({ error: 'Internal server error' });
//       }
    
// }

// exports.createquiz = async (req,res)=>{
//     try {
//         const quizData = req.body; // Assuming the request body contains quiz data
//         const newQuiz = await Quiz.create(quizData);
//         res.status(201).json(newQuiz);
//       } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'An error occurred while creating the quiz.' });
//       }   


// }

// exports.changequiz = (req,res)=>{
//     res.json("QUIZ PUT request");
// }

// exports.updatequiz = (req,res)=>{
//     res.json("QUIZ PATCH request");
// }

// exports.deletequiz = (req,res)=>{
//     res.json("QUIZ DELETE request");
// }  