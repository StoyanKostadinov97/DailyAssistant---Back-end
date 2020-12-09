const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
            
    _userId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    from: {
        type: String,
        required: true
    },
    about: {
        type:String,
        required:true
    }

})

const BudgetItem = mongoose.model('BudgetItem', BudgetSchema);

module.exports =  BudgetItem ;