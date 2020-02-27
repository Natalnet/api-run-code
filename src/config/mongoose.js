const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true)
mongoose.connect('mongodb+srv://plataforma_lop:plataforma_lop@cluster0-g5kgj.mongodb.net/api-run-code?retryWrites=true&w=majority', {useNewUrlParser: true});
mongoose.Promise = global.Promise;

module.exports = mongoose;