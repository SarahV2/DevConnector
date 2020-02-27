import React,{Fragment} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {deleteComment} from '../../actions/post'
import Moment from 'react-moment'

const CommentItem = ({auth,postID,comment:{_id,text,name,avatar,user,date},deleteComment}) => {
    return (
<div class="post bg-white p-1 my-1">
          <div>
            <Link to={`/profile/${user}`}>
              <img
                class="round-img"
                src={avatar}
                alt=""
              />
              <h4>{name}</h4>
            </Link>
          </div>
          <div>
            <p class="my-1">
             {text}
            </p>
             <p class="post-date">
                Posted on <Moment formar='DD/MM/YYYY'>{date}</Moment>
            </p>
            {!auth.loading&&user===auth.user._id&&(
                <button onClick={()=>{deleteComment(postID,_id)}} type='button' className='btn btn-danger'>
                <i className='fas fa-times'/>
                </button>
            )}
          </div>
        </div>
    )
}

CommentItem.propTypes = {
    postID:PropTypes.number.isRequired,
    comment:PropTypes.object.isRequired,
    auth:PropTypes.object.isRequired,
    deleteComment:PropTypes.func.isRequired,

}

const mapStateToProps=state=>({
    auth:state.auth
})

export default connect(mapStateToProps,{deleteComment}) (CommentItem)
