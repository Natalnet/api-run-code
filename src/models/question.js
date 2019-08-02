const mongoose = require('mongoose')

const QuestionSchema = mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true,

    },
    description:{
        type:String,
        required:true,
        unique:true,

    },
    results: {
        type: [{
            inputs: {type: [{ type: String }]},
            output: {type: String}
        }],
        required:true
    }
})
module.exports = mongoose.model('Question',QuestionSchema)