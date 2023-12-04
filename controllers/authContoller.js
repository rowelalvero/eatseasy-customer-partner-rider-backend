const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const admin = require('firebase-admin')
const nodemailer = require('nodemailer');

module.exports = {
    createUser: async (req, res) => {
        const user = req.body;

        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailRegex.test(req.body.email)) {
            return res.status(400).json({ status: false, message: "Invalid email format" });
        }

        // Validate password length
        const minPasswordLength = 8; // You can adjust the minimum length
        if (req.body.password.length < minPasswordLength) {
            return res.status(400).json({ status: false, message: "Password should be at least " + minPasswordLength + " characters long" });
        }

        try {
            // Check if email already exists
            const emailExist = await User.findOne({ email: req.body.email });
            if (emailExist) {
                return res.status(400).json({ status: false, message: "Email already exists" });
            }

            const newUser = new User({
                username: req.body.username,
                email: req.body.email,
                userType: 'Client',
                uid: CryptoJS.AES.encrypt(req.body.email, process.env.SECRET).toString(),
                password: CryptoJS.AES.encrypt(req.body.password, process.env.SECRET).toString(),
            });

            await newUser.save();

            res.status(201).json({ status: true, message: 'User created successfully' })
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    },

    loginUser: async (req, res) => {

        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailRegex.test(req.body.email)) {
            return res.status(400).json({ status: false, message: "Invalid email format" });
        }

        // Validate password length
        const minPasswordLength = 8; // You can adjust the minimum length
        if (req.body.password.length < minPasswordLength) {
            return res.status(400).json({ status: false, message: "Password should be at least " + minPasswordLength + " characters long" });
        }

        try {
            const user = await User.findOne({ email: req.body.email }, { __v: 0, createdAt: 0, updatedAt: 0 });
            if (!user) {
                return res.status(401).json({ status: false, message: "User not found, check your email address" })
            }


            const decrytedpass = CryptoJS.AES.decrypt(user.password, process.env.SECRET);
            const depassword = decrytedpass.toString(CryptoJS.enc.Utf8);

            if (depassword !== req.body.password) {
                return res.status(401).json({ status: false, message: "Wrong password" })
            }

            const userToken = jwt.sign({
                id: user._id, userType: user.userType, email: user.email
            }, process.env.JWT_SEC,
                { expiresIn: "21d" });


            const { password, ...others } = user._doc;

            res.status(200).json({ ...others, userToken });

        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    },


}

const verifyEmail = () => {
    let transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    })

    function generateRandomNumber() {
        return Math.floor(Math.random() * (10000000 - 1000000) + 1000000);
    }

    sendVerificationEmail = ({ _id, email }, res) => {
        const currentUrl = 'https://localhost:6003/';



        const token = jwt.sign({ _id }, process.env.JWT_ACC_ACTIVATE, { expiresIn: '12hours' });

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Account Activation Link',
            html: `
            <p>Please click on given link to verify your account</p>
            <p>This link <b>expires in 12 hours</b>.</p>
            <p>Please click on the following link to complete your activation: <a href="${currentUrl}/auth/activate/${_id}/${generateRandomNumber()}">Click Here</a></p>
            
            `
        }
    }
};