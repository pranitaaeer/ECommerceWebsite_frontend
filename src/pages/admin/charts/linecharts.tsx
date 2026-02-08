import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { LineChart } from "../../../components/admin/Charts";
import { Skeleton } from "../../../components/loader";
import { useLineQuery } from "../../../redux/api/dashboardAPI";
import { RootState } from "../../../redux/store";
import { CustomError } from "../../../types/api-types";
import { getLastMonths } from "../../../utils/features";

const { last12Months: months } = getLastMonths();

const Linecharts = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);

  const { isLoading, data, error, isError } = useLineQuery(user?._id!);

  const products = data?.charts.products || [];
  const users = data?.charts.users || [];
  const revenue = data?.charts.revenue || [];
  const discount = data?.charts.discount || [];

  if (isError) {
    const err = error as CustomError;
    toast.error(err.data.message);
  }

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="chart-container">
        <h1>Line Charts</h1>

        {isLoading ? (
          <Skeleton length={15} />
        ) : (
          <>
            <section>
              <LineChart
                data={users}
                label="Users"
                borderColor="rgb(0 198 202)"
                labels={months}
                backgroundColor="rgb(0 198 202)"
              />
              <h2>Active Users</h2>
            </section>

            <section>
              <LineChart
                data={products}
                backgroundColor={"#f06292"}
                borderColor={"#f06292"}
                labels={months}
                label="Products"
              />
              <h2>Total Products (SKU)</h2>
            </section>

            <section>
              <LineChart
                data={revenue}
                backgroundColor={"#c2185b"}
                borderColor={"#c2185b"}
                label="Revenue"
                labels={months}
              />
              <h2>Total Revenue </h2>
            </section>

            <section>
              <LineChart
                data={discount}
                backgroundColor={"rgb(255, 140, 0)"}
                borderColor={"rgb(255, 140, 0)"}
                label="Discount"
                labels={months}
              />
              <h2>Discount Allotted </h2>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default Linecharts;
