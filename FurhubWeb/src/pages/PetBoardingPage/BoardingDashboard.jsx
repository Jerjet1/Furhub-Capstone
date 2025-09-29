// import React from "react";
// import { Link } from "react-router-dom";
// import { UserLayoutPage } from "../../components/Layout/UserLayoutPage";
// import { FiCalendar, FiMessageSquare, FiStar, FiUser, FiBarChart3, FiSettings } from "react-icons/fi";

// export const BoardingDashboard = () => {
//   const quickActions = [
//     {
//       title: "Bookings",
//       description: "Manage your pet boarding bookings",
//       icon: FiCalendar,
//       link: "/Petboarding/Bookings",
//       color: "bg-blue-500 hover:bg-blue-600",
//       iconColor: "text-blue-100"
//     },
//     {
//       title: "Reviews & Ratings",
//       description: "View and manage reviews",
//       icon: FiStar,
//       link: "/Petboarding/Reviews",
//       color: "bg-orange-500 hover:bg-orange-600",
//       iconColor: "text-orange-100"
//     },
//     {
//       title: "Chats",
//       description: "Communicate with pet owners",
//       icon: FiMessageSquare,
//       link: "/Petboarding/Chats",
//       color: "bg-green-500 hover:bg-green-600",
//       iconColor: "text-green-100"
//     },
//     {
//       title: "Facility Profile",
//       description: "Update your facility information",
//       icon: FiUser,
//       link: "/Petboarding/FacilityProfile",
//       color: "bg-purple-500 hover:bg-purple-600",
//       iconColor: "text-purple-100"
//     },
//     {
//       title: "Reports",
//       description: "View analytics and reports",
//       icon: FiBarChart3,
//       link: "/Petboarding/Reports",
//       color: "bg-indigo-500 hover:bg-indigo-600",
//       iconColor: "text-indigo-100"
//     },
//     {
//       title: "Settings",
//       description: "Account and system settings",
//       icon: FiSettings,
//       link: "/Petboarding/Settings",
//       color: "bg-gray-500 hover:bg-gray-600",
//       iconColor: "text-gray-100"
//     }
//   ];

//   return (
//     <UserLayoutPage>
//       <div className="w-full h-full bg-amber-50 p-6">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
//           <p className="text-gray-600">Welcome to your pet boarding management center</p>
//         </div>

//         {/* Quick Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//           <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Active Bookings</p>
//                 <p className="text-2xl font-bold text-gray-900">12</p>
//               </div>
//               <div className="bg-blue-100 p-3 rounded-full">
//                 <FiCalendar className="w-6 h-6 text-blue-600" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Average Rating</p>
//                 <p className="text-2xl font-bold text-gray-900">4.8</p>
//               </div>
//               <div className="bg-orange-100 p-3 rounded-full">
//                 <FiStar className="w-6 h-6 text-orange-600" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">New Messages</p>
//                 <p className="text-2xl font-bold text-gray-900">5</p>
//               </div>
//               <div className="bg-green-100 p-3 rounded-full">
//                 <FiMessageSquare className="w-6 h-6 text-green-600" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">This Month</p>
//                 <p className="text-2xl font-bold text-gray-900">28</p>
//                 <p className="text-xs text-gray-500">bookings</p>
//               </div>
//               <div className="bg-purple-100 p-3 rounded-full">
//                 <FiBarChart3 className="w-6 h-6 text-purple-600" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Quick Actions */}
//         <div className="mb-8">
//           <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {quickActions.map((action, index) => {
//               const IconComponent = action.icon;
//               return (
//                 <Link
//                   key={index}
//                   to={action.link}
//                   className="group block bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 hover:scale-105"
//                 >
//                   <div className="flex items-start space-x-4">
//                     <div className={`${action.color} p-3 rounded-lg group-hover:scale-110 transition-transform duration-200`}>
//                       <IconComponent className={`w-6 h-6 ${action.iconColor}`} />
//                     </div>
//                     <div className="flex-1">
//                       <h3 className="text-lg font-semibold text-gray-800 group-hover:text-gray-900">
//                         {action.title}
//                       </h3>
//                       <p className="text-sm text-gray-600 mt-1">
//                         {action.description}
//                       </p>
//                     </div>
//                   </div>
//                 </Link>
//               );
//             })}
//           </div>
//         </div>

//         {/* Recent Activity */}
//         <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
//           <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
//           <div className="space-y-4">
//             <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
//               <div className="bg-green-100 p-2 rounded-full">
//                 <FiCalendar className="w-4 h-4 text-green-600" />
//               </div>
//               <div className="flex-1">
//                 <p className="text-sm font-medium text-gray-800">New booking received</p>
//                 <p className="text-xs text-gray-500">2 hours ago</p>
//               </div>
//             </div>
            
//             <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
//               <div className="bg-orange-100 p-2 rounded-full">
//                 <FiStar className="w-4 h-4 text-orange-600" />
//               </div>
//               <div className="flex-1">
//                 <p className="text-sm font-medium text-gray-800">New review received</p>
//                 <p className="text-xs text-gray-500">4 hours ago</p>
//               </div>
//             </div>
            
//             <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
//               <div className="bg-blue-100 p-2 rounded-full">
//                 <FiMessageSquare className="w-4 h-4 text-blue-600" />
//               </div>
//               <div className="flex-1">
//                 <p className="text-sm font-medium text-gray-800">New message from Sarah Johnson</p>
//                 <p className="text-xs text-gray-500">6 hours ago</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </UserLayoutPage>
//   );
// };
