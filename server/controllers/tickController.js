

module.exports = {
    getTicks: (req, res)=>{
        req.db.ticks.find({user_id: req.user.id})
           .then(ticks=>{
               res.send(ticks)
           })
           .catch(err=>{
               console.log(err)
           })
    },

    postTick: (req, res)=>{
        let date = new Date()
        req.db.ticks.insert({date_created: date, user_id: req.user.id, route_id: req.body.route_id})
           .then(tick=>{
               req.db.star_ratings.insert({date_created: date, user_id: req.user.id, route_id: req.body.route_id, stars: req.body.stars})
                   .then(stars=>{
                       req.db.difficulty_ratings.insert({date_created: date, user_id: req.user.id, route_id: req.body.route_id, rating: req.body.rating})
                           .then(rating=>{
                               req.db.todos.destroy({user_id: req.user.id, route_id: req.body.route_id})
                                   .then(todo=>{
                                       res.send({tick: tick, stars: stars, rating: rating, todoRemoved: todo})
                                   })
                                   .catch(err=>{
                                       console.log(err)
                                   })
                           })
                           .catch(err=>{
                               console.log(err)
                           })
                   })
                   .catch(err=>{
                       console.log(err)
                   })
           })
           .catch(err=>{
               console.log(err)
           })
    },

    deleteTick: (req, res)=>{
        req.db.ticks.destroy({user_id: 3, route_id: req.params.route_id})
            .then(tick=>{
                req.db.star_ratings.destroy({user_id: req.user.id, route_id: req.params.route_id})
                    .then(star=>{
                        req.db.difficulty_ratings.destroy({user_id: req.user.id, route_id: req.params.route_id})
                            .then(rating=>{
                                res.send({message: 'tick removed', tick: tick[0], star: star[0], rating: rating[0]})
                            })
                            .catch(err=>{
                                console.log(err)
                            })
                    })
                    .catch(err=>{
                        console.log(err)
                    })
            })
            .catch(err=>{
                console.log(err)
            })
     }
}