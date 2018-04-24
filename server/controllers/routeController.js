

module.exports = {
    getRoutes = (req, res)=>{
        req.db.GET_ROUTES([req.params.gym_id])
            .then(routes=>{
                let allRoutes = routes;
                let settersRoutes = [];
                let disabledRoutes = []
                routes.map(route=>{
                    if(route.setter_id === req.user.id){
                        settersRoutes.push(route)
                    }
                    if(route.disabled === true){
                        disabledRoutes.push(route)
                    }
                })
                res.send({allRoutes: allRoutes, settersRoutes: settersRoutes, disabledRoutes: disabledRoutes})
            })
            .catch(err=>{
                console.log(err)
            })
    },

    getRoute: (req, res)=>{
        req.db.GET_ROUTE([req.params.route_id])
            .then(route=>{
                req.db.GET_RATINGS([route[0].id])
                    .then(ratings=>{
                        let values=[];
                        ratings.map(obj=>{
                            if(route[0].type === 'bouldering'){
                                values.push(Number(obj.rating.split('').slice(1).join('')))
                            }
                            if(route[0].type === 'sport'){
                                values.push(Number(obj.rating.split('.').slice(1).join('')))
                            }
                        })
                        let avgRating = (values.reduce((a=0, b)=> a += b)) / values.length
                        if(route[0].type === 'bouldering'){
                            avgRating = ('V' + avgRating.toString())
                        }
                        if(route[0].type === 'sport'){
                            avgRating = ('5.' + avgRating.toString())
                        }
                        res.send({...route[0], avgRating})
                    })
                    .catch(err=>{
                        console.log(err)
                    })
            })
            .catch(err=>{
                console.log(err)
            })
    },

    postRoute: (req, res)=>{
        req.db.routes.insert(req.body)
            .then(route=>{
                disableRoutes();
                res.send(route)
            })
            .catch(err=>{
                console.log(err)
            })
    },

    updateRoute: (req, res)=>{
        req.db.routes.update({id: req.params.route_id, ...req.body})
            .then(route=>{
                res.send(route)
            })
            .catch(err=>{
                console.log(err)
            })
    }

}