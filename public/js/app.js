angular.module('TennisApp', []);

angular.module('TennisApp').controller('MainController', ctrlFunc);

function ctrlFunc(){
    this.message = 'Hello World';
}