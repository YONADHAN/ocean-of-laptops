// import React from "react";
// import { Laptop, ShoppingCart, DollarSign, TrendingUp } from "lucide-react";
// import StatCard from "./StatCard";
// import LineChart from "./LineChart";
// import MetricCard from "./MetricCard";
// import CircularProgress from "./CircularProgress";
// import CategorySales from "./CategorySales";

// const Dashboard = () => {
//   const salesData = {
//     labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
//     datasets: [
//       {
//         label: "Total Sales",
//         data: [12000, 19000, 15000, 22000, 18000, 24000],
//         borderColor: "rgb(16, 185, 129)",
//         tension: 0.4,
//       },
//     ],
//   };

//   const metricData = {
//     labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
//     datasets: [
//       {
//         data: [65, 75, 70, 80, 75, 85],
//         borderColor: "rgb(59, 130, 246)",
//         backgroundColor: "rgba(59, 130, 246, 0.1)",
//         fill: true,
//         tension: 0.4,
//       },
//     ],
//   };

//   const categorySalesData = {
//     labels: ["Office", "Gaming", "Student", "Business"],
//     datasets: [
//       {
//         label: "Sales ($)",
//         data: [12000, 19000, 15000, 22000],
//         backgroundColor: [
//           "rgba(255, 99, 132, 0.6)",
//           "rgba(54, 162, 235, 0.6)",
//           "rgba(255, 206, 86, 0.6)",
//           "rgba(75, 192, 192, 0.6)",
//         ],
//       },
//     ],
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center ">
//         <h1 className="text-2xl font-semibold">
//           Welcome to OceanOfLaptops Dashboard
//         </h1>
//         <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors ">
//           Generate Report
//         </button>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         <StatCard
//           title="Total Sales"
//           value="110,000"
//           percentage={12.5}
//           icon={DollarSign}
//           color="green"
//         />
//         <StatCard
//           title="Laptops Sold"
//           value="387"
//           percentage={8.2}
//           icon={Laptop}
//           color="blue"
//         />
//         <StatCard
//           title="New Orders"
//           value="161"
//           percentage={-3.4}
//           icon={ShoppingCart}
//           color="red"
//         />
//         <StatCard
//           title="Revenue Growth"
//           value="23.1%"
//           percentage={15.8}
//           icon={TrendingUp}
//           color="orange"
//         />
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
//         <div className="lg:col-span-2">
//           <LineChart data={salesData} title="Monthly Sales Analytics" />
//         </div>
//         <div className="space-y-4">
//           <MetricCard
//             title="Website Visitors"
//             value="33,956"
//             percentage={42.12}
//             data={metricData}
//           />
//           <MetricCard
//             title="Conversion Rate"
//             value="5.36%"
//             percentage={8.12}
//             data={metricData}
//           />
//         </div>
//       </div>

//       <div className="bg-white p-6 rounded-xl shadow-sm">
//         <h2 className="text-lg font-semibold mb-4">Performance Metrics</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <CircularProgress
//             value={45.32}
//             label="Customer Satisfaction"
//             color="blue"
//           />
//           <CircularProgress
//             value={72.23}
//             label="On-time Delivery"
//             color="orange"
//           />
//         </div>
//       </div>

//       <div className="bg-white p-6 rounded-xl shadow-sm">
//         <h2 className="text-lg font-semibold mb-4">Category-wise Sales</h2>
//         <CategorySales data={categorySalesData} />
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
