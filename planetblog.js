
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


/* changeField Action & initializedField Action */
export const changeField = createAction(CHANGE_FILED, ({ key, value }) => ({ key, value }) );
export const initializeField = createAction(INITIALIZE_FIELD);

const post = handleActions({
    [CHANGE_FILED]: (state, { payload: { key, value } }) => ({
        ...state,
        [key]: value,                                           // didn't use the produce because of initialState structure { title: '', body: '', tags: [], posts: [{title, body, tags, ...}, {}, {}]}                        
    }),                                                         // first 3 states (tilte, body, tags) are for input elements to type in.
    [POST_WRITING]: (state, { payload: post }) => ({
        ...state,
        posts: state.posts.concat(post),                        // using concat (not push)
    }), 
    [INITIALIZE_FIELD]: (state) => ({
        ...state,
        title: initialState.title,
        body: initialState.body,
        tags: initialState.tags,
    })
}, initialState)


/* container structure */
import React, { useEffect } from "react";
import LoginForm from "../../Components/LoginForm";
import { connect } from "react-redux";
import { loginForm, changeInput, cleanForm } from "../../modules/auth";                         // import actions which exported in 'auth' store

const LoginContainer = ({ user, login, loginForm, changeInput, cleanForm, history }) => {
    useEffect(() => {
        if(user.id) history.push('/')
    }) 
    return (
        <>
        <LoginForm   form={login} onLogin={loginForm} onChangeInput={changeInput} onClean={cleanForm} />    // give props to child
        </>
    )
};

export default connect(
   ({ auth }) => ({                             // bring states in store
       login: auth.login,
       user: auth.user
   }),
   {                                            // bring actions in store
       changeInput,
       loginForm,
       cleanForm,
   }
)(LoginContainer);


/* select several store by using useSelector */
const PostListContainer = () => {
    const { user, posts } = useSelector( ({ auth, post }) => ({
        user: auth.user,
        posts: post.posts,
    }))
}


/* match prop - from react router */
const PostViewerContainer = (match) => {
    const posts = useSelector( state => state.post.posts)           // select posts state in post store
    const id = match.match.params.postId;
    const selectPost = posts.filter(function(post) {     
        return String(post._id) === id
    })
    return(
        <>
            <Header />
            <PostViewer post={selectPost} />
        </>
    )
}


/* useSelector and useDispatch */
const Header = () => {
    const user  = useSelector(state => state.auth.user.id );            // useSelector: select state from Redux.
    const dispatch = useDispatch();                                     // declare dispatch by using useDispatch
    return(
        <>
            ...
            <HeaderButton onClick={() => dispatch(cleanForm('user'))}>Logout</HeaderButton>         // use dispatch to use redux Action directly
        </>
    )}


/* use redux actions what received in props */
const LoginForm = ({ form, onLogin, onChangeInput, onClean, }) => {
    const onSubmit = e => {
        e.preventDefault();
        const { id, password } = form;              // get element what I need
        onLogin({ id, password });                  // onLogin=loginForm (reducer), id & password what are needed and declared in auth store
        onClean('login');                           // onClean=cleanForm (reducer)        
    }
    const onChange = e => { 
        const { value, name } = e.target;
        onChangeInput({                             // onChangeInput=changeInput (reducer)
            form: 'login',
            key: name,
            value,
         });
    }
    return(
        <form onSubmit={onSubmit}>
            <StyledInput name="id" placeholder="ID" onChange={onChange} value={form.id} />
            <StyledInput name="password" placeholder="password" type="password" onChange={onChange} value={form.password} />
            <ButtonWithMarginTop type="submit" orange fullWidth>LogIn</ButtonWithMarginTop>
        </form>
    )
}


/* using submit post action */
const PostButtons = ({ title, body, tags, onPostWriting, onInitializeField, history }) => {
    const user = useSelector(state => state.auth.user.id)
    const date = new Date();
    const id = Number(date)

    const onSubmit = (title, body, tags) => {           // title, body, tags are given by props
        onPostWriting({                                 // onPostWriting = postWriting reducer
            title: title,
            body: body,
            tags: tags,
            username: user,
            publishedDate: date,
            _id: id,
        });
        onInitializeField();                            // clean field after submit - initializeField reducer
        history.push('/');
    }
}


/* dangerouslySetInnerHTML */
const sanitizedBody = sanitizeHtml(body);
<PostContent dangerouslySetInnerHTML={{ __html: sanitizedBody }} />


/* set tags on local state and redux store state */
const TagBox = ({ tags, onChangeTag }) => {
    const [input, setInput] = useState('');                 // for onChange function
    const [localTags, setLocalTags] = useState([]);         // local state of tags
    
    const onChange = e => {
        setInput(e.target.value)
    }

    const onSubmit = (e) => {
        e.preventDefault();
        insertTag(input);                                   // add a tag what just typed => excute insertTag function
        setInput('');
    }

    const insertTag = (tag) => {
        if(!tag) return;
        if(localTags.includes(tag)) return;
        const newTag = [...localTags, tag];
        setLocalTags(newTag);                               // save at local state
        onChangeTag(newTag);                                // save at Redux State by using changeTag reducer
    }

    const onRemove = (id) => {    
        const refreshTags = localTags.filter(t => t !== id);    // use filter to find the one and return without it
        setLocalTags(refreshTags);
        onChangeTag(refreshTags);
    }
}