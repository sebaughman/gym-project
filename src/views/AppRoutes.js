import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import {setUsersGyms, setUser, setTicks, setTodos} from '../redux/action-creators'
import Dashboard from './dashboard/Dashboard';
import RouteView from './routeView/RouteView';
import Profile from './profile/Profile';
import SetRole from './setRole/SetRole';
import FileInput from '../components/fileInput/FileInput'

class AppRoutes extends Component {
constructor(){
    super()
    this.state = {
        loading: true,
    }
}

    componentDidMount(){
        let promises = [
          this.props.setUser(),
          this.props.setTicks(),
          this.props.setTodos(),
          this.props.setUsersGyms(),
        ];
    
        Promise.all(promises)
          .then(response=>{
                this.setState({
                    loading:false
                })
          })
          .catch(err=>{
            this.props.history.push('/login')
            console.error(err)
          })
      }
    

    render() {
        if(this.state.loading){
              return  <p>...loading</p>
        }
      return (
        <div>
          <Route path='/dashboard' component={Dashboard}/> 
          <Route path='/set-role' component={SetRole} />
          <Route path='/route/:setter_id/:route_id' component={RouteView}/>  
          <Route path='/profile' component={Profile} />
       </div>
      );
    }
  }
  
  function mapStateToProps ({ user, gyms, ticks, todos }) {
    return {  user, gyms, ticks, todos };
    }
  
  export default connect(mapStateToProps , { setUsersGyms, setUser, setTicks, setTodos})(AppRoutes); 