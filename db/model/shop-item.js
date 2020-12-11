const mongoose = require('mongoose');

const ShoppingSchema = new mongoose.Schema({
            
    _userId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    isDone: {
        type: Boolean,
        required: true
    },
    productName: {
        type:String,
        required:true
    }

})

const ShoppingItem = mongoose.model('ShoppingItem', ShoppingSchema);

module.exports =  ShoppingItem ;