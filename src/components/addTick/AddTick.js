import React, { Component } from 'react';
import { connect } from 'react-redux';
import {addTick} from '../../redux/action-creators'
import MuiThemeProvider   from 'material-ui/styles/MuiThemeProvider';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import ReactStars from 'react-stars'
import './addTick.css';


class AddTick extends Component {
  constructor(){
    super()
    this.state = {
      difficulty: '',
      stars: '',
      type: ''
    }
  }
  componentDidMount(){
    this.setState({
      type: this.props.type
    })
  }

  addTick(){
    this.props.addTick({route_id: this.props.route_id, stars:this.state.stars, rating: this.state.difficulty, gym_id: this.props.gyms.selectedGym})
    this.props.AddTickVisibility('hidden')
  }
  selectValue(event, i, value, name){
    this.setState({
        [name]: value
    })
  }
  selectStar(rating){
    this.setState({
      stars: rating
    })
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
      return (
        <div className='popup-background' style={{visibility:this.props.visibility}}>
            <div className='popup-content'>
              <div className='addTick-body'>
                  <span className='title-container'>  <h3> Nice Work! </h3> <button className='exit-popup-button' onClick={()=>this.props.AddTickVisibility('hidden')}> X</button></span>
                  <p className='rating-question'>How awesome was it?</p>
                  <ReactStars
                    count={5}
                    value={Number(this.state.stars)}
                    onChange={(rating)=>this.selectStar(rating)}
                    half={false}
                    size={24}
                    color2={'#ffd700'}
                    />
                  <p className='rating-question'>How hard do you think it was?</p>
                  
                  <MuiThemeProvider>
                    <SelectField
                            hintText="Grade"
                            value={this.state.difficulty}
                            style={{width:100, padding:0, marginLeft:5, fontSize:'.8em'}}
                            iconStyle={{padding:0, width: 20}}
                            labelStyle={{paddingRight:5}}
                            name='difficulty'
                            maxHeight={150}
                            onChange={(event, i, value, name)=>this.selectValue(event, i, value, 'difficulty')}>
                            {
                              this.state.type === 'bouldering' ?
                              boulderingGrades
                              :
                              sportGrades
                            }
                        </SelectField>
                    </ MuiThemeProvider>
                    <button className='green-button addTick-button' onClick={()=>this.addTick()}> Add Tick </button>
              </div>
            </div>
        </div>
      );
    }
  }
  
  function mapStateToProps ({ gyms }) {
    return { gyms };
    }
  
  export default connect(mapStateToProps , { addTick })(AddTick); 