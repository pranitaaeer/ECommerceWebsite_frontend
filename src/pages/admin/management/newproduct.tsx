import { useFileHandler } from "6pp";
import { FormEvent, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useNewProductMutation } from "../../../redux/api/productAPI";
import { RootState } from "../../../redux/store";
import { responseToast } from "../../../utils/features";

const NewProduct = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [name, setName] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [price, setPrice] = useState<number>(1000);
  const [stock, setStock] = useState<number>(1);
  const [description, setDescription] = useState<string>("");

  const [newProduct] = useNewProductMutation();
  const navigate = useNavigate();

  const photos = useFileHandler("multiple", 10, 5);

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if ([name,price,stock,category].some((elem) => !elem)) return;

      if (!photos.file || photos.file.length === 0) return;

      const formData = new FormData();

      formData.set("ProductName", name);
      formData.set("description", description);
      formData.set("price", price.toString());
      formData.set("stock", stock.toString());

      formData.set("category", category);

      photos.file.forEach((file) => {
        formData.append("ProductImage", file);
      });

      const res = await newProduct({ id: user?._id!, formData });

      responseToast(res, navigate, "/admin/product");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        <article>
          <form onSubmit={submitHandler}>
            <h2>New Product</h2>
            <div>
              <label>Name</label>
              <input
                required
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label>Description</label>
              <textarea
                required
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div>
              <label>Price</label>
              <input
                required
                type="text"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </div>
            <div>
              <label>Stock</label>
              <input
                required
                type="number"
                placeholder="Stock"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
              />
            </div>

            <div>
              <label>Category</label>
              <input
                required
                type="text"
                placeholder="eg. laptop, camera etc"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>

            <div>
              <label>Photos</label>
              <input
                required
                type="file"
                accept="image/*"
                multiple
                onChange={photos.changeHandler}
              />
            </div>

            {photos.error && <p>{photos.error}</p>}

            {/* {photos.preview &&
              photos.preview.map((img, i) => (
                <img key={i} src={img} alt="New Image" 
                 style={{ width: 50, height: 50, objectFit: "cover" }}
                />
              ))} */}

            <button disabled={isLoading} type="submit" className="create-btn">
              Create
            </button>
          </form>
        </article>
      </main>
    </div>
  );
};

export default NewProduct;
