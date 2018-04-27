import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import ReactTable from "react-table";
import "react-table/react-table.css";
import './routes.css'

class Routes extends Component {
    constructor(){
        super()
        this.state={
            allRoutes: [],
            settersRoutes: [],
            disabledRoutes: [],
        }
    }
//since I called this method twice i set it once below and called it in each lifecycle method
//pretty much it gets all the route from the selected gym and sets them to state as All, setter's, and disabled
// disabled show up in setter's and disabled but not myRoutes the separation happens on the db
componentWillMount(){
    this.populateRoutes(this.props.gyms.selectedGym)
}
componentWillReceiveProps(props){
    this.populateRoutes(props.gyms.selectedGym)
}
//we filter by my, all, and disabled through state and type through props from the dashboard
    render() {
        let routes;
        if(this.props.view === 'allRoutes'){
            routes = this.state.allRoutes.filter(route=>route.type === this.props.type)
        }
        else if (this.props.view === 'settersRoutes'){
            routes = this.state.settersRoutes.filter(route=>route.type === this.props.type)
        }
        else{
            routes = this.state.disabledRoutes.filter(route=>route.type === this.props.type)
        }
      return (
        <div >
               <ReactTable 
                data ={routes}
                columns={[
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
               ]}
                getTrProps={(state, rowInfo, column, instance) => ({
                            onClick: e => this.props.history.push(`/route/${rowInfo.original.setter_id}/${rowInfo.original.id}`)
                            })}
                getNoDataProps={()=>{
                    return {style:{zIndex:0}}
                }}
                defaultPageSize={20}
                style={{
                    height: "370px",
                }}
                showPagination={false}
                minRows={0}
                resizable={false}
               />
        </div>
      );
    }

populateRoutes(selectedGym){
        axios.get(`/api/routes/${selectedGym}`)
        .then(routes=>{
            this.setState(
                {...routes.data,
                type: this.props.type}
            )
        })
        .catch(err=>{
            console.log(err)
        })
    }
}

  function mapStateToProps ({ gyms }) {
    return { gyms };
    }
  
  export default connect(mapStateToProps )(Routes); 