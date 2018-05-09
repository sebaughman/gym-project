import { combineReducers } from 'redux';
import {SET_IMAGE, ADD_IMAGE, REMOVE_IMAGE, ADD_USERS_GYM, SET_USERS_GYMS, SET_ROLE, SET_USER, SET_TICKS, SELECT_GYM, SET_TODOS, CHANGE_ROLE, ADD_TICK, ADD_TODO, REMOVE_TICK, REMOVE_TODO} from './constraints'

const userState = {
    id: '',
    first_name: '',
    role: '',
    temporaryRole: '',
    image: '',
}
const gymsState = {
    selectedGym:'',
    usersGyms:[]
}


function user(state = userState, action ){
    switch(action.type){
        case `${SET_USER}_PENDING`:
            return state;
        case `${SET_USER}_FULFILLED`:
            return Object.assign({}, state, action.payload);
        case `${SET_USER}_REJECTED`:
            return `State not set`;
        case `${SET_ROLE}_PENDING`:
            return state;
        case `${SET_ROLE}_FULFILLED`:
            return Object.assign({}, state, action.payload);
        case `${SET_ROLE}_REJECTED`:
            return state;
        case `${CHANGE_ROLE}`:
            return Object.assign({}, state, action.payload);
        default:
            return state;
    }
}
function ticks(state = [], action ){
    switch(action.type){
        case `${SET_TICKS}_PENDING`:
            return state;
        case `${SET_TICKS}_FULFILLED`:
            return action.payload;
        case `${SET_TICKS}_REJECTED`:
            return [`ticks not set`];
        case `${ADD_TICK}_PENDING`:
            return state;
        case `${ADD_TICK}_FULFILLED`:
            return action.payload;
        case `${ADD_TICK}_REJECTED`:
            return state;
        case `${REMOVE_TICK}_PENDING`:
            return state;
        case `${REMOVE_TICK}_FULFILLED`:
            return action.payload;
        case `${REMOVE_TICK}_REJECTED`:
            return state;
        default:
            return state;
    }
}
function todos(state = [], action ){
    switch(action.type){
        case `${SET_TODOS}_PENDING`:
            return state;
        case `${SET_TODOS}_FULFILLED`:
            return action.payload;
        case `${SET_TODOS}_REJECTED`:
            return [`TODOS not set`];
        case `${ADD_TODO}_PENDING`:
            return state;
        case `${ADD_TODO}_FULFILLED`:
            return action.payload;
        case `${ADD_TODO}_REJECTED`:
            return state;
        case `${REMOVE_TODO}_PENDING`:
            return state;
        case `${REMOVE_TODO}_FULFILLED`:
            return action.payload;
        case `${REMOVE_TODO}_REJECTED`:
            return state;
        default:
            return state;
    }
}
function gyms(state = gymsState, action ){
    switch(action.type){
        case `${SELECT_GYM}`:
            return Object.assign({}, state, action.payload);
        case `${SET_USERS_GYMS}_PENDING`:
            return state;
        case `${SET_USERS_GYMS}_FULFILLED`:
            return Object.assign({}, state, action.payload);
        case `${SET_USERS_GYMS}_REJECTED`:
             return [`UsersGyms not set`];
        case `${ADD_USERS_GYM}_PENDING`:
             return state;
        case `${ADD_USERS_GYM}_FULFILLED`:
             return Object.assign({}, state, action.payload);
        case `${ADD_USERS_GYM}_REJECTED`:
              return state;
        default:
            return state;
    }
}
function routeImage(state=null, action){
    switch(action.type){
        case `${SET_IMAGE}`:
            return action.payload
        case `${ADD_IMAGE}_PENDING`:
            return state;
        case `${ADD_IMAGE}_FULFILLED`:
            return action.payload;
        case `${ADD_IMAGE}_REJECTED`:
             return state;
        case `${REMOVE_IMAGE}_PENDING`:
             return state;
        case `${REMOVE_IMAGE}_FULFILLED`:
             return null;
        case `${REMOVE_IMAGE}_REJECTED`:
              return state;
        default:
            return state;
    }
}

const reducer = combineReducers({user, ticks, todos, gyms, routeImage});

export default reducer;