// import React from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   Package, CreditCard, MapPin, Bell, Eye,
//   Heart, AlertCircle, ChevronRight, ShoppingCart
// } from 'lucide-react';

// const EcommerceDashboard = () => {
//   const recentOrders = [
//     {
//       id: "ORD-2024-001",
//       date: "2024-12-19",
//       status: "In Transit",
//       total: "₹2,499",
//       items: 2
//     },
//     {
//       id: "ORD-2024-002",
//       date: "2024-12-18",
//       status: "Delivered",
//       total: "₹1,899",
//       items: 1
//     },
//     {
//       id: "ORD-2024-003",
//       date: "2024-12-17",
//       status: "Processing",
//       total: "₹3,299",
//       items: 3
//     }
//   ];

//   const recentlyViewed = [
//     {
//       id: 1,
//       name: "Wireless Earbuds",
//       price: "₹1,499",
//       image: "/api/placeholder/80/80"
//     },
//     {
//       id: 2,
//       name: "Smart Watch",
//       price: "₹2,999",
//       image: "/api/placeholder/80/80"
//     }
//   ];

//   const notifications = [
//     {
//       id: 1,
//       type: "order",
//       message: "Your order ORD-2024-001 has been shipped",
//       time: "2 hours ago"
//     },
//     {
//       id: 2,
//       type: "promotion",
//       message: "Weekend sale! Get 20% off on electronics",
//       time: "5 hours ago"
//     }
//   ];

//   return (
//     <div className="p-6 max-w-7xl mx-auto">
//       {/* Account Alerts */}
//       <div className="mb-6 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
//         <div className="flex items-center">
//           <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
//           <span className="text-yellow-800">
//             Complete your profile to get personalized recommendations
//           </span>
//           <Button variant="link" className="ml-auto">
//             Complete Profile
//           </Button>
//         </div>
//       </div>

//       {/* Quick Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
//             <Package className="h-4 w-4 text-gray-500" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">154</div>
//             <p className="text-xs text-gray-500">12 orders this month</p>
//           </CardContent>
//         </Card>
        
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
//             <Package className="h-4 w-4 text-blue-500" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">5</div>
//             <p className="text-xs text-gray-500">2 arriving tomorrow</p>
//           </CardContent>
//         </Card>
        
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium">Cart Value</CardTitle>
//             <ShoppingCart className="h-4 w-4 text-green-500" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">₹4,299</div>
//             <p className="text-xs text-gray-500">3 items in cart</p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Main Content Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {/* Recent Orders */}
//         <div className="md:col-span-2">
//           <Card>
//             <CardHeader>
//               <div className="flex justify-between items-center">
//                 <CardTitle>Recent Orders</CardTitle>
//                 <Button variant="ghost" size="sm">View All</Button>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 {recentOrders.map(order => (
//                   <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
//                     <div>
//                       <h4 className="font-medium">{order.id}</h4>
//                       <p className="text-sm text-gray-500">{order.date}</p>
//                     </div>
//                     <div className="text-right">
//                       <Badge className={
//                         order.status === "Delivered" ? "bg-green-100 text-green-800" :
//                         order.status === "In Transit" ? "bg-blue-100 text-blue-800" :
//                         "bg-yellow-100 text-yellow-800"
//                       }>
//                         {order.status}
//                       </Badge>
//                       <p className="mt-1 font-medium">{order.total}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Right Sidebar */}
//         <div className="space-y-6">
//           {/* Quick Links */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Quick Actions</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-2">
//               <Button variant="outline" className="w-full justify-start">
//                 <MapPin className="mr-2 h-4 w-4" />
//                 Track Orders
//               </Button>
//               <Button variant="outline" className="w-full justify-start">
//                 <Heart className="mr-2 h-4 w-4" />
//                 Wishlist (12)
//               </Button>
//               <Button variant="outline" className="w-full justify-start">
//                 <CreditCard className="mr-2 h-4 w-4" />
//                 Saved Cards
//               </Button>
//             </CardContent>
//           </Card>

//           {/* Recently Viewed */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Recently Viewed</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 {recentlyViewed.map(product => (
//                   <div key={product.id} className="flex items-center space-x-4">
//                     <img
//                       src={product.image}
//                       alt={product.name}
//                       className="w-16 h-16 rounded-lg object-cover"
//                     />
//                     <div>
//                       <h4 className="font-medium">{product.name}</h4>
//                       <p className="text-sm text-gray-500">{product.price}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>

//           {/* Notifications */}
//           <Card>
//             <CardHeader>
//               <div className="flex justify-between items-center">
//                 <CardTitle>Notifications</CardTitle>
//                 <Badge>2 New</Badge>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 {notifications.map(notification => (
//                   <div key={notification.id} className="flex items-start space-x-3">
//                     <Bell className="h-5 w-5 text-gray-500 mt-1" />
//                     <div>
//                       <p className="text-sm">{notification.message}</p>
//                       <p className="text-xs text-gray-500">{notification.time}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EcommerceDashboard;

import React from 'react';

const Dashboard = () => {
  return (
    <div>
      Dashboard
      Dashboard
    </div>
  );
}

export default Dashboard;
