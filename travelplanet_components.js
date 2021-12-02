/* fileUploads */
import Dropzone from "react-dropzone";
function FileUpload (props) {
    const [images, setImages] = useState([]);

    const dropHandler = (files) => {
        let formData = new FormData();
        const config = {
            header: { 'content-type': 'multipart/fomr-data'}
        }
        formData.append("file", files[0]);

        axios.post('/api/product/image', formData, config)                          //with drop off image,send image to backend
            .then(response => {
                if(response.data.success) {
                    // console.log(response.data)
                    setImages([...images, response.data.filePath]);
                    props.refreshFunction([...images, response.data.filePath])      // refreshFunction is a parent's function which gave in props
                } else {
                    alert('Failed to save the image.')
                }
            })
    }
    
    const deleteHandler = (image) => {
        const currentIndex = images.indexOf(image);
        let newImages = [...images];
        newImages.splice(currentIndex, 1);          // find a image and splice the image only
        setImages(newImages);                       // set new image array without the deleted image
        props.refreshFunction(newImages);
    }
}


/*  CartPage    */
// UserCardBlock
function UserCardBlock (props) {
    const renderCartImage = (images) => {
        if(images.length > 0) {
            let image = images[0];
            return `http://localhost:5000/${image}`;
    }}
    const renderItems = () => (
        props.products && props.products.map((product, index) => (                  // double checking = execute only when there is data
            <tr key={index}>
                <td>
                    <img style={{ width: '150px' }} alt="product" src={renderCartImage(product.images)} />
                </td>
                <td>
                    {product.title} 
                </td>
                <td>
                    {product.quantity} EA
                </td>
                <td>
                    $ {product.price}
                </td>
                <td>
                    <button onClick={() => props.removeItem(product._id)}>
                        Remove
                    </button>
                </td>
            </tr>
)))}
//  CartPage
function CartPage (props) {
    const dispatch = useDispatch();
    
    useEffect(() => {
        let cartItems = [];
        if(props.user.userData && props.user.userData.cart) {               // double checking data
            if(props.user.userData.cart.length > 0) {
                props.user.userData.cart.forEach(item => {
                    cartItems.push(item.id)
                })
                dispatch(getCartItems(cartItems, props.user.userData.cart))     // dispatch actions 
                    .then(response => { calculateTotal(response.payload) })
            }
        }
    }, [props.user.userData])
}


/*  DetailProductPage   */
function DetailProductPage (props) {
    const productId = props.match.params.productId;
    const  [product, setProduct] = useState({});
    useEffect(() => {
        axios.get(`/api/product/products_by_id?id=${productId}&type=single`)
            .then(response => {
                setProduct(response.data[0])                            // get data by using axios.get, then save it to local state.
            })
            .catch(err => alert(err))
    }, [])
    return (
        <div style={{ width: '100%', padding: '3rem 4rem'}}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <h1>{product.title}</h1>
            </div>
            <br />
            <Row gutter={[16, 16]}> 
                <Col lg={12} sm={24}>
                    {/* product image */}
                    <ProductImage detail={product} />               // give data as prop which I got it by axios.
                </Col>

                <Col lg={12} sm={24}>
                    {/* product info */}
                    <ProductInfo detail={product} />
                </Col>
            </Row>
        </div>
    )
};


/*  check box   */
function CheckBox (props) {
    const [checked, setChecked] = useState([]);
    const handleToggle = (value) => {
        const currentIndex = checked.indexOf(value);            // check the value is already there or not.
        const newChecked = [...checked];
        if (currentIndex === -1) {                              // value -1 means it is not selected yet.
            newChecked.push(value)
        } else {
            newChecked.splice(currentIndex, 1)
        }
        setChecked(newChecked);                                 // save it to local value.
        props.handleFilters(newChecked);
}}


/*  searchBox   */
function SearchBox (props) {
    const [searchTerm, setSearchTerm] = useState("")
    const searchHandler = (e) => {
        setSearchTerm(e.currentTarget.value);
        props.refreshFunction(e.currentTarget.value);           
    }
    return (
        <div>
            <Search placeholder="input search text" onChange={searchHandler} style={{ width: 200 }} value={searchTerm} />
        </div>
    )
}


/*  landingPage */
function LandingPage() {
    ... local states ...
    const [filters, setFilters] = useState({        // import { continents, price } from './Sections/Data';
        continents: [],
        price: [],
    });
    useEffect(() => {
        let body = {
            skip: Skip,                             // skip & limit decide how many products will be displayed
            limit: limit,
        }
        getProducts(body);                          // when page rendered. need to bring products lists.    
    }, [])
    const getProducts = (body) => {
        axios.post('/api/product/products', body)
                .then(response => {
                    if(response.data.success) {
                        if (body.loadMore) {
                            setProducts([...products, ...response.data.productInfo])        // save to local state
                        } else {
                            setProducts(response.data.productInfo)
                        }
                        setPostSize(response.data.postSize)                                 // also loca state
                    } else {
                        alert("failed to load products.")
     }})    }
    const loadMoreHandler = () => {
        let skip = Skip + limit;                            // new skip to load more.
        let body = {
            skip: skip,                                     // skip is new skip
            limit: limit,
            loadMore: true,
        };
        getProducts(body);                                  // then excute getProducts function again.
        setSkip(skip);                                      // save skip to local state 'skip'
    }
    const showFilteredResults = (filters) => {
        let body ={
            skip: 0,
            limit: limit,
            filters: filters,
        }
        getProducts(body);
        setSkip(0);
    }
    const updateSearchTerm = (newSearchTerm) => {
        let body = {
            skip: 0,
            limit: limit,
            filters: filters,
            searchTerm: newSearchTerm
        }
        setSkip(0);
        setSearchTerm(newSearchTerm);
        getProducts(body);                                  // for each actions. we make new 'body' by what I'm searching, then call getProducts function
    }
}


/* naviBar - rightMenu  */
function RightMenu(props) {
    const user = useSelector(state => state.user)   
    const logoutHandler = () => {                           // even logout action use axios.get 
      axios.get(`${USER_SERVER}/logout`).then(response => {
        if (response.status === 200) {
          props.history.push("/login");
        } else {
          alert('Log Out Failed')
    } }); }; 
    if (user.userData && !user.userData.isAuth) {           // return two different menu depends on the data.
      return (
        <Menu mode={props.mode}>
          <Menu.Item key="mail">
            <a href="/login">Signin</a>
          </Menu.Item>
          <Menu.Item key="app">
            <a href="/register">Signup</a>
          </Menu.Item>
        </Menu>
      )
    } else {
      return (
        <Menu mode={props.mode}>
          <Menu.Item key="history">
            <a href="/history">History</a>
          </Menu.Item>
            {/*... more menus ... */}
          <Menu.Item key="logout">
            <a onClick={logoutHandler}>Logout</a>
          </Menu.Item>
        </Menu>
      )
    }
  }


/*  uploadProductPage   */
function UploadProductPage(props) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [continent, setContinenet] = useState(1);
    const [image, setImage] = useState([]);

    const titleChangeHandler = (e) => {
        setTitle(e.currentTarget.value);
    }
    // ... each state element functions - same as title ...
    const updateImages = (newImages) => {
        setImage(newImages);
    }
    const submitHandler = (e) => {                                          // this uploadProduct function
        e.preventDefault();   
        if (!title || !description || !price || !continent || !image) {     // check if all the rquirements are filled
            return alert("You have to fill out all sections")
        }
                    // sending product data to server
        const body = {
            writer: props.user.userData._id,
            title: title,
            description: description,
            price: price,
            continents: continent,
            images: image,
        }
        Axios.post("/api/product", body)                                    // set body data and use axios.post to sent it to server
            .then(response => {
                if(response.data.success) {
                    alert("We uploaded your data successfully.")
                    props.history.push('/');
                } else {
                    alert("We failed to upload your product.")
                }
            })
    }
    return(
        <div style={{ maxWidth: '700px', margin: '2rem auto'}}>
            <Form onSubmit={submitHandler}>
                <FileUpload refreshFunction={updateImages} />
                <br />
                    {/* ... other tags of elements here ... */}
                <br />
                <select onChange={continentChangeHandler} value={continent}>
                    {Continents.map(item => (
                        <option key={item.key} value={item.key}>{item.value}</option>
                    ))}
                </select>
                <Button type="submit" onClick={submitHandler}>submit</Button>
            </Form>
        </div>       
    )
}