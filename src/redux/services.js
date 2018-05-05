import axios from 'axios';

const services = {
    
    getUser: ()=>{
         return axios.get(`/api/user`)
                .then(user=>{
                    user.data.temporaryRole = user.data.role;
                    return user.data
                })
    },

    getTicks: ()=>{
      return  axios.get(`/api/ticks`)
                .then(ticks=>ticks.data)
    },

    getTodos: ()=>{
        return axios.get(`/api/todos`)
                .then(todos=>todos.data)

    },

    setRole: (role)=>{
        return axios.put(`/api/user-role`, {role: role})
                .then(role=>role.data)
    },

    setUsersGyms: ()=>{
        return axios.get(`/api/users-gyms`)
                .then(usersGyms=>{
                    let selectedGym;
                    if(usersGyms.data.length > 0){
                        selectedGym = usersGyms.data[0].gym_id
                    }
                    else{
                        selectedGym = ''
                    }
                    return {selectedGym: selectedGym, usersGyms: usersGyms.data}
                    
                })
    },

    addTick:(payload)=>{
        return axios.post(`/api/tick`, payload)
                .then(ticks=>ticks.data)
    },

    removeTick:(route_id)=>{
            return axios.delete(`/api/tick/${route_id}`)
                .then(response=>{
                    return response.data.ticks
                })
    },

    addTodo:(route_id, gym_id)=>{
        return axios.post(`/api/todo`, {route_id: route_id, gym_id: gym_id})
            .then(todos=>todos.data)
    },

    removeTodo: (route_id)=>{
        return axios.delete(`/api/todo/${route_id}`)
            .then(todos=>todos.data)
    },

    addUsersGym: (gym_id)=>{
        return axios.post(`/api/users-gym`, {gym_id: gym_id})
                .then(gyms=>{
                    let usersGyms = {usersGyms: gyms.data}
                    return usersGyms
                })
    },
    addImage: (route_id, formData)=>{
        return axios.post(`/api/route-image/${route_id}`, formData,  {
                headers: {
                'Content-Type': 'multipart/form-data'
                }})
                .then(response=>response.data.route.image)
    },
    removeImage: (route_id, fileName)=>{
        return axios.put(`/api/route-image`, {route_id: route_id, fileName: fileName})
                .then(response=>response)
    }
    
}


export default services