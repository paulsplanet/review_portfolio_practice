/* axios */
const api = axios.create({
    baseURL: "https://api.themoviedb.org/3/",               // baseURL is repeated part -> replace this part with variable 'api'
    params: {
        api_key: "4f6578794983bcd8f310a8b773d93195",
        language: "en-US",
    }
});
export const moviesApi = {
    nowPlaying: () => api.get("movie/now_playing"),
    upcoming: () => api.get("movie/upcoming"),
    popular: () => api.get("movie/popular"),
    movieDetail: id => api.get(`movie/${id}`, {
        params: {
            append_to_response: "videos"                // this is movieDB API's method in the detail request
        }
    }),
    search: term => api.get("search/movie", {
        params: {
            query: encodeURIComponent(term)             // encode URI characters into UTF-8 and show it escape letters
        }
    }),
};


/* ReactRouter - broweserRouter */
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
const Navigation = function() {
    return (
        <Router>
                <Header />
                <Switch>
                    <Route path="/" exact component={Home} />
                    <Route path="/tv" component={TV} />
                    <Route path="/movie/:id" component={Detail} />      // /:id = this depends on the props
                    <Redirect from="*" to="/" />
                </Switch>    
        </Router>
    )
};
        // then you Link tag to use a / link
        /* withRouter & Link */
import { Link, withRouter } from "react-router-dom";
export default withRouter(({ location: { pathname }}) => (          //withRouter: can get access to history object's properties and the closest Route's match
<Header>                                                            //withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.              
        <List>                                                      //example)   const { match, location, history } = this.props;
            <Item current={pathname === "/"}>
                <SLink to="/">Movies</SLink>                        // SLink is styled.Link``;
            </Item>
            <Item current={pathname === "/tv"}>
                <SLink to="/tv">TV</SLink>
            </Item>
        </List>
    </Header>
));


/* styled-componenet: global style */
import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";
const GlobalStyles = createGlobalStyle`
    ${reset};
    a{ . . . }
    *{ box-sizing: border-box }
    body{ . . . }
`;
    // then import GlobalStyles at App.js
return (
    <>
        <GlobalStyles />                // apply global styles to below components
        < . . . />
        < . . . />
    </>
)


/* styled-componenet: how to use props */
const Text = styled.span`
    color: ${props => props.color};             // this is how to receive prop value
`;
const Message = ({ text, color }) => (
    <Container>
        <Text color={color}>{text}</Text>       // this is how to pass prop value
    </Container>
);
Message.propTypes = {
    text: PropTypes.string.isRequired,          // this is checking types of props because it is required
    color: PropTypes.string.isRequired,
};


/* styled-component: trasition at :hover */
const Image = styled.div`
transition: opacity 0.2s linear;
`;
const ImageContainer = styled.div`
    margin-bottom: 5px;
    position: relative;
    &:hover {
        ${Image} {                  // Image & Rating are other styled-components
            opacity: 0.3;               
        };
        ${Rating} {
            opacity: 1;
        }
    }
`;


/* trim long sentence to short */
<Title>{title.length > 18 ? `${title.substring(0, 18)}...` : title}</Title>


/* using class component */
export default class extends React.Component{
    state = {
        nowPlaying: null,
        upcoming: null, popular: null, error: null, loading: true,
    };

    async componentDidMount() {                                                         // compoenentDidMount = excute when this page rendered
        try{
            const { data: { results: nowPlaying } } = await moviesApi.nowPlaying();
            const { data: { results: upcoming } } = await moviesApi.upcoming();
            const { data: { results: popular } } = await moviesApi.popular();
            this.setState({                                                             // save the data on the state
                nowPlaying,  upcoming,  popular,
            })
        } catch{
            this.setState({
                error: "Can't find movies information." })
        } finally{
            this.setState({
                loading: false });
        }
    };

    render() {                                                                          // use render() , not return()        
        const { nowPlaying, upcoming, popular, error, loading } = this.state;
        return (
            <HomePresenter                                                              // bring data from state and give to children as props
                nowPlaying={nowPlaying} upcoming={upcoming} popular={popular}  error={error}  loading={loading}
            />
        )
    };
}


/* get detail data */
export default class extends React.Component{
    constructor(props) {
        super(props);
        const {location: { pathname }} = props;     // to use pahtname (= url), bring value from props which is given by react router defaultly
        this.state = {
            result: null,
            error: null,
            loading: true,
            isMovie: pathname.includes("/movie/"),
        };
    }
    async componentDidMount() {
        const { 
            match: { 
                params: { id } 
            }, 
            history: { push },    
        } = this.props;
        const { isMovie } = this.state;
        const parsedId = parseInt(id);
        if(isNaN(parsedId)) {
            return push("/");                   // id is equal to number, push to 'home' if id is typed other than number
        }
        let result = null;                                                  // make result variable which can be changed to movie or show result by using 'let'
        try{
            if(isMovie) {
                ({data: result} = await moviesApi.movieDetail(parsedId));   // this is set resut got from API. then override 'null' value result to result with data
            } else {
                ({data: result} = await tvApi.showDetail(parsedId));
            }
        } catch{
            this.setState({ error: "Can't find anything."})
        } finally{
            this.setState({ loading: false, result})
        }
    }
    render() {
        const { result, error, loading } = this.state;
        console.log(result);
        return (
            <DetailPresenter  result={result}  error={error}  loading={loading} />
        )
    };
}