const jwt = require('jsonwebtoken');
const md5 = require('md5');
const Joi = require('joi');

const {
    AdminModel
} = require('../model/adminModel');
const {
    UserModel
} = require('../model/userModel');

let crypto = require("crypto");

exports.login = async (req, res) => {

    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    });

    const options = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: true // remove unknown props
    };

    // validate request body against schema
    const {
        error,
        value
    } = schema.validate(req.body, options);

    if (error) {
        return res.status(400).json({
            message: `Validation error: ${error.details[0].message}`
        });
    }

    try {
        let token = jwt.sign({
            email: req.body.email
        }, 'supersecret');

        let user = await AdminModel.findOneAndUpdate({
            email: req.body.email,
            password: md5(req.body.password)
        }, {
            access_token: token,
        }, {
            new: true
        })
        if (!user) {
            return res.status(403).json({
                message: "Incorrect email or password"
            });
        }

        return res.status(200).json({
            data: user,
            message: "Successfully logged in"
        });
    } catch (e) {
        return res.status(400).json({
            message: e.message
        });
    }
}


exports.create_user = async (req, res) => {

    const schema = Joi.object({
        email: Joi.string().email().required(),
        mobile_number: Joi.string().regex(/^[0-9]{10}$/).messages({
            'string.pattern.base': `Phone number must have 10 digits.`
        }).required(),
        user_name: Joi.string().regex(/^[a-zA-Z]{4,25}$/).required(),
    });

    const options = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: true // remove unknown props
    };

    // validate request body against schema
    const {
        error,
        value
    } = schema.validate(req.body, options);

    if (error) {
        return res.status(400).json({
            message: `Validation error: ${error.details[0].message}`
        });
    }

    try {

        let user = await UserModel.findOne({
            mobile_number: req.body.mobile_number,
        })
        if (user) {
            return res.status(403).json({
                message: "Mobile Number Already Exist"
            });
        }
        req.body.password = crypto.randomBytes(6).toString('hex');
        let data = await UserModel.create(req.body)

        return res.status(200).json({
            data: data,
            message: "Successfully logged in"
        });
    } catch (e) {
        return res.status(400).json({
            message: e.message
        });
    }
}

exports.update_user = async (req, res) => {

    const schema = Joi.object({
        email: Joi.string().email().optional(),
        mobile_number: Joi.string().regex(/^[0-9]{10}$/).messages({
            'string.pattern.base': `Phone number must have 10 digits.`
        }).optional(),
        user_name: Joi.string().regex(/^[a-zA-Z]{4,25}$/).optional(),
    });

    const options = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: true // remove unknown props
    };

    // validate request body against schema
    const {
        error,
        value
    } = schema.validate(req.body, options);

    if (error) {
        return res.status(400).json({
            message: `Validation error: ${error.details[0].message}`
        });
    }

    try {

        let user = await UserModel.findByIdAndUpdate(req.body._id, req.body, {
            new: true
        })

        return res.status(200).json({
            data: user,
            message: "Success"
        });
    } catch (e) {
        return res.status(400).json({
            message: e.message
        });
    }
}

exports.delete_user = async (req, res) => {

    try {

        let user = await UserModel.findByIdAndDelete(req.body._id)

        return res.status(200).json({
            data: user,
            message: "Success"
        });
    } catch (e) {
        return res.status(400).json({
            message: e.message
        });
    }
}

exports.get_user_list = async (req, res) => {
    try {

        let user = await UserModel.find()
        return res.status(200).json({
            data: user,
            message: "Success"
        });
    } catch (e) {
        return res.status(400).json({
            message: e.message
        });
    }
}