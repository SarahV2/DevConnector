import axios from 'axios'
import {setAlert} from './alert'
import {GET_POSTS, GET_POST, ADD_COMMENT,REMOVE_COMMENT, POST_ERROR, UPDATE_LIKES,DELETE_POST,ADD_POST} from './types'

// Get posts
export const getPosts=()=>
    async dispatch=>{
        try{
            const res=await axios.get('/api/posts')
            dispatch({
                type:GET_POSTS,
                payload: res.data
            })
        }
        catch(error){
            dispatch({
                type: POST_ERROR,
                payload: { message: error.response.statusText, status: error.response.status }
            })
        }
    }

// Get post
export const getPost=postID=>
async dispatch=>{
    try{
        const res=await axios.get(`/api/posts/${postID}`)
        dispatch({
            type:GET_POST,
            payload: res.data
        })
    }
    catch(error){
        dispatch({
            type: POST_ERROR,
            payload: { message: error.response.statusText, status: error.response.status }
        })
    }
}


// Add like
export const addLike=postID=>
async dispatch=>{
    try{
        const res=await axios.put(`/api/posts/like/${postID}`)
        dispatch({
            type:UPDATE_LIKES,
            payload: {postID,likes:res.data}
            
        })
    }
    catch(error){
        dispatch({
            type: POST_ERROR,
            payload: { message: error.response.statusText, status: error.response.status }
        })
    }
}

// Remove Like
export const removeLike=postID=>
async dispatch=>{
    try{
        const res=await axios.put(`/api/posts/unlike/${postID}`)
        dispatch({
            type:UPDATE_LIKES,
            payload: {postID,likes:res.data}
        })
    }
    catch(error){
        dispatch({
            type: POST_ERROR,
            payload: { message: error.response.statusText, status: error.response.status }
        })
    }
}

// Delete Post
export const deletePost=postID=>
async dispatch=>{
    try{
        const res=await axios.delete(`/api/posts/${postID}`)
        dispatch({
            type:DELETE_POST,
            payload: postID
        })
        dispatch(setAlert('Post Removed','success'))
    }
    catch(error){
        dispatch({
            type: POST_ERROR,
            payload: { message: error.response.statusText, status: error.response.status }
        })
    }
}

// Add Post
export const addPost=formData=>async dispatch=>{
    const config={
        headers:{
            'Content-Type': 'application/json'
        }
    }
    try{
        const res=await axios.post(`/api/posts/`,formData,config)
        dispatch({
            type:ADD_POST,
            payload: res.data
        })
        dispatch(setAlert('Post Added','success'))
    }
    catch(error){
        dispatch({
            type: POST_ERROR,
            payload: { message: error.response.statusText, status: error.response.status }
        })
    }
}

// Add Comment
export const addComment=(postID,formData)=>async dispatch=>{
    const config={
        headers:{
            'Content-Type': 'application/json'
        }
    }
    try{
        const res=await axios.post(`/api/posts/comment/${postID}`,formData,config)
        dispatch({
            type:ADD_COMMENT,
            payload: res.data
        })
        dispatch(setAlert('Comment Added','success'))
    }
    catch(error){
        dispatch({
            type: POST_ERROR,
            payload: { message: error.response.statusText, status: error.response.status }
        })
    }
}

// Delete Comment
export const deleteComment=(postID,commentID)=>async dispatch=>{
    const config={
        headers:{
            'Content-Type': 'application/json'
        }
    }
    try{
        await axios.delete(`/api/posts/comment/${postID}/${commentID}`)
        dispatch({
            type:REMOVE_COMMENT,
            payload: commentID
        })
        dispatch(setAlert('Comment Removed','success'))
    }
    catch(error){
        dispatch({
            type: POST_ERROR,
            payload: { message: error.response.statusText, status: error.response.status }
        })
    }
}