const { check, validationResult } = require('express-validator')
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const express = require('express');
const router = express.Router();
const User = require('../../models/User')

// @route   GET api/users
// @desc    Register User
// @access  Public

router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please enter a valid email address').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({
        min: 6
    })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const { name, email, password } = req.body
    try {

        // Check if the user exits
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ errors: [{ message: 'User already exists' }] })
        }

        //get user's gravatar
        const avatar = gravatar.url(email, { s: '200', r: 'pg', d: 'mm' }) //d: default

        //crete user object
        user = new User({ name, email, password, avatar });

        // encrypt password
        const salt = await bcrypt.genSalt(10); //recommended: 10, the greater number the more secure
        user.password = await bcrypt.hash(password, salt)
        await user.save()

        // return jsonwebtoken
        const payload = {
            user: {
                id: user.id //id recieved from the .save promise
            }
        }
        jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 360000 }, 
        (error,token)=>{if (error) throw error;
        res.json({token})})
        //res.send('User registered')
    }

    catch (error) {
        console.log(error.message);
        res.status(500).send('Server error');
    }
})

module.exports = router