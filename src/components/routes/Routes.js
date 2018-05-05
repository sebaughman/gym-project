import React, { Component } from 'react';
import { connect } from 'react-redux';
import columns from '../../helperFiles/tableColumns';
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
    if(this.props.gyms.selectedGym){
        this.populateRoutes(this.props.gyms.selectedGym)
    }
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
                columns={ columns }
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