

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
        req.db.GET_USERS_GYMS([req.user.id])
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
            res.send(gym_listing)
        })
        .catch(err=>{
            console.log(err)
        })
    },

    postUsersGym: async (req,res)=>{
        try{
            await  req.db.users_gyms.insert({gym_id: req.body.gym_id, user_id: req.user.id})
            const gyms = await req.db.GET_USERS_GYMS([req.user.id])
            res.send(gyms)
        } catch (err){
            console.log(err)
            res.status(500).send(err)
        }
    }
}