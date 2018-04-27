import React, { Component } from 'react';
import { connect } from 'react-redux';
import {addTick} from '../../redux/action-creators'
import grades from '../../helperFiles/grades'
import MuiThemeProvider   from 'material-ui/styles/MuiThemeProvider';
import SelectField from 'material-ui/SelectField';
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

//We get the type of route from props so we know which grading system to use
  componentDidMount(){
    this.setState({
      type: this.props.type
    })
  }

//When Done is pressed we send the info through redux to update state and our db (check /services)
//then hide popup
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
                              grades.boulderingGrades
                              :
                              grades.sportGrades
                            }
                    </SelectField>
                  </MuiThemeProvider>
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