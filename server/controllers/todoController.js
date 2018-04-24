module.exports = {
    getTodos: (req, res)=>{
        req.db.todos.find({user_id: req.user.id})
           .then(todos=>{
               res.send(todos)
           })
           .catch(err=>{
               console.log(err)
           })
    },

    postTodos: (req, res)=>{
        req.db.todos.insert({date_created: new Date(), user_id: req.user.id, route_id: req.body.route_id})
            .then(todo=>{
                res.send(todo)
            })
            .catch(err=>{
                console.log(err)
            })
    },

    deleteTodo: (req, res)=>{
        req.db.todos.destroy({user_id: req.user.id, route_id: req.params.route_id})
            .then(todo=>{
                res.send({todoRemoved: todo[0]})
            })
            .catch(err=>{
                console.log(err)
            })
    }
}