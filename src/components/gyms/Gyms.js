import React, { Component } from 'react';
import { connect } from 'react-redux';
import {selectGym} from '../../redux/action-creators'
import './gyms.css'

class Gyms extends Component {

  addGymVisibility(value){
    this.setState({
      addGymPopup: 'hidden'
    })
  }

  selectGym(event){
      this.props.selectGym(event)
  }
    render() {
      let usersGyms = this.props.gyms.usersGyms.map((usersGym, i)=>{
        let color = 'inherit'
        if(usersGym.gym_id == this.props.gyms.selectedGym){
          color='#e3e4e6'
        }
          return <div 
                  key={i} style={{backgroundColor: color}} className='gym-div' onClick={()=>this.selectGym(usersGym.gym_id)}>
                  <p>{usersGym.name}</p>
                </div>
      })
      return (
        <div className='gyms'>
            {usersGyms} 
        </div>
      );
    }
  }
  
function mapStateToProps ({  gyms }) {
    return { gyms };
    }
  
  export default connect(mapStateToProps , { selectGym })(Gyms); 