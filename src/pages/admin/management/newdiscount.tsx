import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { RootState} from "../../../redux/store";
import { useCouponMutation } from "../../../redux/api/paymentAPI";
import { MessageResponse } from "../../../types/api-types";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query/react";

const NewDiscount = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);
  const navigate = useNavigate();

  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const [trigger] = useCouponMutation();
  
  const [code, setCode] = useState("");
  const [amount, setAmount] = useState(0);

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const createcoupon=async () => {
      try {
    setBtnLoading(true);
      
      const res = await trigger({ code, amount,userId:user?._id! })
      if ("data" in res) {
        setAmount(0);
        setCode("");
        toast.success(res.data.message);
        navigate("/admin/discount");
      }else{
        const error = res.error as FetchBaseQueryError;
        console.log("err:",res.error)
        const message = (error.data as MessageResponse)?.message || "Error";
        toast.error(message);
      }
    } catch {
       toast.error("Something went wrong");
    } finally {
      setBtnLoading(false);
    }
    }
    createcoupon()
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <div className="main-div">
        <h2>New Coupon</h2>
        <main className="create-coupon">
        <article>
          <form onSubmit={submitHandler}>
            
            <div>
              <label>Name</label>
              <input
                type="text"
                placeholder="Coupon Code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>

            <div>
              <label>Price</label>
              <input
                type="text"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </div>

            <button disabled={btnLoading} type="submit">
              Create
            </button>
          </form>
        </article>
      </main>
      </div>
    </div>
  );
};

export default NewDiscount;
