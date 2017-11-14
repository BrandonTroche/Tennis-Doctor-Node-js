var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var Schema = mongoose.Schema;

var tdocSchema = Schema ({
    local            :{
        email        : String,
        password     : String,
        picture      : String
    },
      facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String,
        picture      : String
    }
});

tdocSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

tdocSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

var Users = mongoose.model('Users', tdocSchema);

module.exports = Users;