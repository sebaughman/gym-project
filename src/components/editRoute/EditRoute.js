import React, { Component } from 'react';
import { connect } from 'react-redux';
import getMuiTheme        from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider   from 'material-ui/styles/MuiThemeProvider';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import DatePicker from 'material-ui/DatePicker';
import './editRoute.css';
import FineUploaderS3 from 'fine-uploader-wrappers/s3';
import FileInput from '../fileInput/FileInput';
// import Gallery from 'react-fine-uploader'
// import 'react-fine-uploader/gallery/gallery.css'

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
        removal_date: date
      })
    }
  }
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
    if(this.props.routeInfo){
      route.id = this.state.id
    }

   this.props.updateRoute(route)

   if(!this.props.routeInfo){
      this.setState({
        type: '',
        difficulty: '',
        color: '',
        wall: '',
        image:'',
        set_date: '',
        removal_date: '',
        disabled: false,
      })
   }
  }

    render() {
      let boulderingGrades = [
        <MenuItem key={1} value='v0' primaryText="V0" />,
        <MenuItem key={2} value='v1' primaryText="V1" />,
        <MenuItem key={3} value='v2' primaryText="V2" />,
        <MenuItem key={4} value='v3' primaryText="V3" />,
        <MenuItem key={5} value='v4' primaryText="V4" />,
        <MenuItem key={6} value='v5' primaryText="V5" />,
        <MenuItem key={7} value='v6' primaryText="V6" />,
        <MenuItem key={8} value='v7' primaryText="V7" />,
        <MenuItem key={9} value='v8' primaryText="V8" />,
        <MenuItem key={10} value='v9' primaryText="V9" />,
        <MenuItem key={11} value='v10' primaryText="V10" />,
        <MenuItem key={12} value='v11' primaryText="V11" />,
        <MenuItem key={13} value='v12' primaryText="V12" />,
        <MenuItem key={14} value='v13' primaryText="V13" /> 
      ]
      let sportGrades = [
        <MenuItem key={15} value='5.8' primaryText="5.8" />,
        <MenuItem key={16} value='5.9' primaryText="5.9" />,
        <MenuItem key={17} value='5.10a' primaryText="5.10a" />,
        <MenuItem key={18} value='5.10b' primaryText="5.10b" />,
        <MenuItem key={19} value='5.10c' primaryText="5.10c" />,
        <MenuItem key={20} value='5.10d' primaryText="5.10d" />,
        <MenuItem key={21} value='5.11a' primaryText="5.11a" />,
        <MenuItem key={22} value='5.11b' primaryText="5.11b" />,
        <MenuItem key={23} value='5.11c' primaryText="5.11c" />,
        <MenuItem key={24} value='5.11d' primaryText="5.11d" />,
        <MenuItem key={25} value='5.12a' primaryText="5.12a" />,
        <MenuItem key={26} value='5.12b' primaryText="5.12b" />,
        <MenuItem key={27} value='5.12c' primaryText="5.12c" />,
        <MenuItem key={28} value='5.12d' primaryText="5.12d" />,
        <MenuItem key={29} value='5.13a' primaryText="5.13a" />,
        <MenuItem key={30} value='5.13b' primaryText="5.13b" />,
        <MenuItem key={31} value='5.13c' primaryText="5.13c" />,
        <MenuItem key={32} value='5.13d' primaryText="5.13d" />,
        <MenuItem key={33} value='5.14' primaryText="5.14" /> 
      ]
      let colors = [
        <MenuItem key={34} value='blue' primaryText="" style={{backgroundColor:'blue'}}/>,
        <MenuItem key={35} value='red' primaryText="" style={{backgroundColor:'red'}}/>,
        <MenuItem key={36} value='green' primaryText="" style={{backgroundColor:'green'}}/>,
        <MenuItem key={37} value='white' primaryText="" style={{backgroundColor:'white'}}/>,
        <MenuItem key={38} value='purple' primaryText="" style={{backgroundColor:'purple'}}/>,
        <MenuItem key={39} value='black' primaryText="" style={{backgroundColor:'black'}}/>,
        <MenuItem key={40} value='tan' primaryText="" style={{backgroundColor:'tan'}}/>,
        <MenuItem key={41} value='pink' primaryText="" style={{backgroundColor:'pink'}}/>,
        <MenuItem key={42} value='grey' primaryText="" style={{backgroundColor:'grey'}}/>,
        <MenuItem key={43} value='brown' primaryText="" style={{backgroundColor:'brown'}}/>,
        <MenuItem key={44} value='yellow' primaryText="" style={{backgroundColor:'yellow'}}/>,
      ]
      const uploader = new FineUploaderS3({
        options: {
            request: {
                endpoint: "http://fineuploadertest.s3.amazonaws.com",
                accessKey: "AKIAIXVR6TANOGNBGANQ"
            },
            signature: {
                endpoint: "/vendor/fineuploader/php-s3-server/endpoint.php"
            },
        } 
    })
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
                            boulderingGrades
                            :
                            sportGrades
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
                            value={this.state.removal_date}
                            onChange={(nu, date)=>this.selectRemovalDate(null, date)}
                            floatingLabelStyle={{marginTop:0, paddingTop:0, top:31}}
                            inputStyle={{marginTop:14, marginLeft:3}}
                            underlineStyle={{bottom: 0}}
                            textFieldStyle={{width:90,fontSize:'.8em', marginLeft: 0, height:52}} 
                          />
                      </div>
                      <div className='secondColumn'>
                        {/* <Gallery 
                            uploader={ uploader }
                            multiple={false}
                            fileInput-multiple={false}
                            dropzone-disabled={ true }
                            /> */}
                        <FileInput route_id={this.state.id} />
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
  
  export default connect(mapStateToProps )(EditRoute); 