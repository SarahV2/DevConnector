import { SET_ALERT, REMOVE_ALERT } from '../actions/types'
const iniialState = []


export default function (state = iniialState, action) {
    const {type,payload}=action //extract those from the action

    switch (type) {
        case 'SET_ALERT':
            return [...state, payload]; //include any other state in there and add our alert.

        case 'REMOVE_ALERT': //remove a specific alert by its ID
            return state.filter(alert => alert.id !== payload) //payload is he id in this case
        default: return state
    }

}