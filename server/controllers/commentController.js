

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

    postComment: (req,res)=>{
        req.db.comments.insert({...req.body, created_at: new Date()})
           .then(result=>{
               console.log(new Date(result.created_at))
               res.send(result)
           })
           .catch(err=>{
               console.log(err)
           })
    },

    updateComment: (req, res)=>{
        req.db.comments.update({...req.body, updated_at: new Date() })
           .then(comment=>{
               res.send(comment)
           })
           .catch(err=>{
               console.log(err)
           })
    }, 

    deleteComment: (req, res)=>{
        req.db.comments.destroy({id: req.params.comment_id})
           .then(comment=>{
               res.send(comment)
           })
           .catch(err=>{
               console.log(err)
           })
    },

    
}