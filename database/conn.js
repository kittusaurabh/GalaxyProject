const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/galaxyData', {

}).then(() => {
    console.log("Connection is set.")
}).catch((err) => {
    console.log("Connection Failed")
})