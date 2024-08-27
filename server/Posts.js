const mongoose = require('mongoose');

const Posts = mongoose.Schema({
    author: {
        type: String,
        required: true
    },
    title: {
        type: String,

    },
    content: {
        type: String,
    },
    image: String,

}, {
    collection: "Posts",
})

mongoose.model('Posts', Posts);