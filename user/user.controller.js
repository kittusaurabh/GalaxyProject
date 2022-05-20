const jwt = require('jsonwebtoken');
const Joi = require('joi');
const {
    UserModel
} = require('../model/userModel');
const {
    postModel
} = require('../model/post');
exports.login = async (req, res) => {

    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        mobile_number: Joi.string().regex(/^[0-9]{10}$/).messages({
            'string.pattern.base': `Phone number must have 10 digits.`
        }).required(),
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
        let user = await UserModel.findOneAndUpdate({
            email: req.body.email,
            mobile_number: req.body.mobile_number,
            password: req.body.password
        }, {
            access_token: token
        }, {
            new: true
        })
        if (!user) {
            return res.status(403).json({
                message: "incorrect credentials"
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
exports.upload_file = async (req, res) => {
    try {
        console.log(req);

        return res.status(200).send({
            data: {
                url: "Files/" + req.files[0].filename
            },
            message: "success"
        });
    } catch (e) {
        return res.status(400).json({
            message: e.message
        });
    }
}
exports.upload_post = async (req, res) => {
    try {
        let imageData = req.body
        imageData.user_id = req.userData._id

        let data = await postModel.create(imageData)
        return res.status(200).send({
            data: data,
            message: "success"
        });
    } catch (e) {
        return res.status(400).json({
            message: e.message
        });
    }
}

exports.update_post = async (req, res) => {
    try {
        let data = await postModel.findById(req.body.post_id)
        for (let i = 0; i < data.post.length; i++) {
            if (data.post[i]._id.toString() == req.body.post_url_id.toString()) {
                data.post[i].url = req.body.url
                data.post[i].url_type = req.body.url_type
            }
        }
        data = await postModel.findByIdAndUpdate(req.body.post_id, {
            post: data.post
        }, {
            new: true
        })

        return res.status(200).send({
            data: data,
            message: "success"
        });
    } catch (e) {
        return res.status(400).json({
            message: e.message
        });
    }
}
exports.delete_post = async (req, res) => {
    try {

        let data = await postModel.findById(req.body.post_id)
        let arr = []
        for (let i = 0; i < data.post.length; i++) {
            if (data.post[i]._id.toString() != req.body.post_url_id.toString()) {
                arr.push(data.post[i])
            }
        }
        data = await postModel.findByIdAndUpdate(req.body.post_id, {
            post: arr
        }, {
            new: true
        })

        return res.status(200).send({
            data: data,
            message: "deleted"
        });
    } catch (e) {
        return res.status(400).json({
            message: e.message
        });
    }
}
exports.get_post = async (req, res) => {
    try {

        let data = await postModel.find({
            user_id: req.userData._id
        })

        return res.status(200).send({
            data: data,
            message: "success"
        });
    } catch (e) {
        return res.status(400).json({
            message: e.message
        });
    }
}