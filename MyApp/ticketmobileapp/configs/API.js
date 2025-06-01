import axios from "axios";

const HOST = 'http://127.0.0.1:8000';

export const endpoints = {
    'categories': '/categories/',
    'events': '/events/',
    'banners': '/banners/',
    'type_tickets': (eventId) => `/events/${eventId}/type_ticket/`,
    'comments': (eventId) =>`/events/${eventId}/comments/` ,
    'login': '/o/token/',
    'users': '/users/',
    'user_detail': (id) => `/users/${id}/`,
    'current-user': '/users/current_user/',
    'register': '/users/',
    'discount': '/discounts/'
}

export const authApi = (accessToken) => {
    return axios.create({
        baseURL: HOST,
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
}

export default axios.create({
    baseURL: HOST
})