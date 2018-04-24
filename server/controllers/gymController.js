

module.exports = {
    getGyms: (req, res)=>{
        req.db.gym_listings.find()
            .then(gyms =>{
                res.send(gyms)
            })
            .catch(err=>{
                console.log(err)
            })
    },

    getUsersGyms: (req,res)=>{
        req.db.users_gyms.find({user_id: req.user.id})
            .then(gyms=>{
                res.send(gyms)
            })
            .catch(err=>{
                console.log(err)
            })
    },

    postGym: (req, res)=>{
        req.db.gym_listings.insert(req.body)
            .then(gym_listing =>{
                req.db.users_gyms.insert({gym_id: gym_listing.id, user_id: req.user.id})
                    .then(gym=>{
                        res.send(gym)
                    })
                    .catch(err=>{
                        console.log(err)
                    })
            })
            .catch(err=>{
                console.log(err)
            })
    },

    postUsersGym: (req,res)=>{
        req.db.users_gyms.insert({gym_id: req.body.gym_id, user_id: req.user.id})
            .then(gym=>{
                res.send(gym)
            })
            .catch(err=>{
                console.log(err)
            })
    }
}