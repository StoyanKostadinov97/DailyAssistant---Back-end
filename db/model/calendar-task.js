const mongoose = require('mongoose');

const CalendarTaskSchema = new mongoose.Schema({

    _userId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    },
    description: {
        type: String,
        // required:true
    }

})

const CalendarTask = mongoose.model('CalendarTask', CalendarTaskSchema);

module.exports = CalendarTask;