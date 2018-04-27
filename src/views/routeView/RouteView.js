import React, { Component } from 'react';
import { connect } from 'react-redux';
import {setImage} from '../../redux/action-creators';
import Header from '../../components/header/Header';
import axios from 'axios';
import RouteViewButtons from '../../components/routeViewButtons/RouteViewButtons'
import AddTick from '../../components/addTick/AddTick'
import EditRoute from '../../components/editRoute/EditRoute'
import './routeView.css';

class RouteView extends Component {
  constructor(){
    super()
    this.state = {
      loading: true,
      addTickPopup: 'hidden',
      editRoutePopup: 'hidden',
      newCommentBody:'',
    }
  }
  componentDidMount(){
    axios.get(`/api/route/${this.props.match.params.route_id}`)
      .then(route=>{
        this.props.setImage(route.data.image)
        route.data.set_date = new Date(route.data.set_date)
        route.data.removal_date = new Date(route.data.removal_date)
        axios.get(`/api/comments/${this.props.match.params.route_id}`)
          .then(comments=>{
            this.setState({
              ...route.data,
              loading: false,
              comments: comments.data
            })
          })
          .catch(err=>{
            console.log(err)
          })
      })
      .catch(err=>{
        console.log(err)
      })
  }
  AddTickVisibility(value){
    this.setState({
      addTickPopup: value
    })
  }
  editRouteVisibility(value){
    this.setState({
      editRoutePopup: value
    })
  }
  updateRoute(route){
    axios.put(`/api/route`, route)
    .then(route=>{
      route.data.set_date = new Date(route.data.set_date)
      route.data.removal_date = new Date(route.data.removal_date)
      this.setState(
        route.data
      )
        this.editRouteVisibility('hidden')
    })
  }
  enterComment(event){
    this.setState({
      newCommentBody: event.target.value
    })
  }
  postComment(){
    axios.post(`/api/comment`, {route_id: this.props.match.params.route_id, body: this.state.newCommentBody})
      .then(comments=>{
        this.setState({
          comments: comments.data,
          newCommentBody:''
        })
      })
  }
  removeComment(comment_id){
    axios.delete(`/api/comment/${this.props.match.params.route_id}/${comment_id}`)
      .then(comments=>{
        this.setState({
          comments:comments.data,
        })
      })
  }
  disableRoute(){
    let date = new Date()
    axios.put(`/api/route`, {id:this.state.id, removal_date: date, disabled: true})
      .then(route=>{
        route.data.set_date = new Date(route.data.set_date)
        route.data.removal_date = new Date(route.data.removal_date)
        this.setState(
          route.data
        )
      })
  }

    render() {
      let comments;
      let stars = [];
      let avgStars;

      //build comment boxes and star div
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
        })
        for(let i=0;i<this.state.avg_stars;i++){stars.push(i)}
          avgStars = stars.map((star,i)=><div key={i} className='star-icon'/>)
      }
      
      return (
        <div >
            <Header />
            <div className='routeView-body'>
            <div className='title-container'><p className='section-title'>Route Information</p></div>
              <div className='white-container route-info-container'>
             {this.state.loading?
             <div className='loading-body-smaller'>
              <div className='loading-image-smaller'></div>
            </div>
            :
            <div>
                  <div className='title-container smaller-container'>
                    <div>
                        <div className='routeView-title'>
                          <div className='color-box' style={{backgroundColor:this.state.color}}/>
                          <p className='section-title'>{this.state.difficulty}</p>
                        </div>
                        <div className='avgStars-container'>
                          {avgStars}
                        </div>
                    </div>
                    {this.state.disabled ? 
                      <div className='route-disabled-text'>
                        This route was removed
                      </div>
                    :
                      <p></p>
                    }
                    
                  </div>
                  <div className='routeInfo'>
                    <div className='routeData'>
                    <p><span style={{fontWeight:'bold'}}>Setter: </span>{this.state.setters_name}</p>
                    <p><span style={{fontWeight:'bold'}}>Wall: </span>{this.state.wall}</p>
                    <p> <span style={{fontWeight:'bold'}}>Climber's Say:</span> {this.state.avgRating}</p>
                    <p> <span style={{fontWeight:'bold'}}>Set Date: </span>{new Date(this.state.set_date).toDateString()}</p>
                    <p> <span style={{fontWeight:'bold'}}>Removal Date:</span> {new Date(this.state.removal_date).toDateString()}</p>
                  </div>
                  <div className='routeImage' style={this.props.routeImage ? {backgroundImage:`url(${this.props.routeImage})`}: {fontSize: '.8em'}}/>
                  </div>
                  <RouteViewButtons AddTickVisibility={(value)=>this.AddTickVisibility(value)} EditRouteVisibility={(value)=>this.editRouteVisibility(value)} route_id={this.state.id}  setter_id={this.props.match.params.setter_id} disableRoute={()=>this.disableRoute()}/>
              </div>
             
             }
              </div>
              <div className='title-container'><p className='section-title'>Comments</p></div>
              <div className='white-container'>
                  <div className='comment-container'>
                    {comments}
                  </div>
                  <div className='new-comment-body'>
                    <input  type='text' placeholder="Leave a comment!" value={this.state.newCommentBody} onChange={(event)=>this.enterComment(event)}/>
                    <button className='post-comment-button' onClick={()=>this.postComment()}>Post</button>
                  </div>
              </div>
        
            </div>
            {this.state.loading?
            <p></p>
            :
            <div>
            <div className='popup'>
                <AddTick visibility={this.state.addTickPopup} AddTickVisibility={(value)=>this.AddTickVisibility(value)} type={this.state.type} route_id={this.state.id}/>
            </div>
            <div className='popup'>
                <EditRoute visibility={this.state.editRoutePopup} EditRouteVisibility={(value)=>this.editRouteVisibility(value)} routeInfo={this.state} updateRoute={(route)=>this.updateRoute(route)}/>
            </div>
            </div>
          }
        </div>
      );
    }
  }
  
  function mapStateToProps ({ user, routeImage}) {
    return { user, routeImage};
    }
  
  export default connect(mapStateToProps ,{setImage} )(RouteView); 