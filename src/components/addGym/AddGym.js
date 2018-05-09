import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import {selectGym, addUsersGym} from '../../redux/action-creators'
import Autocomplete from 'material-ui/AutoComplete';
import getMuiTheme        from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider   from 'material-ui/styles/MuiThemeProvider';
import TextField from 'material-ui/TextField';
import './addGym.css';



class AddGym extends Component {
   constructor(){
     super()
     this.state = {
       allGyms: [],
       gymNames: [],
       selectedGym: '',
       name: '',
       city: '',
       state: ''
     }
   }

//goes to the db and gets all of the gyms available, 
//it then puts all of the names in an array
//to be used by the material ui type ahead
componentWillMount(){
     axios.get(`/api/gyms`)
        .then(gyms=>{
          let gymNames = []
          gyms.data.map(gym=>gymNames.push(gym.name))
          this.setState({
            gymNames: gymNames,
            allGyms: gyms.data
          })
        })
}

//if the selected gym name = a gym already in our list of all gyms then we populate the city and state
selectGym(event){
      if(this.state.allGyms.find(gym=>gym.name === event)){
        this.state.allGyms.map(gym=>{
          if(gym.name === event){
            this.setState({
              selectedGym: gym.id,
              name: event,
              city: gym.city,
              state: gym.state
            })
          }
        })
      }
      else{
        this.setState({
          name: event
        })
      }
}

changeValue(event){
  this.setState({
      [event.target.name]: event.target.value
  })
}

//if the selected gym is already in our db we "link" that gym to our user
//and set that gym as our selected gym
//then clear state so the next time the modal is opened it does not contain the previous info
//else the gym is no tin our db so add it, link it to our user, set it as our selected gym, and clear state
//then close modal
addGym(){
  if(this.state.allGyms.find(gym=>gym.name === this.state.name)){
        this.props.addUsersGym(this.state.selectedGym)
        this.props.selectGym(this.state.selectedGym)
        this.setState({
          selectedGym: '',
          name: '',
          city: '',
          state: ''
        })
        this.props.AddGymVisibility('hidden') 
     
  }
  else{
    axios.post(`/api/gym`, {name: this.state.name, city: this.state.city, state: this.state.state})
      .then(gym=>{
        this.props.addUsersGym(gym.data.id)
        this.props.selectGym(gym.data.id)
        this.setState({
          selectedGym: '',
          name: '',
          city: '',
          state: ''
        })
        this.props.AddGymVisibility('hidden')
      })
      .catch(err=>{
        console.log(err)
      })
  }
}
   
render() {
      return (
        <div className='popup-background' style={{visibility: this.props.visibility}}>
          <div className='popup-content'>
          <span className='title-container'>  <h3 > Add Gym </h3> <button className='exit-popup-button' onClick={()=>this.props.AddGymVisibility('hidden')}> X</button></span>
              <MuiThemeProvider muiTheme={getMuiTheme()}>
                <div>
                  <Autocomplete name='autoCompleteSelector' className='gymSelector' 
                    dataSource={this.state.gymNames}
                    onUpdateInput={(event)=>this.selectGym(event)}
                    floatingLabelText="Gym Name"
                    value={this.state.selectedGym}
                  />
                  <TextField 
                  floatingLabelText="City"
                  value={this.state.city}
                  name='city'
                  onChange={(event)=>this.changeValue(event)}
                  />
                  <TextField 
                  floatingLabelText="State"
                  value={this.state.state}
                  name='state'
                  onChange={(event)=>this.changeValue(event)}
                  />
                </div>

              </MuiThemeProvider>

              <button className='green-button postGym-button' onClick={()=>this.addGym()}> Add Gym </button>
        
          </div>
        </div>
      );
    }
  }
  
  function mapStateToProps ({ gym }) {
    return { gym };
    }
  
  export default connect(mapStateToProps , { selectGym, addUsersGym })(AddGym); 