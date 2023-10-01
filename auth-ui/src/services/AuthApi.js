import axios from 'axios'
import {config} from '../Constants'
import {parseJwt} from '../components/helpers/Helpers'

export const authApi = {
    authenticate,
    signup,
    numberOfUsers,
    verifyToken,
    authenticateStepTwo,
    updateUser,
}

function authenticate(email, password) {
    return instance.post('/auth/login', {email, password}, {
        headers: {'Content-type': 'application/json'}
    })
}

function authenticateStepTwo(userId, token) {
    return instance.get(`/auth/login/${userId}/${token}`);
}

function signup(user) {
    return instance.post('/users', user, {
        headers: {'Content-type': 'application/json'}
    })
}

function verifyToken(captchaToken) {
    return instance.get(`/users/verifyCaptcha/${captchaToken}`);
}

function numberOfUsers() {
    return instance.get('/users')
}

function updateUser(user, userId, token) {
    return instance.patch(`/users/${userId}`, user,{
        headers: {'Authorization': token }
    })
}

const instance = axios.create({
    baseURL: config.url.API_BASE_URL
})

instance.interceptors.request.use(function (config) {
    if (config.headers.Authorization) {
        const token = config.headers.Authorization
        const data = parseJwt(token)
        if (Date.now() > data.exp * 1000) {
            window.location.href = "/login"
        }
    }
    return config
}, function (error) {
    return Promise.reject(error)
})


function bearerAuth(user) {
    return `Bearer ${user.accessToken}`
}