import React, { Component } from 'react';
import './login.css'


class Login extends Component {
    render() {
      return (
        <div className='login-body'>
            <div className='login-logo' /> 
            <div className='login-title'> Gym Project </div>
          <a href='http://localhost:8000/auth/google'>
          <div className='google-login-button'/>
          </a>
        </div>
      );
    }
  }
  
  export default Login;