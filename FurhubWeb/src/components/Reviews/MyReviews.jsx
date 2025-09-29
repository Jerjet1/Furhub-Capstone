// import React, { useState } from "react";
// import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
// import { StarRating } from "./StarRating";
// import { WriteReviewModal } from "./WriteReviewModal";

// export const MyReviews = () => {
//   const [showWriteModal, setShowWriteModal] = useState(false);
//   const [reviews, setReviews] = useState([
//     {
//       id: 1,
//       reviewerName: "Sarah Johnson",
//       petName: "Max",
//       rating: 4.5,
//       date: "January 15, 2024",
//       provider: "Happy Paws Boarding",
//       reviewText: "Absolutely wonderful experience! The staff was incredibly caring and my dog Max came home happy and well-exercised. The facility was clean and the daily photo updates gave me peace of mind. Highly recommend!",
//       providerResponse: "Thank you so much Sarah! Max was a joy to have with us and we're thrilled you had such a positive experience."
//     },
//     {
//       id: 2,
//       reviewerName: "Michael Chen",
//       petName: "Luna",
//       rating: 4.0,
//       date: "January 12, 2024",
//       provider: "Paws & Play Pet Care",
//       reviewText: "Great service overall. Luna seemed happy when I picked her up. The staff was friendly and kept me updated throughout her stay. Would definitely use again.",
//       providerResponse: null
//     }
//   ]);

//   // Calculate statistics
//   const totalReviews = reviews.length;
//   const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;
//   const uniqueProviders = new Set(reviews.map(review => review.provider)).size;

//   const handleEditReview = (reviewId) => {
//     console.log("Edit review:", reviewId);
//     // TODO: Implement edit functionality
//   };

//   const handleDeleteReview = (reviewId) => {
//     console.log("Delete review:", reviewId);
//     // TODO: Implement delete functionality
//   };

//   const handleWriteReview = () => {
//     setShowWriteModal(true);
//   };

//   return (
//     <div className="p-6">
//       {/* Header with Write Review Button */}
//       <div className="flex justify-between items-start mb-8">
//         <div>
//           <h2 className="text-2xl font-bold text-gray-800 mb-2">My Reviews</h2>
//           <p className="text-gray-600">Manage your pet boarding reviews and ratings</p>
//         </div>
//         <button
//           onClick={handleWriteReview}
//           className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors duration-200"
//         >
//           <FiPlus className="w-5 h-5" />
//           <span>Write Review</span>
//         </button>
//       </div>

//       {/* Statistics Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//         <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
//           <h3 className="text-sm font-medium text-gray-600 mb-2">Total Reviews</h3>
//           <p className="text-3xl font-bold text-gray-800">{totalReviews}</p>
//           <p className="text-sm text-gray-500 mt-1">reviews written</p>
//         </div>
        
//         <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
//           <h3 className="text-sm font-medium text-gray-600 mb-2">Average Rating Given</h3>
//           <div className="flex items-center space-x-2 mb-1">
//             <p className="text-3xl font-bold text-orange-500">{averageRating.toFixed(1)}</p>
//           </div>
//           <p className="text-sm text-gray-500">out of 5 stars</p>
//         </div>
        
//         <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
//           <h3 className="text-sm font-medium text-gray-600 mb-2">Boarding Providers</h3>
//           <p className="text-3xl font-bold text-blue-500">{uniqueProviders}</p>
//           <p className="text-sm text-gray-500 mt-1">providers reviewed</p>
//         </div>
//       </div>

//       {/* Reviews List */}
//       <div>
//         <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Reviews</h3>
        
//         {reviews.length === 0 ? (
//           <div className="text-center py-12">
//             <p className="text-gray-500 mb-4">You haven't written any reviews yet.</p>
//             <button
//               onClick={handleWriteReview}
//               className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
//             >
//               Write Your First Review
//             </button>
//           </div>
//         ) : (
//           <div className="space-y-6">
//             {reviews.map((review) => (
//               <div key={review.id} className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
//                 <div className="flex justify-between items-start mb-4">
//                   <div className="flex items-center space-x-3">
//                     <h4 className="font-semibold text-gray-800">{review.reviewerName}</h4>
//                     <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full">
//                       Pet: {review.petName}
//                     </span>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <button
//                       onClick={() => handleEditReview(review.id)}
//                       className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors duration-200"
//                     >
//                       <FiEdit2 className="w-4 h-4" />
//                     </button>
//                     <button
//                       onClick={() => handleDeleteReview(review.id)}
//                       className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
//                     >
//                       <FiTrash2 className="w-4 h-4" />
//                     </button>
//                   </div>
//                 </div>

//                 <div className="flex items-center space-x-4 mb-3">
//                   <StarRating rating={review.rating} size="md" />
//                   <span className="text-gray-500 text-sm">{review.date}</span>
//                 </div>

//                 <div className="mb-4">
//                   <a 
//                     href="#" 
//                     className="text-blue-600 hover:text-blue-800 font-medium"
//                   >
//                     {review.provider}
//                   </a>
//                 </div>

//                 <p className="text-gray-700 mb-4 leading-relaxed">{review.reviewText}</p>

//                 {review.providerResponse && (
//                   <div className="bg-amber-50 border-l-4 border-orange-200 p-4 rounded-r-lg">
//                     <div className="flex items-center space-x-2 mb-2">
//                       <span className="font-semibold text-gray-800">Provider Response</span>
//                       <span className="text-orange-500">💬</span>
//                     </div>
//                     <p className="text-gray-700">{review.providerResponse}</p>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Write Review Modal */}
//       {showWriteModal && (
//         <WriteReviewModal
//           isOpen={showWriteModal}
//           onClose={() => setShowWriteModal(false)}
//           onSubmit={(reviewData) => {
//             console.log("New review:", reviewData);
//             // TODO: Add new review to state
//             setShowWriteModal(false);
//           }}
//         />
//       )}
//     </div>
//   );
// };



