import { Column } from "react-table";
import TableHOC from "./TableHOC";

interface DataType {
  _id: string;
  quantity: number;
  discount: number;
  amount: number;
  status: string;
}

const columns: Column<DataType>[] = [
  {
    Header: "Id",
    accessor: "_id",
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
    Cell: ({ value }) => {
      let color = "";

      if (value === "Processing") color ="rgb(0,198,202)";
      else if (value === "Shipped") color = "hsl(110,80%,50%)";
      else if (value === "Delivered") color = "rgb(255, 140, 0)";

      return <span style={{ color }}>{value}</span>;
    },
  },
];

const DashboardTable = ({ data = [] }: { data: DataType[] }) => {
  return TableHOC<DataType>(
    columns,
    data,
    "transaction-box",
    "Top Transaction"
  )();
};

export default DashboardTable;
