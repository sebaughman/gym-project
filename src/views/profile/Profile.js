import React, { Component } from 'react';
import { connect } from 'react-redux';
import Header from '../../components/header/Header';
import Gyms from '../../components/gyms/Gyms';
import ReactTable from "react-table";
import "react-table/react-table.css";
import './profile.css'


class Profile extends Component {

    render() {
      let ticks = this.props.ticks.filter(tick=>tick.gym_id === this.props.gyms.selectedGym)
      let todos = this.props.todos.filter(todo=>todo.gym_id === this.props.gyms.selectedGym)
      let columns = [
        {
            Header:'',
            id: 'color',
            accessor: row => <div className='color-box' style={{backgroundColor: row.color}} />,
            minWidth: 29,
            maxWidth: 29
        },
        {
            Header: 'Grade',
            accessor: `difficulty`,
            minWidth: 53,
            maxWidth: 53
         },
         {
             Header: 'Wall',
             accessor: 'wall',
             minWidth: 63,
             maxWidth: 80
         },
         {
             Header: 'Setter',
             accessor: 'setters_name',
             minWidth: 70,
             maxWidth: 95
         },
         {
             Header: 'Stars',
             id:'avg_stars',
             accessor: row => { let stars =[]
                                 for(let i=0;i<row.avg_stars;i++){stars.push(i)}
                                return <div className='stars-container'> {stars.map((star,i)=><div key={i} className='star-icon'/>)}</div>
                             },
             minWidth: 50,
             maxWidth: 60
         }
    ]

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
                {/* <div className='popup'>
                    <AddGym visibility={this.state.addGymPopup} AddGymVisibility={(value)=>this.AddGymVisibility(value)}/>
                </div> */}
            </div>
        </div>
      );
    }
  }
  
  function mapStateToProps ({ user, ticks, todos, gyms }) {
    return { user, ticks, todos, gyms };
    }
  
  export default connect(mapStateToProps )(Profile); 