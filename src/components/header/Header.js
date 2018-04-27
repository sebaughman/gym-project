import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom'
import {changeRole} from '../../redux/action-creators';
import './header.css';

class Header extends Component {
  constructor(){
    super()
    this.state = {
      gymName: 'Select a Gym'
    }
  }
  //takes the selected gym from redux (an id int) and finds the gym name 
  //from the usersGyms to set to gymName on local state
  componentWillMount(){
    this.props.gyms.usersGyms.map(gym=>{ 
      if(gym.gym_id === this.props.gyms.selectedGym){
       this.setState({
          gymName: gym.name
        })
      }
    })
  }
  //Since the selected gym can change outside of this component I need to 
  //inform the component to listen for changes in its props
  componentWillReceiveProps(props){
    props.gyms.usersGyms.map(gym=>{
      if(gym.gym_id === props.gyms.selectedGym){
        this.setState({
          gymName: gym.name
        })
      }
    })
  }
  changeRole(event){
    this.props.changeRole(event.target.value)
  }
    render() {
      return (
        <div className='header-container'>
        <div className='header-body'>
          <Link to='/profile'>
              <div className='header-logo'/>
          </Link>
          <Link to='/dashboard'>
             <div className='appTitle-select-container'>
                <p className='appTitle'>Gym Project</p>
                <p className='appTitle-select'>{this.state.gymName}</p>
             </div>
          </Link>
              {this.props.user.role === 'setter' ?
                <select value={this.props.user.temporaryRole} name='temporaryRole' className='roleSelect' onChange={(event)=>this.props.changeRole(event.target.value)}>
                  <option value='setter'>Setter</option>
                  <option value='climber'>Climber</option>
                </select>
              : 
                <p className='roleSelect'>Climber</p>
              }
        </div>
       </div>
      );
    }
  }
  
  function mapStateToProps ({ user, gyms }) {
    return { user, gyms };
    }
  
  export default connect(mapStateToProps, {changeRole})(Header); 