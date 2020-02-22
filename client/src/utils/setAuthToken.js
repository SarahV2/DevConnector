import axios from 'axios'

// if token is there add it to headers, otherwise remove it from headers

const setAuthToken = token => {
    if (token) {
        axios.defaults.headers.common['x-auth-token']=token;
    }
    else {
        delete axios.defaults.headers.common['x-auth-token']
    }
}
export default setAuthToken;