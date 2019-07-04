const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const user_todo = new Schema({
    _id: String,
    name: String,
    email: String,
    pwd: String,
    user_todo: [{
        todo_id: String,
        todo_name: String,
        old_todo: Number,
        time_stamp: String
    }]
},
{
    collection: 'todo'
});

module.exports = mongoose.model('todo', user_todo);