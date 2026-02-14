
import { ReactElement, useEffect, useState } from "react";
import { FaExpandAlt,FaTrash} from "react-icons/fa";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Column } from "react-table";
import TableHOC from "../components/admin/TableHOC";
import { Skeleton } from "../components/loader";
import { useMyOrdersQuery,useAllOrdersQuery,useCancleOrderMutation} from "../redux/api/orderAPI";
import { RootState } from "../redux/store";
import { CustomError } from "../types/api-types";
import { Link } from "react-router-dom";

type DataType = {
  _id: string;
  ProductName:string;
  amount: number;
  quantity: number;
  discount: number;
  status: ReactElement;
};


const column: Column<DataType>[] = [
  {
    Header: "ID",
    accessor: "_id",
  },
  {
    Header: "ProductName",
    accessor: "ProductName",
  },
  {
    Header: "Quantity",
    accessor: "quantity",
  },
  {
    Header: "Discount",
    accessor: "discount",
  },
  {
    Header: "Amount",
    accessor: "amount",
  },
  {
    Header: "Status",
    accessor: "status",
  },
];

const Orders = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);
 const isAdmin = user?.role === "admin";
    const {
    data: allOrderData,
    isError: isOrderError,
    error: allOrderError,
    } = useAllOrdersQuery(user?._id!, {
      skip: !isAdmin,
    });

  const { isLoading, data, isError, error } = useMyOrdersQuery(user?._id!);
  const [cancleOrder] = useCancleOrderMutation()
 
  const cancelHandler = async (id: string) => {
  try {
    const res = await cancleOrder({
      userId: user?._id!,
      orderId: id
    }).unwrap(); // unwrap helps get direct data or throw error
    
    toast.success(res.message);
  } catch (err: any) {
    toast.error(err?.data?.message || "Failed to cancel order");
  }
  console.log("order cancle",id)
};

  const [rows, setRows] = useState<DataType[]>([]);

  if (isError) {
    const err = error as CustomError;
    toast.error(err.data.message);
  }
  if(isOrderError){
    const err = allOrderError as CustomError;
    toast.error(err.data.message);
  }

  useEffect(() => {
    if (allOrderData)
      setRows(
        allOrderData.orders.map((i) => ({
          _id:i._id,
          ProductName: i.orderItems[0].ProductName,
          amount: i.total,
          discount: i.discount,
          quantity: i.orderItems.length,
          status: (
            <span
              className={
                i.status === "Processing"
                  ? "red"
                  : i.status === "Shipped"
                  ? "green"
                  : "purple"
              }
            >
              {i.status}
            </span>
          ),
        }))
      );
  }, [allOrderData]);

  const Table = TableHOC<DataType>(
    column,
    rows,
    "dashboard-product-box",
    "Orders",
    rows.length > 6
  )();
  return (
    <div className="container orders-page">
      <h1>My Orders</h1>
      {isLoading ? (
        <Skeleton length={20} />
      ) : user?.role === "admin" ? (
        Table
      ) : (
        <div className="user-orders-list">
  {data?.orders.length! > 0 ? (
    data?.orders.map((order) => (
      <div key={order._id} className="order-card">
        
        {/* Delete Button */}
        <button className="delete-btn" onClick={() => cancelHandler(order._id)}>
          <FaTrash />
        </button>

        {/* Product Image */}
        <div className="image-container">
          <img 
            src={`${order.orderItems[0].ProductImage}`} 
            alt={order.orderItems[0].ProductName} 
          />
        </div>
        
        {/* Content Area */}
        <div className="order-info">
          <div className="top-info">
            <h4>{order.orderItems[0].ProductName}</h4>
          </div>

          {/* Conditional Discount Badge */}
          {order.discount > 0 && (
            <span className="discount-tag">-{order.discount} OFF</span>
          )}
          
          <div className="bottom-info">
            <span className="price">₹{order.total}</span>
            <span className={`status-badge ${order.status}`}>
              {order.status}
            </span>
          </div>

          <Link to={`/product/${
                  typeof order.orderItems[0]?.productId !== "string"
                    ? (order.orderItems[0].productId as any)._id
                    : order.orderItems[0]?.productId
                }`} className="details-link detail-link-text">
          
             <FaExpandAlt /> <span> View Order </span>
          </Link>
          
          
        </div>
      </div>
    ))
  ) : (
    <div className="no-orders">No orders found. Start shopping!</div>
  )}
</div>
      )}
    </div>
  );
};

export default Orders