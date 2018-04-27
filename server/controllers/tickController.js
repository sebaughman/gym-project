

module.exports = {
    getTicks: (req, res)=>{
        req.db.GET_TICKS([req.user.id])
           .then(ticks=>{
               res.send(ticks)
           })
           .catch(err=>{
               console.log(err)
           })
    },
 
    postTick: async (req, res)=>{
        let date = new Date()
        try { 
            await req.db.ticks.insert({date_created: date, user_id: req.user.id, route_id: req.body.route_id})
            await req.db.star_ratings.insert({date_created: date, user_id: req.user.id, route_id: req.body.route_id, stars: req.body.stars})
            await req.db.difficulty_ratings.insert({date_created: date, user_id: req.user.id, route_id: req.body.route_id, rating: req.body.rating})
            const ticks = await req.db.GET_TICKS([req.user.id])
            res.send(ticks)
        } catch(err){
            console.log(err)
            res.status(500).send(err)
        }
    },

    deleteTick: async (req, res)=>{
        try { 
            await req.db.ticks.destroy({user_id: 3, route_id: req.params.route_id})
            await req.db.star_ratings.destroy({user_id: req.user.id, route_id: req.params.route_id})
            await req.db.difficulty_ratings.destroy({user_id: req.user.id, route_id: req.params.route_id})
            const ticks = await req.db.GET_TICKS([req.user.id])
            res.send({message: 'tick removed', ticks: ticks})
        } catch(err){
            console.log(err)
            res.status(500).send(err)
        }
    },


}