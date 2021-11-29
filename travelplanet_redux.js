/*  src/actions/types.js   */
export const LOGIN_USER = 'login_user';
export const REGISTER_USER = 'register_user';
... ...


/*  src/actions/user_actions.js  */
import axios from 'axios';
import { USER_SERVER } from '../components/Config.js';      // export const USER_SERVER = '/api/users';
import {
    LOGIN_USER,
    REGISTER_USER,
    ... ...
} from './types';

export function registerUser(dataToSubmit){
    const request = axios.post(`${USER_SERVER}/register`,dataToSubmit)
        .then(response => response.data);    
    return {
        type: REGISTER_USER,
        payload: request
}}
... ... 
export function auth(){
    const request = axios.get(`${USER_SERVER}/auth`)
    .then(response => response.data);
    return {
        type: AUTH_USER,
        payload: request
}}
... ... 
export function addToCart(id){
    let body = {
        productId: id
    }
    const request = axios.post(`${USER_SERVER}/addToCart`, body)
        .then(response => response.data);
    return {
        type: ADD_TO_CART,
        payload: request
    }
}
export function getCartItems(cartItems, userCart) {   
    const request = axios.get(`/api/product/products_by_id?id=${cartItems}&type=array`)
        .then(response => {
            userCart.forEach(cartItem => {
                response.data.forEach((productDetail, index) => {
                    if(cartItem.id === productDetail._id) {
                        response.data[index].quantity = cartItem.quantity
                    }
                })
            })
            return response.data        
        });
    return {
        type: GET_CART_ITEMS,
        payload: request
    }
}
export function removeCartItem(productId) {  
    const request = axios.get(`/api/users/removeFromCart?id=${productId}`)
        .then(response => {
            response.data.cart.forEach(item => {
                response.data.productInfo.forEach((product, index) => {
                    if(item.id === product._id) {
                        response.data.productInfo[index].quantity = item.quantity
                    }
                })
            })
            return response.data        
        });
    return {
        type: REMOVE_CART_ITEM,
        payload: request
    }
}
... ... 


/*  src/reducers/uer_reducer.js  */
import {
    LOGIN_USER,
    REGISTER_USER,
    ... ...
} from '../_actions/types';

export default function(state={},action){
    switch(action.type){
        case REGISTER_USER:
            return {...state, register: action.payload }
        case LOGIN_USER:
            return { ...state, loginSucces: action.payload }
        case AUTH_USER:
            return {...state, userData: action.payload }
        case LOGOUT_USER:
            return {...state }
        case ADD_TO_CART:
            return {
                ...state, 
                userData: {
                    ...state.userData,
                    cart: action.payload
                }
            } 
        case GET_CART_ITEMS:
            return {...state, cartDetail: action.payload }   
        case REMOVE_CART_ITEM:
            return {...state, cartDetail: action.payload.productInfo, 
                    userData: {
                        ...state.userData, 
                        cart: action.payload.cart
                    } 
                }
        case ON_SUCCESS_BUY:
            return {...state, cartDetail: action.payload.cartDetail, 
            userData: {
                ...state.userData, cart: action.payload.cart
            } }  
        case ADD_TO_MYPICK:
            return {
                ...state, 
                userData: {
                    ...state.userData,
                    mypick: action.payload
                }
            }
        case REMOVE_MYPICK_ITEM:
            return {...state,  
                    userData: {
                        ...state.userData, 
                        mypick: action.payload.mypick
                    } 
                }
            
        default:
            return state;
    }
}