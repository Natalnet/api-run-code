const route = require('express').Router()
const SubmissionController = require('./src/controllers/submissionController')

route.post('/',SubmissionController.test);

module.exports = (app) => app.use(route)
