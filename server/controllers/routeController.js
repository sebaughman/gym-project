

module.exports = {
    getRoutes: (req, res)=>{
        req.db.GET_ROUTES([req.params.gym_id])
        .then(routes=>{
            let allRoutes = [];
            let settersRoutes = [];
            let disabledRoutes = []
            routes.map(route=>{
                if(route.setter_id === req.user.id){
                    settersRoutes.push(route)
                }
                if(route.disabled === true){
                    disabledRoutes.push(route)
                }
                if(route.disabled === false){
                    allRoutes.push(route)
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
                    let letters=[]
                    ratings.map(obj=>{
                        let rating = obj.rating.split('')
                        if(route[0].type === 'bouldering'){
                            values.push(Number(rating.slice(1).join('')))
                        }
                        if(route[0].type === 'sport'){
                            letters.push(rating.pop())
                            values.push(Number(rating.slice(2).join('')))
                        }
                    })
               
                    let avgRating = 'No climber ratings';

                    if(values.length > 0){
                        avgRating = Math.round((values.reduce((a=0, b)=> a += b)) / values.length)
                    
                        if(route[0].type === 'bouldering'){
                            avgRating = ('V' + avgRating.toString())
                        }
                        if(route[0].type === 'sport'){
                            let numbers = []

                            // foo = {'a': 1, 'b':2}
                            // numbers.push foo[letter]
                            letters.map(letter=>{
                                switch (letter){
                                    case 'a':
                                    numbers.push(1)
                                    break;
                                    case 'b':
                                    numbers.push(2)
                                    break;
                                    case 'c':
                                    numbers.push(3)
                                    break;
                                    case 'd':
                                    numbers.push(4)
                                    break;
                                    default:
                                    console.log(letter)
                                }
                            })
                        let number = Math.round((numbers.reduce((a, b)=> a += b)) / numbers.length)
                        let letter;
                        switch (number){
                            case 1:
                                letter ='a'
                                break;
                            case 2:
                                letter ='b'
                                break;
                            case 3:
                                letter ='c'
                                break;
                            case 4:
                            letter ='d'
                            break;
                            default: 
                            console.log(number)
                            }

                        avgRating = ('5.' + avgRating.toString() + letter)
                        }
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
                res.send(route)
            })
            .catch(err=>{
                console.log(err)
            })
    },

    updateRoute: (req, res)=>{
        req.db.routes.update(req.body)
            .then(route=>{
                res.send(route)
            })
            .catch(err=>{
                console.log(err)
            })
    }

}