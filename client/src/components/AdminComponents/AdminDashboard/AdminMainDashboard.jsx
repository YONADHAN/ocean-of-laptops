// import React, { useState, useEffect } from "react";
// import { axiosInstance } from "../../../api/axiosConfig";
// import { toast } from "sonner";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
//   AreaChart,
//   Area,
// } from "recharts";

// const AdminDashboard = () => {
//   const [reports, setReports] = useState({
//     categorySales: [],
//     brandSales: [],
//     salesTrends: [],
//     topProducts: [],
//     couponUsage: [{ totalOrders: 0, totalDiscount: 0, totalSales: 0 }],
//   });
//   const [interval, setInterval] = useState("day");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");

//   const formatCurrency = (value) => {
//     return new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//     }).format(value);
//   };

//   const COLORS = [
//     "#2563EB", // blue-600
//     "#3B82F6", // blue-500
//     "#60A5FA", // blue-400
//     "#93C5FD", // blue-300
//     "#BFDBFE", // blue-200
//     "#DBEAFE", // blue-100
//   ];

//   useEffect(() => {
//     const getReports = async () => {
//       try {
//         const response = await axiosInstance.post("/admin/dashboard", {
//           startDate,
//           endDate,
//           interval,
//         });
//         if (response.data.success) {
//           setReports(response.data.reports);
//         } else {
//           toast.error(response.data.message);
//         }
//       } catch (error) {
//         toast.error(error.message);
//       }
//     };
//     getReports();
//   }, [interval, startDate, endDate]);

//   return (
//     <div className="min-h-screen bg-gray-50 p-8">
//       <h1 className="text-4xl font-bold text-blue-600 mb-8">Admin Dashboard</h1>

//       {/* Date Range Selector */}
//       <div className="lg:flex justify-between items-center mb-8">
//         <select
//           className="bg-white border border-blue-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-600 "
//           value={interval}
//           onChange={(e) => setInterval(e.target.value)}
//         >
//           <option value="day">Day</option>
//           <option value="week">Week</option>
//           <option value="month">Month</option>
//           <option value="year">Year</option>
//         </select>
//         <div className="flex gap-4">
//           <div>
//             <p>Start Date : </p>
//             <input
//               type="date"
//               className="bg-white border border-blue-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-600 "
//               value={startDate}
//               onChange={(e) => setStartDate(e.target.value)}
//             />
//           </div>
//           <div>
//             <p>End Date : </p>
//             <input
//               type="date"
//               className="bg-white border border-blue-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-600"
//               value={endDate}
//               onChange={(e) => setEndDate(e.target.value)}
//             />
//           </div>
//         </div>
//       </div>

//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         <SummaryCard
//           title="Total Sales"
//           value={formatCurrency(reports.couponUsage[0].totalSales)}
//         />
//         <SummaryCard
//           title="Total Orders"
//           value={reports.couponUsage[0].totalOrders}
//         />
//         <SummaryCard
//           title="Total Discount"
//           value={formatCurrency(reports.couponUsage[0].totalDiscount)}
//         />
//         <SummaryCard
//           title="Avg. Order Value"
//           value={formatCurrency(
//             reports.couponUsage[0].totalSales /
//               reports.couponUsage[0].totalOrders
//           )}
//         />
//       </div>

//       {/* Charts */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         {/* Category Sales Chart */}
//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <h2 className="text-2xl font-semibold text-blue-600 mb-4">
//             Category Sales
//           </h2>
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={reports.categorySales}>
//               <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
//               <XAxis dataKey="_id" tick={{ fill: "#4B5563" }} />
//               <YAxis tick={{ fill: "#4B5563" }} />
//               <Tooltip
//                 contentStyle={{ backgroundColor: "#F3F4F6", border: "none" }}
//               />
//               <Legend />
//               <Bar dataKey="totalSales" fill="#3B82F6" name="Total Sales" />
//               <Bar dataKey="unitsSold" fill="#60A5FA" name="Units Sold" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Brand Sales Chart */}
//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <h2 className="text-2xl font-semibold text-blue-600 mb-4">
//             Brand Sales
//           </h2>
//           <ResponsiveContainer width="100%" height={300}>
//             <PieChart>
//               <Pie
//                 data={reports.brandSales}
//                 dataKey="totalSales"
//                 nameKey="_id"
//                 cx="50%"
//                 cy="50%"
//                 outerRadius={80}
//                 fill="#8884d8"
//                 label
//               >
//                 {reports.brandSales.map((entry, index) => (
//                   <Cell
//                     key={`cell-${index}`}
//                     fill={COLORS[index % COLORS.length]}
//                   />
//                 ))}
//               </Pie>
//               <Tooltip
//                 contentStyle={{ backgroundColor: "#F3F4F6", border: "none" }}
//               />
//               <Legend />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Sales Trends Chart */}
// <div className="bg-white p-6 rounded-lg shadow-md">
//   <h2 className="text-2xl font-semibold text-blue-600 mb-4">
//     Sales Trends
//   </h2>
//   <ResponsiveContainer width="100%" height={300}>
//     <AreaChart data={reports.salesTrends}>
//       <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
//       <XAxis dataKey="_id" tick={{ fill: "#4B5563" }} />
//       <YAxis tick={{ fill: "#4B5563" }} />
//       <Tooltip
//         contentStyle={{ backgroundColor: "#F3F4F6", border: "none" }}
//       />
//       <Legend />
//       <Area
//         type="monotone"
//         dataKey="totalSales"
//         stroke="#2563EB"
//         fill="#BFDBFE"
//         name="Total Sales"
//       />
//       <Area
//         type="monotone"
//         dataKey="totalOrders"
//         stroke="#60A5FA"
//         fill="#DBEAFE"
//         name="Total Orders"
//       />
//     </AreaChart>
//   </ResponsiveContainer>
// </div>

//         {/* Top Products Chart */}
//         {/* <div className="bg-white p-6 rounded-lg shadow-md">
//           <h2 className="text-2xl font-semibold text-blue-600 mb-4">Top Products</h2>
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={reports.topProducts} layout="vertical">
//               <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
//               <XAxis type="number" tick={{ fill: "#4B5563" }} />
//               <YAxis dataKey="_id" type="category" width={150} tick={{ fill: "#4B5563" }} />
//               <Tooltip contentStyle={{ backgroundColor: "#F3F4F6", border: "none" }} />
//               <Legend />
//               <Bar dataKey="totalSales" fill="#3B82F6" name="Total Sales" />
//               <Bar dataKey="unitsSold" fill="#60A5FA" name="Units Sold" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div> */}

//         {/* Top Products Chart */}
//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <h2 className="text-2xl font-semibold text-blue-600 mb-4">
//             Top Products
//           </h2>
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={reports.topProducts} layout="vertical">
//               <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
//               <XAxis
//                 type="number"
//                 tick={{ fill: "#4B5563" }}
//                 interval={0}
//                 tickCount={4}
//                 //domain={[0, "dataMax + 1000"]}
//               />
//               <YAxis
//                 dataKey="_id"
//                 type="category"
//                 width={150}
//                 tick={{ fill: "#4B5563" }}
//                 interval={0}
//               />
//               <Tooltip
//                 contentStyle={{ backgroundColor: "#F3F4F6", border: "none" }}
//               />
//               <Legend />
//               <Bar dataKey="totalSales" fill="#3B82F6" name="Total Sales" />
//               <Bar dataKey="unitsSold" fill="#60A5FA" name="Units Sold" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       {/* Coupon Usage */}
//       <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
//         <h2 className="text-2xl font-semibold text-blue-600 mb-4">
//           Coupon Usage
//         </h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div className="text-center">
//             <p className="text-gray-600">Total Orders</p>
//             <p className="text-3xl font-bold text-blue-500">
//               {reports.couponUsage[0].totalOrders}
//             </p>
//           </div>
//           <div className="text-center">
//             <p className="text-gray-600">Total Discount</p>
//             <p className="text-3xl font-bold text-blue-500">
//               {formatCurrency(reports.couponUsage[0].totalDiscount)}
//             </p>
//           </div>
//           <div className="text-center">
//             <p className="text-gray-600">Discount Rate</p>
//             <p className="text-3xl font-bold text-blue-500">
//               {(
//                 (reports.couponUsage[0].totalDiscount /
//                   reports.couponUsage[0].totalSales) *
//                 100
//               ).toFixed(2)}
//               %
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const SummaryCard = ({ title, value }) => (
//   <div className="bg-white p-6 rounded-lg shadow-md border border-blue-100">
//     <h3 className="text-lg font-semibold text-blue-600 mb-2">{title}</h3>
//     <p className="text-3xl font-bold text-blue-500">{value}</p>
//   </div>
// );

// export default AdminDashboard;







import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../../api/axiosConfig";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  LabelList
} from "recharts";

const AdminDashboard = () => {
  const [reports, setReports] = useState({
    categorySales: [],
    brandSales: [],
    salesTrends: [],
    topProducts: [],
    couponUsage: [{ totalOrders: 0, totalDiscount: 0, totalSales: 0 }],
  });
  const [interval, setInterval] = useState("day");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(value);
  };

  const COLORS = [
    "#2563EB", "#3B82F6", "#60A5FA",
    "#93C5FD", "#BFDBFE", "#DBEAFE"
  ];

  useEffect(() => {
    const getReports = async () => {
      try {
        if (new Date(startDate) > new Date(endDate)) {
          toast.error("Start date cannot be after the end date.");
          return;
        }
        const response = await axiosInstance.post("/admin/dashboard", {
          startDate,
          endDate,
          interval,
        });
        if (response.data.success) {
          setReports(response.data.reports);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };
    getReports();
  }, [interval, startDate, endDate]);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowSize.width < 768;
  const isTablet = windowSize.width >= 768 && windowSize.width < 1024;

  // Calculate average order value safely
  const avgOrderValue = (reports.couponUsage[0]?.totalOrders ?? 0) > 0
    ? (reports.couponUsage[0]?.totalSales ?? 0) / reports.couponUsage[0]?.totalOrders
    : 0;


  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <h1 className="text-3xl md:text-4xl font-bold text-blue-600 mb-6 md:mb-8">
        Admin Dashboard
      </h1>

      {/* Date Range Selector */}
      <div className="flex flex-col gap-4 mb-6 md:flex-row md:justify-between md:items-center md:mb-8">
        <select
          className="bg-white border border-blue-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-600"
          value={interval}
          onChange={(e) => setInterval(e.target.value)}
        >
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
          <option value="year">Year</option>
        </select>
        <div className="flex flex-col md:flex-row gap-2 md:gap-4">
          <div className="flex flex-col">
            <p className="text-sm">Start Date:</p>
            <input
              type="date"
              className="bg-white border border-blue-300 rounded-md px-2 py-1 md:px-4 md:py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-600"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <p className="text-sm">End Date:</p>
            <input
              type="date"
              className="bg-white border border-blue-300 rounded-md px-2 py-1 md:px-4 md:py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-600"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 md:gap-6 md:mb-8">
        <SummaryCard
          title="Total Sales"
          value={formatCurrency(reports.couponUsage[0]?.totalSales ?? 0)}
        />
        <SummaryCard
          title="Total Orders"
          value={reports.couponUsage[0]?.totalOrders ?? 0}
        />
        <SummaryCard
          title="Total Discount"
          value={formatCurrency(reports.couponUsage[0]?.totalDiscount ?? 0)}
        />
        <SummaryCard
          title="Avg. Order Value"
          value={formatCurrency(avgOrderValue)}
        />
      </div>


      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
        {/* Category Sales - Only show if data exists */}
        {reports.categorySales.length > 0 && (
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
            <h2 className="text-xl md:text-2xl font-semibold text-blue-600 mb-3 md:mb-4">
              Category Sales
            </h2>
            <ResponsiveContainer width="100%" height={isMobile ? 300 : 400}>
              <BarChart data={reports.categorySales} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <YAxis
                  dataKey="_id"
                  type="category"
                  width={isMobile ? 80 : 120}
                  tick={{ fill: "#4B5563", fontSize: isMobile ? 10 : 12 }}
                />
                <XAxis type="number" tick={{ fill: "#4B5563", fontSize: isMobile ? 10 : 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#F3F4F6",
                    border: "none",
                    fontSize: isMobile ? 12 : 14,
                  }}
                />
                <Legend wrapperStyle={{ paddingTop: isMobile ? 10 : 0 }} />
                <Bar dataKey="totalSales" fill="#3B82F6" name="Total Sales">
                  <LabelList dataKey="_id" position="insideLeft" fill="#000" fontSize={6} />
                </Bar>
                <Bar dataKey="unitsSold" fill="#60A5FA" name="Units Sold" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Brand Sales - Only show if data exists */}
        {reports.brandSales.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-blue-600 mb-4">
              Brand Sales
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={reports.brandSales}
                  dataKey="totalSales"
                  nameKey="_id"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                >
                  {reports.brandSales.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#F3F4F6", border: "none" }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Sales Trends - Only show if data exists */}
        {reports.salesTrends.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-blue-600 mb-4">
              Sales Trends
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={reports.salesTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="_id" tick={{ fill: "#4B5563" }} />
                <YAxis tick={{ fill: "#4B5563" }} />
                <Tooltip contentStyle={{ backgroundColor: "#F3F4F6", border: "none" }} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="totalSales"
                  stroke="#2563EB"
                  fill="#BFDBFE"
                  name="Total Sales"
                />
                <Area
                  type="monotone"
                  dataKey="totalOrders"
                  stroke="#60A5FA"
                  fill="#DBEAFE"
                  name="Total Orders"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Top Products - Only show if data exists */}
        {reports.topProducts.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-blue-600 mb-4">
              Top Products
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reports.topProducts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  type="number"
                  tick={{ fill: "#4B5563" }}
                  interval={0}
                  tickCount={4}
                />
                <YAxis
                  dataKey="_id"
                  type="category"
                  width={isMobile ? 100 : 150}
                  tick={{ fill: "#4B5563" }}
                  interval={0}
                  fontSize={isMobile ? 10 : 12}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#F3F4F6",
                    border: "none",
                    fontSize: isMobile ? 6 : 8
                  }}
                />
                <Legend />
                <Bar dataKey="totalSales" fill="#3B82F6" name="Total Sales">
                  <LabelList dataKey="_id" position="insideLeft" fill="#000" fontSize={6} />
                </Bar>
                <Bar dataKey="unitsSold" fill="#60A5FA" name="Units Sold" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Coupon Usage */}
      <div className="mt-6 md:mt-8 bg-white p-4 md:p-6 rounded-lg shadow-md">
        <h2 className="text-xl md:text-2xl font-semibold text-blue-600 mb-3 md:mb-4">
          Coupon Usage
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-4">
          <div className="text-center">
            <p className="text-gray-600">Total Orders</p>
            <p className="text-3xl font-bold text-blue-500">
              {reports.couponUsage[0]?.totalOrders ?? 0}
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-600">Total Discount</p>
            <p className="text-3xl font-bold text-blue-500">
              {formatCurrency(reports.couponUsage[0]?.totalDiscount ?? 0)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-600">Discount Rate</p>
            <p className="text-3xl font-bold text-blue-500">
              {reports.couponUsage[0]?.totalSales > 0
                ? (((reports.couponUsage[0]?.totalDiscount ?? 0) /
                  (reports.couponUsage[0]?.totalSales ?? 1)) *
                  100).toFixed(2)
                : "0"}%
            </p>

          </div>
        </div>
      </div>
    </div>
  );
};

const SummaryCard = ({ title, value }) => (
  <div className="bg-white p-6 rounded-lg shadow-md border border-blue-100">
    <h3 className="text-lg font-semibold text-blue-600 mb-2">{title}</h3>
    <p className="text-3xl font-bold text-blue-500">{value}</p>
  </div>
);

export default AdminDashboard;