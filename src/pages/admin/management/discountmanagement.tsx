import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { Skeleton } from "../../../components/loader";
import { RootState} from "../../../redux/store";
import { useDeleteCouponMutation, useGetCouponQuery, useUpdateCouponMutation } from "../../../redux/api/paymentAPI";
import { MessageResponse } from "../../../types/api-types";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query/react";
import { CustomError } from "../../../types/api-types";

const DiscountManagement = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);
  const { id } = useParams();
  const navigate = useNavigate();
  const {isLoading,isError,data,error}=useGetCouponQuery({id:id!,userId:user?._id!})
  
  if (isError) {
    const err = error as CustomError;
    toast.error(err.data.message);
  }

  const [btnLoading, setBtnLoading] = useState<boolean>(false);

  const [code, setCode] = useState("");
  const [amount, setAmount] = useState(0);
  const [updateCoupon]=useUpdateCouponMutation()
  const [deleteCoupon]=useDeleteCouponMutation()
  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const updatecouponHandler=async () => {
      if(!code && !amount) return
      try {
       setBtnLoading(true);
       const res=await updateCoupon({code,amount,userId:user?._id!,id:id!})
       if("data" in res){
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
      } catch (error) {
       toast.error("Something went wrong");
       console.log(error) 
      }finally{
        setBtnLoading(false)
      }
    }
    updatecouponHandler()
    
  };

  useEffect(() => {
    if (data) {
      setCode(data.coupon.code);
      setAmount(data.coupon.amount);
    }
  }, [data]);

  const deleteHandler = async () => {
    try {
      setBtnLoading(true);
      const res=await deleteCoupon({id:id!,userId:user?._id!})
      if ("data" in res) {
        toast.success(res.data.message);
        navigate("/admin/discount");
      }else{
        const error = res.error as FetchBaseQueryError;
        console.log("err:",res.error)
        const message = (error.data as MessageResponse)?.message || "Error";
        toast.error(message);
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <div className="main-div">
        <h2>Manage</h2>
        <main className="create-coupon">
        {isLoading ? (
          <Skeleton length={20} />
        ) : (
          <>
            <article  >
              <button className="delete-btn" onClick={deleteHandler}>
                <FaTrash />
              </button>
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

                <button disabled={btnLoading} type="submit" className="update-btn">
                  Update
                </button>
              </form>
            </article>
          </>
        )}
      </main>
      </div>
    </div>
  );
};

export default DiscountManagement;
