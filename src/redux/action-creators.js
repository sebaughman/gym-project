import services from './services'
import {SET_IMAGE, ADD_IMAGE, REMOVE_IMAGE, ADD_USERS_GYM, SET_USERS_GYMS, SET_ROLE, SET_USER, SET_TICKS, SELECT_GYM, SET_TODOS, CHANGE_ROLE, ADD_TICK, ADD_TODO, REMOVE_TICK, REMOVE_TODO} from './constraints'



export function setUser(){
    return {
        type: SET_USER,
        payload: services.getUser()
    }
}

export function setTicks(){
    return {
        type: SET_TICKS,
        payload: services.getTicks()
    }
}
export function setTodos(){
    return {
        type: SET_TODOS,
        payload: services.getTodos()
    }
}
export function selectGym(payload){
    return {
        type: SELECT_GYM,
        payload: {selectedGym: payload}
    }
}

export function changeRole(payload){
    return {
        type: CHANGE_ROLE,
        payload: {temporaryRole: payload}
    }
}
export function setRole(payload){
    return{
        type: SET_ROLE,
        payload: services.setRole(payload)
    }
}
export function setUsersGyms(){
    return{
        type: SET_USERS_GYMS,
        payload: services.setUsersGyms()
    }
}
export function addTick(payload){
    return{
        type: ADD_TICK,
        payload: services.addTick(payload)
    }
}
export function removeTick(route_id){
    return{
        type: REMOVE_TICK,
        payload: services.removeTick(route_id)
    }
}
export function addTodo(route_id, gym_id){
    return{
        type: ADD_TODO,
        payload: services.addTodo(route_id, gym_id)
    }
}
export function removeTodo(route_id){
    return{
        type: REMOVE_TODO,
        payload: services.removeTodo(route_id)
    }
}
export function addUsersGym(gym_id){
    return{
        type: ADD_USERS_GYM,
        payload: services.addUsersGym(gym_id)
    }
}
export function setImage(image){
    return {
        type: SET_IMAGE,
        payload: image
    }
}
export function addImage(route_id, formData){
    return{
        type: ADD_IMAGE,
        payload: services.addImage(route_id, formData)
    }
}
export function removeImage(route_id, fileName){
    return{
        type: REMOVE_IMAGE,
        payload: services.removeImage(route_id, fileName)
    }
}