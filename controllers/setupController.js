var Users = require('../models/tdocModel');

module.exports = function(app){
    app.get('/data', function(req, res){
       
        var starterUser = {
            local            :{
                email        : 'Bob@yahoo.com',
                password     : 'password1',
                //    videoPurchased: String
            },
            google           : {
                id           : '',
                token        : '',
                email        : '',
                name         : ''
            }     
        };
        
        Users.create(starterUser, function(err, results){
            res.send(results);
        });
        
    });
    
    
}