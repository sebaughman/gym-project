import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Login from './views/login/Login';

import AppRoutes from './views/AppRoutes'
import './App.css';

class App extends Component {
  render() {  
    return (
      <Router>
        <Switch>
          <Route exact path='/login' component={Login}/>
          <Route path='/' component={AppRoutes}/> 
        </Switch>
      </Router>
    );
  }
}

export default App;
