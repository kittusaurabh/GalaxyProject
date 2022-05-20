var mongoose = require('mongoose')
let postSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    post: [{
        url: String,
        url_type: String
    }]
}, {
    timestamps: true
});

exports.postModel = mongoose.model("post", postSchema);