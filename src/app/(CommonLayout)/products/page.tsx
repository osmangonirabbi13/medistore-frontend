import { productService } from "@/services/Products/products.service";


const ProductPage = async () => {

    const data = await productService.getAllProduct()

    console.log(data);
    return (
        <div>
            
        </div>
    );
};

export default ProductPage;