const Question = require('../models/question')

class QuestionController{
	async get_all_questions(req,res){
		const questions = await Question.find()
		return res.status(200).json(questions)
	}
	async get_question(req,res){
		const id = req.params.id
		try{
			let question = await Question.findById(id)
			console.log(question)
			let q={
    			_id         : question._id,
    			title       : question.title,
    			description : question.description,
    			results     : []
			}
			let output = ''
			let inputs = ''
			// remove o ultimo caractere especial '\n' (só para melhorar a apresentação no browser)
			for (let i = 0; i < question.results.length; i++) {
				output = question.results[i].output[question.results[i].output.length-1]==='\n'?question.results[i].output.slice(0,-1):question.results[i].output
				inputs = question.results[i].inputs[question.results[i].inputs.length-1]==='\n'?question.results[i].inputs.slice(0,-1):question.results[i].inputs
    			q.results.push({
    				inputs:inputs,
    				output:output
    			})

			}
			console.log(q)
			return res.status(200).json(q)
		}
		catch(err){
			console.log(Object.getOwnPropertyDescriptors(err));
			return res.status(500).json({err:'err'})
		}
	}
	async store(req,res){
		
		try{
			const {title,description,results} = req.body
			const question = await Question.create({title,description,results})
			console.log(question);
			return res.status(200).json(question)
		}
		catch(err){
			console.log(Object.getOwnPropertyDescriptors(err));
			return res.status(500).json({err:'err'})
		}
	}
}
module.exports = new QuestionController