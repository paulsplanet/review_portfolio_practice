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
            } else {                                                        // this is destructuring. it is same as:   
                ({data: result} = await tvApi.showDetail(parsedId));        //      const request = await tvAPI.showDetail(parsedId);
            }                                                               //      result = request.data;
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


/* class component - how to give function as a prop to child */
export default class extends React.Component{
    state = {
        movieResults: null,  tvResults: null, searchTerm: "", error: null, loading: false,
    };
    handleSubmit = (event) => {
        event.preventDefault();
        const { searchTerm } = this.state;
        if(searchTerm !== ""){
            this.searchByTerm();
        }
    };
    updateTerm = (event) => {                               // set state 'searchTerm' when typing
        const { target: { value } } = event;
        this.setState({
            searchTerm: value,
        })
    };
    searchByTerm = async () => {
        const { searchTerm } = this.state;
        this.setState({
            loading: true
        });
        try{
            const { data: { results: movieResults } } = await moviesApi.search(searchTerm);
            const { data: { results: tvResults } } = await tvApi.search(searchTerm);
            this.setState({
                movieResults,                                   // receive data by using API and setState to save data
                tvResults,
            })
        } catch{
            this.setState({
                error: "Can't find results."})
        } finally {
            this.setState({
                loading: false})
        }
    }
    render() {
        const { movieResults, tvResults, searchTerm, error, loading } = this.state;
        return (
            <SearchPresenter  movieResults={movieResults}  tvResults={tvResults}  searchTerm={searchTerm}  error={error}  loading={loading}
                handleSubmit={this.handleSubmit}                // handleSubmit and updateTerm was maden here
                updateTerm={this.updateTerm}
            />
        )
    };
}

            /* child component */
            const SearchPresenter = ({ movieResults, tvResults, loading, error, searchTerm, handleSubmit, updateTerm, }) => (
            <Container>
                <Form onSubmit={handleSubmit}>                          // this is how use function which transfered as a prop
                <Input placeholder="Serach Movies or TV Shows..." value={searchTerm} onChange={updateTerm} />       // this is how use function which transfered as a prop
                </Form>
            {loading ? <Loader /> : (
                <>
                    {movieResults && movieResults.length > 0 && (
                        <Section title="Movie Results">
                            {movieResults.map(movie => (
                                <Poster   key={movie.id}  id={movie.id}   title={movie.original_title}   imageUrl={movie.poster_path}   rating={movie.vote_average}
                                    year={movie.release_date && movie.release_date.substring(0, 4)}  isMovie={true}
                                />
                            ))}
                        </Section>
                    )}
                    {tvResults && tvResults.length > 0 && (
                        <Section title="TV Show Results">
                            {tvResults.map(show => (
                                <Poster  key={show.id}  id={show.id}  title={show.original_name}  imageUrl={show.poster_path} 
                                    rating={show.vote_average} year={show.frist_air_date && show.first_air_date.substring(0, 4)} 
                                />
                            ))}
                        </Section>
                    )}
                    {error && <Message color="#e74c3c" text={error} />}
                    {tvResults && movieResults && tvResults.length === 0 && movieResults.length === 0 && (
                        <Message color="#95a5a6" text="Nothing Found" />
                    )}
                </>
            )}
            </Container>
            );