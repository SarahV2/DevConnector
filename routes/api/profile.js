const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')
const Profile = require('../../models/Profile')
const User = require('../../models/User')
const {check,validationResult}=require('express-validator')

// @route   GET api/profile/me
// @desc    Get current users profile
// @access  Private 

router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id })
        .populate('user', ['name', 'avatar'])
        if (!profile) {
            return res.status(400).json({ message: 'There is no profile for this user' })
        }
        res.json(profile) //if a profile was found, return it.
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server Error')

    }
})

// @route   POST api/profile
// @desc    Create/Update user profile
// @access  Private 

router.post('/', [auth,[
    check('status','Status is required').not().isEmpty(),
    check('skills','Skills are required').not().isEmpty()
]], async (req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty){ //if there're errors
    return res.status(400).json({errors: errors.array()})

    }
})




module.exports = router