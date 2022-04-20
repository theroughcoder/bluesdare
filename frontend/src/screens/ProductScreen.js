

import {useParams} from "react-router-dom";

function ProductScreen(){

const {slug} = useParams();
return(
    <>
        <h1>{slug}</h1>
    </>
)
}


export default ProductScreen;