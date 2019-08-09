const route = require('express').Router()
const SubmissionController = require('./src/controllers/submissionController')
const QuestionController = require('./src/controllers/questionController')

route.post('/submission/test',SubmissionController.test);
route.post('/submission/:id',SubmissionController.exec);

route.post('/question/store',QuestionController.store);
route.get('/question',QuestionController.get_all_questions);
route.get('/question/:id',QuestionController.get_question);

module.exports = (app) => app.use(route)
