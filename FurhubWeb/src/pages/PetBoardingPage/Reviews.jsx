// import React, { useState } from "react";
// import { UserLayoutPage } from "../../components/Layout/UserLayoutPage";
// import { MyReviews } from "../../components/Reviews/MyReviews";
// import { BrowseReviews } from "../../components/Reviews/BrowseReviews";

// export const Reviews = () => {
//   const [activeTab, setActiveTab] = useState("my-reviews");

//   const tabs = [
//     { id: "my-reviews", label: "My Reviews" },
//     { id: "browse-reviews", label: "Browse Reviews" },
//   ];

//   return (
//     <UserLayoutPage>
//       <div className="w-full h-full bg-amber-50 p-6">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-800 mb-2">Reviews & Ratings</h1>
//           <p className="text-gray-600">Manage and browse pet boarding reviews</p>
//         </div>

//         {/* Tab Navigation */}
//         <div className="mb-6">
//           <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm">
//             {tabs.map((tab) => (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id)}
//                 className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
//                   activeTab === tab.id
//                     ? "bg-orange-100 text-orange-600 border border-orange-200"
//                     : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
//                 }`}
//               >
//                 {tab.label}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Tab Content */}
//         <div className="bg-white rounded-lg shadow-sm">
//           {activeTab === "my-reviews" && <MyReviews />}
//           {activeTab === "browse-reviews" && <BrowseReviews />}
//         </div>
//       </div>
//     </UserLayoutPage>
//   );
// };



