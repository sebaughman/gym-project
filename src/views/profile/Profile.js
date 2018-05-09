import React, { Component } from 'react';
import { connect } from 'react-redux';
import Header from '../../components/header/Header';
import Gyms from '../../components/gyms/Gyms';
import columns from '../../helperFiles/tableColumns';
import ReactTable from "react-table";
import "react-table/react-table.css";
import './profile.css'


class Profile extends Component {
    constructor(){
        super()
        this.state={
            type: 'sport'
        }
    }
    changeRoutes(event){
        this.setState({
          [event.target.name]: event.target.value
        })
     }

    render() {
      let ticks = this.props.ticks.filter(tick=>tick.gym_id === this.props.gyms.selectedGym).filter(tick=>tick.type === this.state.type)
      let todos = this.props.todos.filter(todo=>todo.gym_id === this.props.gyms.selectedGym).filter(todo=>todo.type === this.state.type)
      return (
        <div>
            <Header />
            <div className='profileBody'>
                { this.props.user.temporaryRole === 'setter'?
                    <div className='arrow-div'>
                        <p className='setterMessage'> Change your role<br/> to view your <br/> Climber Profile</p>
                        <div className='arrow' />
                    </div>
                :
                <div className='profile-content'>

                  <div className='title-container'>
                        <p className='section-title'>Gyms</p>
                  </div>
                
                  <div className=' white-container'>
                        <Gyms />
                  </div> 

                  <div className='title-container'>
                    <p className='section-title'>My Todos</p>
                    <select value={this.state.type} name='type' onChange={(event)=>this.changeRoutes(event)}>
                        <option value='bouldering'>Bouldering</option>
                        <option value='sport'>Sport</option>
                    </select>
                  </div>

                  <div className='white-container'>
                      <ReactTable 
                          data ={todos}
                          columns={columns}
                          getTrProps={(state, rowInfo, column, instance) => ({
                                      onClick: e => this.props.history.push(`/route/${rowInfo.original.setter_id}/${rowInfo.original.id}`)
                                      })}
                          defaultPageSize={20}
                          style={{
                              height: "180px",
                          }}
                          showPagination={false}
                          minRows={0}
                          resizable={false}
                        />
                  </div>
                  
                  <div className='title-container'>
                    <p className='section-title'>My Ticks</p>
                  </div>

                  <div className='white-container'>
                      <ReactTable 
                          data ={ticks}
                          columns={columns}
                          getTrProps={(state, rowInfo, column, instance) => ({
                                      onClick: e => this.props.history.push(`/route/${rowInfo.original.setter_id}/${rowInfo.original.id}`)
                                      })}
                          defaultPageSize={20}
                          style={{
                              height: "180px",
                          }}
                          showPagination={false}
                          minRows={0}
                          resizable={false}
                        />
                  </div>

                  

                </div>
                }
            </div>
        </div>
      );
    }
  }
  
  function mapStateToProps ({ user, ticks, todos, gyms }) {
    return { user, ticks, todos, gyms };
    }
  
  export default connect(mapStateToProps )(Profile); 