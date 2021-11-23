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
                    <Redirect from="*" to="/" />
                </Switch>    
        </Router>
    )
};