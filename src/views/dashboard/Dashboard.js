import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import {setUsersGyms, setUser, setTicks, setTodos, selectGym} from '../../redux/action-creators'
import Header from '../../components/header/Header';
import Gyms from '../../components/gyms/Gyms';
import AddGym from '../../components/addGym/AddGym';
import EditRoute from '../../components/editRoute/EditRoute';
import './dashboard.css';
import Routes from '../../components/routes/Routes';



class Dashboard extends Component {
  constructor(){
    super()
    this.state = {
      usersGyms: [],
      addGymPopup: 'hidden',
      addRoutePopup: 'hidden',
      loading: true,
      view: 'allRoutes',
      type: 'bouldering'
    }
  }
componentDidMount(){
  if(this.props.gyms.usersGyms.length === 0){
    this.setState({
      addGymPopup: 'visible'
    })
  }
}

  checkUsersGyms(){
    if(this.props.gyms.usersGyms.length === 0){
      this.setState({
        addGymPopup: 'visible'
      })
    }
    else{
      this.setState({
        loading: false
      })
    }
  }

  addGymVisibility(value){
    this.setState({
      addGymPopup: value
    })
  }
  addRouteVisibility(value){
    this.setState({
      addRoutePopup: value
    })
  }

  changeRoutes(event){
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  updateRoute(route){
    this.setState({
      loading: true
    })
    axios.post(`/api/route`, route)
    .then(route=>{
      console.log(route.type)
      this.setState({
        type: route.data.type,
        view: 'settersRoutes',
        loading: false
      })
      this.addRouteVisibility('hidden')
    })
  }

    render() {
      
      return (
        
        <div className='body'>
          <Header />
          <div className='dashboard-body'>
          <div className='title-container'>
                  <p className='section-title'>Gyms</p>
                  <button className='addGym-Button green-button' onClick={()=>this.addGymVisibility('visible')}> + </button>
          </div>
            <div className='gyms-container white-container'>      
                  <Gyms AddGymVisibility={(value)=>this.addGymVisibility(value)}/>
            </div>
            <div className='title-container'>       
                  {  this.props.user.temporaryRole === 'setter' ?
                    <select value={this.state.view} name='view' className='section-title' onChange={(event)=>this.changeRoutes(event)}> 
                      <option value='allRoutes'>All Routes</option>
                      <option value='settersRoutes'>My Routes</option>
                      <option value='disabledRoutes'>Disabled Routes</option>
                    </select>
                  :
                    <select name='view' className='section-title' onChange={(event)=>this.changeRoutes(event)}> 
                      <option value='allRoutes'>All Routes</option>
                      <option value='disabledRoutes'>Disabled Routes</option>
                    </select>
                  }
                  <select value={this.state.type} name='type' className='type-selector' onChange={(event)=>this.changeRoutes(event)}>
                    <option value='bouldering'>Bouldering</option>
                    <option value='sport'>Sport</option>
                  </select>
                </div>

            <div className='routes-container white-container'>
                  <div className='routes'>
                    <Routes view={this.state.view} type={this.state.type} history={this.props.history}/>
                  </div>
                
                   {
                  this.props.user.temporaryRole === 'setter' ?
                  <button onClick={()=>this.addRouteVisibility('visible')} className='addRoute-button green-button'> Add Route </button>
                  :
                  <p></p>
                }
            </div>
           
           
          </div>
          <div className='popup'>
            <AddGym visibility={this.state.addGymPopup} AddGymVisibility={(value)=>this.addGymVisibility(value)}/>
          </div>
          <div className='popup'>
            <EditRoute visibility={this.state.addRoutePopup} AddRouteVisibility={(value)=>this.addRouteVisibility(value)}  updateRoute={(route)=>this.updateRoute(route)}/>
          </div>
          
        </div>
      );
    }
  }
  
  function mapStateToProps ({ user, gyms }) {
    return { user, gyms };
    }
  
  export default connect(mapStateToProps , { setUsersGyms, setUser, setTicks, setTodos, selectGym })(Dashboard); 