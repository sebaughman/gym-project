import React, { Component } from 'react';
import { connect } from 'react-redux';
import grades from '../../helperFiles/grades'
import colors from '../../helperFiles/colors'
import getMuiTheme        from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider   from 'material-ui/styles/MuiThemeProvider';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import DatePicker from 'material-ui/DatePicker';
import FileInput from '../fileInput/FileInput';
import './editRoute.css';

import {addImage} from '../../redux/action-creators'


class EditRoute extends Component {
  constructor(){
    super()
      this.state = {
          gym_id: '',
          type: '',
          difficulty: '',
          color: '',
          setter_id:'',
          wall: '',
          image:'',
          set_date: '',
          removal_date: '',
          disabled: false,
      }
  }

  //if this component is rendered from the Edit button on RouteView we will receive a routeInfo prop
  //if we receive this prop we want to populate state with it so we can see and edit the info with the UI
  //else the component is loaded from the Add Route button on the dashboard and we just want to set the 
  //dates, selected gym, and setter
  componentWillMount(){
    if(this.props.routeInfo){
      this.setState({
        ...this.props.routeInfo
      })
    }
    else{
      let date = new Date()
      date.setMonth(date.getMonth()+ 3)
      this.setState({
        gym_id: this.props.gyms.selectedGym,
        setter_id: this.props.user.id,
        set_date: new Date(),
        removal_date: new Date(date)
      })
    }
  }

  //material UI is funcky with its onChanges so I needed a separate handler for each
  selectValue(event, i, value, name){
    this.setState({
        [name]: value
    })
  }
  changeValue(event){
    this.setState({
        [event.target.name]: event.target.value
    })
  }
  selectSetDate(nu, date){
      this.setState({
        set_date: date
      })
  }
  selectRemovalDate(nu, date){
      this.setState({
        removal_date: date
      })
  }
  setFormData(formData){
    this.setState({
      formData: formData
    })
  }
 

  //I wanted the freedom to know exactly what I was sending to the db so I set route in the postRoute function
  //then, if we are coming from Edit Route I add the route id... 
  //if there is an image added i call addImage from redux
  // if coming from Add Route, route will not have an ID
  //so we handle add image on dashboard after route comes back with id
  // the updateRoute function is called from either the Dashboard or RouteView depending on 
  //where the component was mounted from it will call an axios.put or axios.post depending
  //then clear state so the component will be ready for the next render
  postRoute(){
    let route = {
      gym_id: this.props.gyms.selectedGym,
      type: this.state.type,
      difficulty: this.state.difficulty,
      color: this.state.color,
      setter_id: this.state.setter_id, 
      wall: this.state.wall,
      image: this.props.routeImage,
      set_date: new Date(this.state.set_date),
      removal_date: new Date(this.state.removal_date),
      disabled: this.state.disabled
    }
    //coming from edit route
    if(this.props.routeInfo){
      route.id = this.state.id
      if(this.state.formData){
        this.props.updateRoute(route)
        this.props.addImage(route.id, this.state.formData)
      }
      else{
        this.props.updateRoute(route)
      }
    }
    //coming from add route
    if(this.state.formData){
      this.props.updateRoute(route, this.state.formData)
    }
    else{
      this.props.updateRoute(route)
    }

   if(!this.props.routeInfo){
      this.setState({
        type: '',
        difficulty: '',
        color: '',
        wall: '',
        image:'',
        disabled: false,
      })
   }
  }

    render() {
      return (
        <div className='popup-background' style={{visibility: this.props.visibility}}>
            <div className='popup-content'> 
            {this.props.routeInfo?
                <span className='title-container'>  <h3> Edit Route </h3> <button className='exit-popup-button' onClick={()=>this.props.EditRouteVisibility('hidden')}> X</button></span>
              :
                <span className='title-container'>  <h3> Add Route </h3> <button className='exit-popup-button' onClick={()=>this.props.AddRouteVisibility('hidden')}> X</button></span>
            }
            <MuiThemeProvider muiTheme={getMuiTheme() }>
              <div className='editRouteForm'>
                  <div className='firstRow'>
                    <SelectField
                          hintText="Color"
                          value={this.state.color}
                          labelStyle={{backgroundColor:this.state.color, border:'1px solid black', paddingRight:0,height: 35}}
                          style={{width:38,  padding:0, margin:0, fontSize:'.6em', height:33, top: -10}}
                          underlineStyle={{display:'none'}}
                          iconStyle={{display:'none'}}
                          hintStyle={{bottom: 7, left: 7}}
                          name='color'
                          maxHeight={150}
                          onChange={(event, i, value, name)=>this.selectValue(event, i, value, 'color')}>
                          {colors}
                    </SelectField>
                    <SelectField
                          hintText="Type"
                          value={this.state.type}
                          style={{width:110,  padding:0, margin:10, fontSize:'.8em'}}
                          iconStyle={{padding:0, width: 20}}
                          labelStyle={{paddingRight:5}}
                          name='type'
                          onChange={(event, i, value, name)=>this.selectValue(event, i, value, 'type')}>
                            {[ <MenuItem key={1} value='bouldering' primaryText="Bouldering" />,
                              <MenuItem key={2} value='sport' primaryText="Sport" />
                            ]}
                    </SelectField>
                    <SelectField
                          hintText="Grade"
                          value={this.state.difficulty}
                          style={{width:80,  padding:0, marginLeft:5, fontSize:'.8em'}}
                          iconStyle={{padding:0, width: 20}}
                          labelStyle={{paddingRight:5}}
                          name='difficulty'
                          maxHeight={150}
                          transition={'none'}
                          onChange={(event, i, value, name)=>this.selectValue(event, i, value, 'difficulty')}>
                          {
                            this.state.type === 'bouldering' ?
                            grades.boulderingGrades
                            :
                            grades.sportGrades
                          }
                      </SelectField>
                  </div>
                  <div className='secondRow'>
                      <div className='firstColumn'>
                        <TextField 
                            floatingLabelText="Wall"
                            floatingLabelStyle={{marginTop:0, paddingTop:0, top:15}}
                            value={this.state.wall}
                            style={{width:90,fontSize:'.8em', marginLeft: 0, height:38}}
                            inputStyle={{marginTop:5, marginLeft:3}}
                            underlineStyle={{bottom: 0}}
                            name='wall'
                            onChange={(event)=>this.changeValue(event)}
                            />
                        <DatePicker
                            floatingLabelText='Set date'
                            value={new Date(this.state.set_date)}
                            onChange={(nu, date)=>this.selectSetDate(null, date)}
                            floatingLabelStyle={{marginTop:0, paddingTop:0, top:31}}
                            inputStyle={{marginTop:14, marginLeft:3}}
                            underlineStyle={{bottom: 0}}
                            textFieldStyle={{width:90,fontSize:'.8em', marginLeft: 0, height:52}} 
                          />
                        <DatePicker 
                            floatingLabelText='Removal date' 
                            value={new Date(this.state.removal_date)}
                            onChange={(nu, date)=>this.selectRemovalDate(null, date)}
                            floatingLabelStyle={{marginTop:0, paddingTop:0, top:31}}
                            inputStyle={{marginTop:14, marginLeft:3}}
                            underlineStyle={{bottom: 0}}
                            textFieldStyle={{width:90,fontSize:'.8em', marginLeft: 0, height:52}} 
                          />
                      </div>
                      <div className='secondColumn'>
                        <FileInput route_id={this.state.id} route_image={this.state.image} setFormData={(formData)=>this.setFormData(formData)}/>
                      </div>
                  </div>
              </div>
            </MuiThemeProvider>
            <button className='green-button editRouteDone-button' onClick={()=>this.postRoute()}>Done</button>
            </div>
        </div>
      );
    }
  }
  
  function mapStateToProps ({ gyms, user, routeImage }) {
    return { gyms, user, routeImage };
    }
  
  export default connect(mapStateToProps, {addImage} )(EditRoute); 