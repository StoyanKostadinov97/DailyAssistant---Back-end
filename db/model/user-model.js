
const bcrypt=require('bcrypt');
const mongoose=require('mongoose');

const UserSchema = new mongoose.Schema({
   
    email: {
        type: String,
        required: true,
        unique: true
        // index:true
    },
    username:{
        type:String,
        required:true
    },
    password: {
        type: String,
        required: true,
    }

});

UserSchema.methods = {
    comparePasswords(password){
        return bcrypt.compare(password, this.password);
    }
}; 

UserSchema.pre('save', function (next) {

    if (!this.isModified('password')) {
        next();
        return;
    }

    bcrypt.genSalt(11, (err, salt) => {
        if (err) {
            next(err);
            return;
        }
        bcrypt.hash(this.password, salt, (err, hash) => {
            if (err) {
                next(err);
                return;
            }
            this.password = hash;
            next();
        })
    })
});

const User = mongoose.model('User', UserSchema);

module.exports =  User ;



