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