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


/* category bar - navi bar */

{categories.map(name => (
    <Category key={name} activeClassName="active" exact={name === "All"} to={name === "All" ? "/" : `/${name}`}>{name}</Category>
))}                             //activeClassName = the class to give the element when it is active


/* destructuring props */
const NewsItem = ({ article }) => {
    const { title, description, url, urlToImage } = article; }


/* usePromise */

export default function usePromise(promiseCreater, deps) {
    const [loading, setLoading] = useState(false);
    const [resolved, setResolved] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const process = async () => {
            setLoading(true);
            try {
                const resolved = await promiseCreater();
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