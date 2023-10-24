const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const admin = require('firebase-admin')


module.exports = {
    createUser: async (req, res) => {
        const user = req.body;

        try {
            await admin.auth().getUserByEmail(user.email);

            res.status(400).json({ message: 'Email is already registered.' });
        } catch (error) {

            if (error.code === 'auth/user-not-found') {
                try {
                    const userResponse = await admin.auth().createUser({
                        email: user.email,
                        password: user.password,
                        emailVerified: false,
                        disabled: false,
                    });

                    console.log(userResponse.uid);

                    const newUser = new User({
                        username: req.body.username,
                        email: req.body.email,
                        userType: 'Client',
                        uid: userResponse.uid,
                        password: CryptoJS.AES.encrypt(req.body.password, process.env.SECRET).toString(),
                    });

                    await newUser.save();

                    res.status(201).json({ status: true })
                } catch (createUserError) {
                    res.status(500).json({ error: 'An error occurred while creating the user.' });
                }
            }

        }
    },

    loginUser: async (req, res) => {
        try {
            const user = await User.findOne({ email: req.body.email }, { __v: 0, createdAt: 0, updatedAt: 0, skills: 0, email: 0});
            !user && res.status(401).json("Wrong Login Details")


            const decrytedpass = CryptoJS.AES.decrypt(user.password, process.env.SECRET);
            const depassword = decrytedpass.toString(CryptoJS.enc.Utf8);

            depassword !== req.body.password && res.status(401).json("Wrong Login Details");

            const userToken = jwt.sign({
                id: user._id, userType: user.userType, email: user.email
            }, process.env.JWT_SEC,
                { expiresIn: "21d" });


            const { password, ...others } = user._doc;

            res.status(200).json({ ...others, userToken });

        } catch (error) {
            res.status(500)
        }
    }
}