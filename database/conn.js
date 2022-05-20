const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://saurabh:saurabh@cluster0.ka9ng.mongodb.net/?retryWrites=true&w=majority', {

}).then(() => {
    console.log("Connection is set.")
}).catch((err) => {
    console.log("Connection Failed")
})