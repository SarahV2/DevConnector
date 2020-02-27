import {GET_POSTS,GET_POST, ADD_COMMENT, REMOVE_COMMENT, POST_ERROR,UPDATE_LIKES,DELETE_POST,ADD_POST} from '../actions/types'
const initialState={
    posts:[],
    post: null,
    loading: true,
    error: {},
}

export default function(state=initialState,action){
    const {type,payload}=action

    switch(type){
        case GET_POSTS:
            return{
                ...state,
                posts:payload,
                loading: false
            }
        case GET_POST:
            return{
                ...state,
                post:payload,
                loading:false
            }
        case ADD_POST:
            return{
                ...state,
                posts:[payload,...state.posts],
                loading:false
            }
        case DELETE_POST:
            return{
                ...state,
                posts: state.posts.filter(post=> post._id!==payload), //remove all except the one in the payload.
                loading: false
            }

            case POST_ERROR:
                return{
                    ...state,
                    error:payload,
                    loading: false
                }
            case UPDATE_LIKES:
                return{
                    ...state,
                    posts: state.posts.map(post => post._id === payload.postID ? { ...post, likes: payload.likes } : post),
                    loading:false,
                //looping throught the posts if the id matches update the likes of that post, otherwise just return the post as it is.
                }
            case ADD_COMMENT:
            return{
                ...state,
                post:{...state.post,comments:payload},
                loading: false
            }
            case REMOVE_COMMENT:
                return{
                    ...state,
                    post:{...state.post,
                    comments: state.post.comments.filter(comment=>comment._id!==payload)},
                    loading:false
                }
            default:
                return state
    }
}