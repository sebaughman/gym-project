module.exports = {
    getTodos: (req, res)=>{
        req.db.GET_TODOS([req.user.id])
       .then(todos=>{
           res.send(todos)
       })
       .catch(err=>{
           console.log(err)
       })
    },

    postTodo: async(req, res)=>{
        try {   await  req.db.todos.insert({date_created: new Date(), user_id: req.user.id, route_id: req.body.route_id, gym_id: req.body.gym_id})
                const todos = await req.db.GET_TODOS([req.user.id])
                res.send(todos)
        } catch (err){
            console.log(err)
            res.status(500).send(err)
        }
    },

    deleteTodo: async (req, res)=>{
        try {   await   req.db.todos.destroy({user_id: req.user.id, route_id: req.params.route_id})
                const todos = await req.db.GET_TODOS([req.user.id])
                res.send(todos)
        } catch (err){
            console.log(err)
            res.status(500).send(err)
}
    }
}