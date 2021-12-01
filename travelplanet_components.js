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

export default DetailProductPage;
