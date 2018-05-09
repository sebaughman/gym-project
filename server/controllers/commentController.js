

module.exports = {
    getComments: (req, res)=>{
        req.db.GET_COMMENTS([req.params.route_id])
           .then(comments=>{
               res.send(comments)
           })
           .catch(err=>{
               console.log(err)
           })
    },

    postComment: async (req,res)=>{
        try {
            await req.db.comments.insert({user_id: req.user.id, ...req.body, created_at: new Date()})
            const comments = await req.db.GET_COMMENTS([req.body.route_id])
            res.send(comments)
        } catch(err){
            console.log(err)
            res.status(500).send(err)
        }
    },
       

    deleteComment: async (req, res)=>{
        try {
            await  req.db.comments.destroy({id: req.params.comment_id})
            const comments = await req.db.GET_COMMENTS([req.params.route_id])
            res.send(comments)
        } catch(err){
            console.log(err)
            res.status(500).send(err)
        }
    },

    
}