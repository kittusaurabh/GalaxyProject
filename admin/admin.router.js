const express = require('express');
const router = express.Router();
const adminControler = require('./admin.controller');
const auth = require('../middleware')

router.post("/login", adminControler.login)
router.post("/create_user", auth.adminVerifyToken, adminControler.create_user)
router.post("/update_user", auth.adminVerifyToken, adminControler.update_user)
router.post("/delete_user", auth.adminVerifyToken, adminControler.delete_user)
router.get("/get_user_list", auth.adminVerifyToken, adminControler.get_user_list)




exports.Router = router;