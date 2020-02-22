const express = require('express');
const router = express.Router();
const Post=require('../../models/Post')
const User=require('../../models/User')
const Profile=require('../../models/Profile')
const auth=require('../../middleware/auth')
const {check,validationResult}=require('express-validator')

// @route   POST api/posts
// @desc    Create a post
// @access  Private

router.post('/', [auth,
    check('text','text is required').not().isEmpty()] ,
    async(req, res) => {
        const errors=validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()})
        }
        try {
            const user=await User.findById(req.user.id).select('-password')
            const newPost= new Post({
                text:req.body.text,
                name: user.name,
                avatar: user.avatar,
                user:req.user.id
            })
            const post=await newPost.save();
            res.json(post)
            
        } catch (error) {
            console.error(error)
            res.status(500).json({message:'Server Error'})
        }  
})

// @route   GET api/posts
// @desc    Get all posts
// @access  Private

router.get('/', auth, async(req,res)=>{
    try {
        const posts=await Post.find().sort({date:-1}) //most recent posts first
        res.json(posts)
    } catch (error) {
        console.error(error)
        res.status(500).json({message:'Server Error'})
    }
})

// @route   GET api/posts/post_id
// @desc    Get a specific post using its ID
// @access  Private

router.get('/:post_id', auth, async(req,res)=>{
    try {
        const post=await Post.findById(req.params.post_id)
        if(!post){
            return res.status(404).json({message:'Post not found'})
        }
        res.json(post)
    } catch (error) {
        console.error(error)
        if(error.kind==='ObjectId'){
            return res.status(404).json({message:'Post not found'})
        }
        res.status(500).json({message:'Server Error'})
    }
})

// @route   DELETE api/posts/post_id
// @desc    Delete a specific post using its ID
// @access  Private

router.delete('/:post_id', auth, async(req,res)=>{
    try {
       const post= await Post.findById(req.params.post_id)

       if(!post){
        return res.status(404).json({message:'Post not found'})
    }

       if(post.user.toString()!==req.user.id){
           return res.status(401).json({message:'Not Authorized'})
       }

       await post.remove()
        res.json("Post Removed")
    } catch (error) {
        console.error(error)
        if(error.kind==='ObjectId'){
            return res.status(404).json({message:'Post not found'})
        }
        res.status(500).json({message:'Server Error'})
    }
})

// @route   PUT api/posts/like/post_id
// @desc    Like a specific post using its ID
// @access  Private

router.put('/like/:post_id',auth,async(req,res)=>{
    try {
        const post=await Post.findById(req.params.post_id)

        // Check if the current user has already liked this post
        if(post.likes.filter(like=>like.user.toString()===req.user.id).length>0){ //there's a like from that user
            return res.status(400).json({message:'Post Already Liked'})
        }
        post.likes.unshift({user:req.user.id})
        await post.save()
        res.json(post.likes);

    } catch (error) {
        console.error(error)
        res.status(500).json({message:'Server Error'})
        
    }
})

// @route   PUT api/posts/unlike/post_id
// @desc    Unlike a specific post using its ID
// @access  Private

router.put('/unlike/:post_id',auth,async(req,res)=>{
    try {
        const post=await Post.findById(req.params.post_id)

        // Check if the current user has already liked this post
        if(post.likes.filter(like=>like.user.toString()===req.user.id).length===0){ //there's no like from that user
            return res.status(400).json({message:'Post has not yet been liked'})
        }

        //Get remove index
        const removeIndex=post.likes.map(like=>like.user.toString()).indexOf(req.user.id)
       
        post.likes.splice(removeIndex,1)

        await post.save()
        res.json(post.likes);

    } catch (error) {
        console.error(error)
        res.status(500).json({message:'Server Error'})
        
    }
})

// @route   POST api/posts/comment/:post_id
// @desc    Comment on a post
// @access  Private

router.post('/comment/:post_id', [auth,
    check('text','text is required').not().isEmpty()] ,
    async(req, res) => {
        const errors=validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()})
        }
        try {
            const user=await User.findById(req.user.id).select('-password')
            const post=await Post.findById(req.params.post_id)

            const newComment= new Post({
                text:req.body.text,
                name: user.name,
                avatar: user.avatar,
                user:req.user.id
            })

            post.comments.unshift(newComment) //unshift adds it to the beginning of the array

            await post.save();

            res.json(post.comments)
            
        } catch (error) {
            console.error(error)
            res.status(500).json({message:'Server Error'})
        }  
})

// @route   DELETE api/posts/comment/:post_id/comment_id
// @desc    Delete a comment
// @access  Private

router.delete('/comment/:post_id/:comment_id',auth,async(req,res)=>{
    try {
        const post=await Post.findById(req.params.post_id)
        const comment=await post.comments.find(comment=>comment.id===req.params.comment_id)

        //Check if comment exists
        if(!comment){
            return res.status(404).json({message:'Comment does not exists'})
        }
        
        //Check comment author
        if(comment.user.toString()!==req.user.id){
            return res.status(401).json({message:'User is not authorized'})
        }
        
         //Get remove index
         const removeIndex=post.comments.map(comment=>comment.user.toString()).indexOf(req.user.id)
       
         post.comments.splice(removeIndex,1)
 
         await post.save()

         res.json(post.comments);

    } catch (error) {
        console.error(error)
        res.status(500).json({message:'Server Error'})
    }
})


module.exports=router