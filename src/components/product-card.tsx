import { FaExpandAlt, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { CartItem } from "../types/types";
import { transformImage } from "../utils/features";

type ProductsProps = {
  productId: string;
  ProductImage: {
    url: string;
    public_id: string;
  }[];
  ProductName: string;
  price: number;
  stock: number;
  handler: (cartItem: CartItem) => string | undefined;
};

const ProductCard = ({
  productId,
  price,
  ProductName,
  ProductImage,
  stock,
  handler,
}: ProductsProps) => {
  console.log(ProductImage,ProductName);
  return (
    <div className="product-card">
      <img src={transformImage(ProductImage?.[0]?.url, 400)} alt={ProductName} />
      
      <p>{ProductName || "productName"}</p>
      <span>₹{price}</span>

      <div>
        <button
          onClick={() =>
            handler({
              productId,
              price,
              ProductName,
              ProductImage: ProductImage[0].url,
              stock,
              quantity: 1,
            })
          }
        >
          <FaPlus />
        </button>

        <Link to={`/product/${productId}`}>
          <FaExpandAlt />
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
