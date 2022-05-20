const express = require('express');
const userRouter = require('./user/userRouter').Router;
const adminRouter = require('./admin/admin.router').Router;
const app = express();
const path = require("path");
const port = 5000;
const conn = require('./database/conn');
app.use(express.json());
app.use(express.static(path.join(__dirname, './Uploads')));
app.use('/user', userRouter)
app.use('/admin', adminRouter)


app.listen(port, () => {
    console.log('app listening on port:::', port);
})