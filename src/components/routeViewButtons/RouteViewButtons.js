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
  removeTick(){
    this.props.removeTick(this.props.route_id)
    this.setState({
      ticked: false,
    })
  }
  tickButton(){
    this.props.removeTodo(this.props.route_id)
    this.setState({
      ticked: true,
      isTodo: false
    })
    this.props.AddTickVisibility('visible')
  }
  addTodo(){
    console.log(this.props.gyms.selectedGym)
    this.props.addTodo(this.props.route_id, this.props.gyms.selectedGym)
    this.setState({
      isTodo: true,
    })
  }
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