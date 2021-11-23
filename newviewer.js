/* styled-component */

overflow-x (or -y): atuo;       // auto will show an arrow on the window. none is no scroll/arrow
white-space: pre                // pre = only <br /> change the line. normal, nowrap, pre-wrap, pre-line, break-spaces
& + & { margin-left: 1rem; }        // set CSS for between element.

const NewsItemBlock = styled.div`
    .thumbnail {                    // select element className of thumbnail which is a children of NewItemBlock element
        margin-right: xxxx;
        img {                       // select img tag element under .thumbnail class element 
            display: block;
        }
    }
    .contents {}
`;


/* category bar - navi bar - ReactRouter */

{categories.map(name => (
    <Category key={name} activeClassName="active" exact={name === "All"} to={name === "All" ? "/" : `/${name}`}>{name}</Category>
))}                             //activeClassName = the class to give the element when it is active


/* destructuring props */
const NewsItem = ({ article }) => {
    const { title, description, url, urlToImage } = article; }


/* usePromise = custom hook */

export default function usePromise(promiseCreater, deps) {      // promiseCreater = create Promise, deps = condition of when I make Promise, initial value is empty array which means create Promise when it renders first
    const [loading, setLoading] = useState(false);
    const [resolved, setResolved] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const process = async () => {
            setLoading(true);
            try {
                const resolved = await promiseCreater();        // resolved = result
                setResolved(resolved);
            } catch(e) {
                setError(e);
            }
            setLoading(false);
        };
        process();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
    return [loading, resolved, error];
};

/* how to use usePromise */
const [loading, response, error] = usePromise(() => {
    const query = category === "All" ? "" : `&category=${category}`;
    return axios.get(`https://newsapi.org/v2/top-headlines?country=us${query}&apiKey=512f60d7572f4a1d8336a7d74b60cd1d`);
}, [category]);

if (loading) {
    return <NewsListBlock>Waiting ...</NewsListBlock>} 
if (!response) {
    return null;}
if (error) {
    return <NewsListBlock>Error !!!</NewsListBlock>}
const { articles } = response.data;
return (
    <NewsListBlock>
        {articles.map(article => (
            <NewsItem key={article.url} article={article} /> ))}
    </NewsListBlock>)


/* use match & params */
const NewsPage = ({ match }) => {
    const category = match.params.category || "All";
    return (
        <>
            <Categories />
            <NewsList category={category} />
        </>
    )
};