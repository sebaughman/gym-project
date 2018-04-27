import React, { Component } from 'react';
import { connect } from 'react-redux';
import {removeTick, addTodo, removeTodo, addTick} from '../../redux/action-creators'
import './routeViewButtons.css'


class RouteViewButtons extends Component {
  constructor(){
    super()
    this.state = {
      ticked: false,
      isTodo: false
    }
  }
  //ticks are on redux so I run through those to see if the route being views is on the ticked list
  //same with todos
  componentDidMount(){
    this.props.ticks.forEach(tick => {
      if(tick.route_id === this.props.route_id){
        this.setState({
          ticked: true
        })
      }
    });
    this.props.todos.forEach(todo =>{
      if(todo.route_id === this.props.route_id)
        this.setState({
          isTodo: true
        })
    })
  }
  //remove tick through redux and set state.... should I use promise.resolve here?
  removeTick(){
    this.props.removeTick(this.props.route_id)
    this.setState({
      ticked: false,
    })
  }
  //this is opens the add tickpopup which controls the addTick functionality.
  // if someone is ticking a route... it should no longer be a todo so I remove the todo from state
  //I feel like I should handle this better.... maybe re render the component to check the new todo's list instead of just change 
  //local state right away. what if they exit out of the modal...
  tickButton(){
    this.setState({
      ticked: true,
      isTodo: false
    })
    this.props.AddTickVisibility('visible')
  }

  //send addTodo through redux... use promise.resolve?
  addTodo(){
    this.props.addTodo(this.props.route_id, this.props.gyms.selectedGym)
    this.setState({
      isTodo: true,
    })
  }
  //remove todo through redux... user promise.resolve?
  removeTodo(){
    this.props.removeTodo(this.props.route_id)
    this.setState({
      isTodo: false,
    })
  }

    render() {
      return (
        <div>
            { this.props.user.temporaryRole === 'setter' & this.props.user.id == this.props.setter_id ?
            <div className='routeView-button-container'>
              <button className='green-button' onClick={()=>this.props.EditRouteVisibility('visible')}>Edit</button>
              <button className='teal-button' onClick={()=>this.props.disableRoute()}>Disable</button>
            </div>
            :
            <div className='routeView-button-container'>
            {!this.state.ticked ?
              <button className='green-button' onClick={()=>this.tickButton()}>Tick</button>
              :
              <button className='green-button' onClick={()=>this.removeTick()}>Ticked!</button>
            }
            {!this.state.isTodo ?
              <button className='teal-button' onClick={()=>this.addTodo()}>Todo</button>
              :
              <button className='teal-button' onClick={()=>this.removeTodo()} >On Your List!</button>
            }
            </div>
            }
        </div>
      );
    }
  }
  
  function mapStateToProps ({ user, ticks, todos, gyms }) {
    return { user, ticks, todos, gyms};
    }
  
  export default connect(mapStateToProps, {removeTick, addTodo, removeTodo, addTick} )(RouteViewButtons); 