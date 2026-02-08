import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { DoughnutChart, PieChart } from "../../../components/admin/Charts";
import { Skeleton } from "../../../components/loader";
import { usePieQuery } from "../../../redux/api/dashboardAPI";
import { RootState } from "../../../redux/store";

const PieCharts = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);

  const { isLoading, data, isError } = usePieQuery(user?._id!);

  const order = data?.charts.orderFullfillment!;
  const categories = data?.charts.productCategories!;
  const stock = data?.charts.stockAvailablity!;
  const revenue = data?.charts.revenueDistribution!;
  const ageGroup = data?.charts.usersAgeGroup!;
  const adminCustomer = data?.charts.adminCustomer!;

  if (isError) return <Navigate to={"/admin/dashboard"} />;

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="chart-container">
        <h1>Pie & Doughnut Charts</h1>

        {isLoading ? (
          <Skeleton length={20} />
        ) : (
          <>
            <section>
              <div>
                <PieChart
                  labels={["Processing", "Shipped", "Delivered"]}
                  data={[order.processing, order.shipped, order.delivered]}
                  backgroundColor={[
                    `rgb(0 198 202)`,
                    `hsl(110,80%, 50%)`,
                    `rgb(255, 140, 0)`,
                  ]}
                  offset={[0, 0, 50]}
                />
              </div>
              <h2>Order Fulfillment Ratio</h2>
            </section>

            <section>
              <div>
                <DoughnutChart
                  labels={categories.map((i) => Object.keys(i)[0])}
                  data={categories.map((i) => Object.values(i)[0])}
                  backgroundColor={categories.map(
                    (i) =>
                      `hsl(${Object.values(i)[0] * 8}, ${
                        Object.values(i)[0]
                      }%, 50%)`
                  )}
                  legends={false}
                  offset={[0, 0, 0, 80]}
                />
              </div>
              <h2>Product Categories Ratio</h2>
            </section>

            <section>
              <div>
                <DoughnutChart
                  labels={["In Stock", "Out Of Stock"]}
                  data={[stock.inStock, stock.outOfStock]}
                  backgroundColor={["hsl(30, 88%, 47%)", "rgb(53, 162, 255)"]}
                  legends={false}
                  offset={[0, 80]}
                  cutout={"70%"}
                />
              </div>
              <h2> Stock Availability</h2>
            </section>

            <section>
              <div>
                <DoughnutChart
                  labels={[
                    "Marketing Cost",
                    "Discount",
                    "Burnt",
                    "Production Cost",
                    "Net Margin",
                  ]}
                  data={[
                    revenue.marketingCost,
                    revenue.discount,
                    revenue.burnt,
                    revenue.productionCost,
                    revenue.netMargin,
                  ]}
                  backgroundColor={[
                    "hsl(156, 84%, 49%)",
                    "hsl(27, 98%, 57%)",
                    "rgb(255, 140, 0)",
                    "#c2185b",
                    "rgb(0 198 202)",
                  ]}
                  legends={false}
                  offset={[20, 30, 20, 30, 80]}
                />
              </div>
              <h2>Revenue Distribution</h2>
            </section>

            <section>
              <div>
                <PieChart
                  labels={[
                    "Teenager(Below 20)",
                    "Adult (20-40)",
                    "Older (above 40)",
                  ]}
                  data={[ageGroup.teen, ageGroup.adult, ageGroup.old]}
                  backgroundColor={[
                    "#1ABC9C",
                   "#F39C12",
                    "#8E44AD",
                  ]}
                  offset={[0, 0, 50]}
                />
              </div>
              <h2>Users Age Group</h2>
            </section>

            <section>
              <div>
                <DoughnutChart
                  labels={["Admin", "Customers"]}
                  data={[adminCustomer.admin, adminCustomer.customer]}
                  backgroundColor={[`hsl(335, 100%, 38%)`, "hsl(44, 98%, 50%)"]}
                  offset={[0, 50]}
                />
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default PieCharts;
