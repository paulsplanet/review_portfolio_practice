/* useSelector and useDispatch */
const Header = () => {
    const user  = useSelector(state => state.auth.user.id );            // useSelector: select state from Redux.
    const dispatch = useDispatch();                                     // declare dispatch by using useDispatch
    return(
        <>
            ...
            <HeaderButton onClick={() => dispatch(cleanForm('user'))}>Logout</HeaderButton>         // use dispatch to redux Action
        </>
    )}


/* Redux Store - under modules folder */
import { createAction, handleActions } from "redux-actions";
import produce from "immer";

/* declare Action Type */
const CHANGE_INPUT = 'auth/change_input';
const LOGIN = 'auth/login';
const CLEAN_FORM = 'auth/clean_form';

export const changeInput = createAction(                    // changeInput is an Action
    CHANGE_INPUT,                                           // CHANGE_INPUT: action type
    ({ form, key, value }) => ({ form, key, value })        // elements what we need for this Action
);
export const loginForm = createAction(LOGIN, ({ id, password }) => ({ id, password, }) );
export const cleanForm = createAction(CLEAN_FORM, form => form);

/* Redux State */
const initialState ={
    login: {
        id: "",
        password: "",
    },
    user: {
        id: "",
        password: "",
    }
}
/* Reducer = function which can changes state */
export default handleActions({
    [CHANGE_INPUT]: (state, { payload: { form, key, value } }) =>   // payload: what I receive it when dispatch the action   
    produce(state, draft => {                                       // use immer(produce) to destructure the state I need
        draft[form][key] = value;
    }),
    [LOGIN]: (state, { payload: user }) => ({
        ...state,
        user: user,
    }),
    [CLEAN_FORM]: (state, { payload: form }) => ({
        ...state,
        [form]: initialState[form]
    }),
}, initialState);


/* root reducer */
import { combineReducers } from "redux";
const rootReducer = combineReducers({
    auth,
    register,
    post,
});
export default rootReducer;