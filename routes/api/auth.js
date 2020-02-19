const express = require('express');
const router = express.Router();
const User = require('../../models/User')
const auth = require('../../middleware/auth')
const { check, validationResult } = require('express-validator')
//const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')

// @route   GET api/auth
// @desc    Test route
// @access  Public

router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password')
        res.json(user)

    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server Error')
    }
})

//login 
// @route   GET api/auth
// @desc    authenticate user and get token
// @access  Public

router.post('/', [
    check('email', 'Please enter a valid email address').isEmail(),
    check('password', 'Password is required').exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const { email, password } = req.body
    try {

        // Check if the user exits
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400)
                .json({ errors: [{ message: 'Invalid email/password' }] })
        }

        //decrypt the password in order to compare it
        //if the user exits, compare the entered password with the encrypted one.
        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400)
                .json({ errors: [{ message: 'Invalid email/password' }] })
        }
        // return jsonwebtoken
        const payload = {
            user: {
                id: user.id //id recieved from the .save promise
            }
        }
        jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 360000 },
            (error, token) => {
                if (error) throw error;
                res.json({ token })
            })
        //res.send('User registered')
    }

    catch (error) {
        console.log(error.message);
        res.status(500).send('Server error');
    }
})


module.exports = router
