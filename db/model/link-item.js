const mongoose = require('mongoose');

const LinkSchema = new mongoose.Schema({
            
    _userId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    description: {
        type: String,
        // required: true
    },
    views: {
        type:Number,
        required:true
    }

})

const LinkItem = mongoose.model('LinkItem', LinkSchema);

module.exports =  LinkItem ;