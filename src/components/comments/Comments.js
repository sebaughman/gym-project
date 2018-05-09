import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import './comments.css';

class Comments extends Component {
    constructor(){
        super()
        this.state = {
            loading: true,
            comments: [],
            newCommentBody: ''
        }
    }
//get all the comment from the db for this route and set them to state
    componentWillMount(){
        axios.get(`/api/comments/${this.props.route_id}`)
        .then(comments=>{
          this.setState({
            loading: false,
            comments: comments.data
          })
        })
        .catch(err=>{
          console.log(err)
        })
    }

    enterComment(event){
        this.setState({
          newCommentBody: event.target.value
        })
      }
//post comment to db and re-render component
      postComment(){
        axios.post(`/api/comment`, {route_id: this.props.route_id, body: this.state.newCommentBody})
          .then(comments=>{
            this.setState({
              comments: comments.data,
              newCommentBody:''
            })
          })
      }
//remove comment from db and re-render
      removeComment(comment_id){
        axios.delete(`/api/comment/${this.props.route_id}/${comment_id}`)
          .then(comments=>{
            this.setState({
              comments:comments.data,
            })
          })
      }

    render(){
        let comments;
        if(!this.state.loading){
        comments = this.state.comments.map((comment, i)=>{
            comment.created_at = new Date(comment.created_at).toDateString()
           return <div className='comment-box' key={i}>
                     <div className='comment-image-body'>
                         <div className='comment-user-image' style={{backgroundImage:`url(${comment.image})`}}/>
                         <div className='comment-content'>
                           <p className='comment-owner-name'>{comment.first_name}</p>
                           <p className='comment-created-at'>{comment.created_at}</p>
                           <p className='comment-body'> {comment.body}</p>
                         </div>
                     </div>
                     {comment.user_id === this.props.user.id ?
                     <button className='remove-comment-button' onClick={(comment_id)=>this.removeComment(comment.id)}>X</button>
                     :
                     <p></p>
                     }
                 </div>
         })}
        return(
            <div>
                <div className='comment-container'>
                    {comments}
                  </div>
                  <div className='new-comment-body'>
                    <input  type='text' placeholder="Leave a comment!" value={this.state.newCommentBody} onChange={(event)=>this.enterComment(event)}/>
                    <button className='post-comment-button' onClick={()=>this.postComment()}>Post</button>
                  </div>
            </div>
        )}
}

function mapStateToProps ({ user}) {
    return { user};
    }
  
  export default connect(mapStateToProps )(Comments); 