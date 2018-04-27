import React, { Component } from 'react';
import {Link} from 'react-router-dom'
import { connect } from 'react-redux';
import {setRole} from '../../redux/action-creators'
import './setRole.css'


class SetRole extends Component {



    render() {
      return (
        <div className='setRole-body'>
          <div className='role-title'>Choose your role</div>
            <div className='white-container setRole-button-container'>
            <Link to='/dashboard'>
              <button className='orange-button' onClick={(role)=>this.props.setRole('climber')}> I am a Climber </button>
            </Link>
            <Link to='dashboard'>
              <button className='teal-button' onClick={(role)=>this.props.setRole('setter')} > I am a Setter </button>
            </Link>
            </div>
        </div>
      );
    }
  }
  
function mapStateToProps () {
    return {  };
    }
  
  export default connect(mapStateToProps , { setRole })(SetRole); 