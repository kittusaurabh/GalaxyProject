const express = require('express');
const router = express.Router();
const userControler = require('./user.controller');
const auth = require('../middleware')
var multer = require('multer');
var path = require('path');
const md5 = require('md5')

let storage = multer.diskStorage({
    destination: function (req, file, callback) {
        console.log("multer")
        callback(null, './Uploads/Files');
    },
    filename: function (req, file, callback) {
        let fileUniqueName = md5(Date.now());
        callback(null, fileUniqueName + path.extname(file.originalname));
    }
});
let upload = multer({
    storage: storage
});



router.post("/login", userControler.login)
router.post('/upload_file', upload.any(), userControler.upload_file)
router.post('/upload_post', auth.verifyToken, userControler.upload_post)
router.post('/update_post', auth.verifyToken, userControler.update_post)
router.post('/delete_post', auth.verifyToken, userControler.delete_post)
router.get('/get_post', auth.verifyToken, userControler.get_post)





exports.Router = router;