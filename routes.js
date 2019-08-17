const route = require('express').Router()
const SubmissionController = require('./src/controllers/submissionController')

route.post('/submission/exec',SubmissionController.exec);

module.exports = (app) => app.use(route)
