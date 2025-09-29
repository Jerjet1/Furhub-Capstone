// import React, { useState } from "react";
// import { FiSearch, FiFilter, FiBookmark } from "react-icons/fi";
// import { StarRating } from "./StarRating";

// export const BrowseReviews = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedRating, setSelectedRating] = useState("all");
//   const [selectedProvider, setSelectedProvider] = useState("all");

//   const reviews = [
//     {
//       id: 1,
//       reviewerName: "Sarah Johnson",
//       petName: "Max",
//       rating: 5,
//       date: "January 15, 2024",
//       provider: "Happy Paws Boarding",
//       reviewText: "Absolutely wonderful experience! The staff was incredibly caring and my dog Max came home happy and well-exercised. The facility was clean and the daily photo updates gave me peace of mind. Highly recommend!",
//       providerResponse: "Thank you so much Sarah! Max was a joy to have with us and we're thrilled you had such a positive experience."
//     },
//     {
//       id: 2,
//       reviewerName: "Michael Chen",
//       petName: "Luna",
//       rating: 4,
//       date: "January 12, 2024",
//       provider: "Paws & Play Pet Care",
//       reviewText: "Great service overall. Luna seemed happy when I picked her up. The staff was friendly and kept me updated throughout her stay. Would definitely use again.",
//       providerResponse: null
//     },
//     {
//       id: 3,
//       reviewerName: "Emily Rodriguez",
//       petName: "Buddy",
//       rating: 5,
//       date: "January 10, 2024",
//       provider: "Happy Paws Boarding",
//       reviewText: "Exceptional care! Buddy has separation anxiety but the staff was so patient and understanding. They sent me photos every day and he came home calm and relaxed.",
//       providerResponse: "We're so glad we could help Buddy feel comfortable! He's such a sweet boy."
//     },
//     {
//       id: 4,
//       reviewerName: "David Kim",
//       petName: "Whiskers",
//       rating: 4.5,
//       date: "January 8, 2024",
//       provider: "Furry Friends Pet Hotel",
//       reviewText: "Very professional service. Whiskers was well taken care of and the facility was spotless. The staff provided regular updates and photos. Highly recommend!",
//       providerResponse: "Thank you David! Whiskers was such a sweet cat and we enjoyed having her stay with us."
//     },
//     {
//       id: 5,
//       reviewerName: "Lisa Thompson",
//       petName: "Rex",
//       rating: 3.5,
//       date: "January 5, 2024",
//       provider: "Pet Paradise Resort",
//       reviewText: "Decent service overall. Rex seemed comfortable but the facility was a bit crowded. Staff was friendly but could have been more attentive. Would consider using again.",
//       providerResponse: null
//     }
//   ];

//   const providers = ["All Providers", "Happy Paws Boarding", "Paws & Play Pet Care", "Furry Friends Pet Hotel", "Pet Paradise Resort"];
//   const ratingOptions = ["All Ratings", "5 Stars", "4 Stars", "3 Stars", "2 Stars", "1 Star"];

//   const filteredReviews = reviews.filter(review => {
//     const matchesSearch = review.reviewText.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          review.reviewerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          review.provider.toLowerCase().includes(searchTerm.toLowerCase());
    
//     const matchesRating = selectedRating === "all" || 
//                          (selectedRating === "5" && review.rating === 5) ||
//                          (selectedRating === "4" && review.rating === 4) ||
//                          (selectedRating === "3" && review.rating === 3) ||
//                          (selectedRating === "2" && review.rating === 2) ||
//                          (selectedRating === "1" && review.rating === 1);
    
//     const matchesProvider = selectedProvider === "all" || review.provider === selectedProvider;

//     return matchesSearch && matchesRating && matchesProvider;
//   });

//   return (
//     <div className="p-6">
//       {/* Header */}
//       <div className="mb-6">
//         <h2 className="text-2xl font-bold text-gray-800 mb-2">All Reviews</h2>
//         <p className="text-gray-600">Browse reviews from other pet owners</p>
//       </div>

//       {/* Search and Filter Bar */}
//       <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow-sm">
//         <div className="flex flex-col md:flex-row gap-4">
//           {/* Search Input */}
//           <div className="flex-1 relative">
//             <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//             <input
//               type="text"
//               placeholder="Search reviews, names, or providers..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
//             />
//           </div>

//           {/* Filter Dropdowns */}
//           <div className="flex gap-3">
//             <div className="relative">
//               <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//               <select
//                 value={selectedRating}
//                 onChange={(e) => setSelectedRating(e.target.value)}
//                 className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none appearance-none bg-white"
//               >
//                 {ratingOptions.map((option, index) => (
//                   <option key={index} value={index === 0 ? "all" : (6 - index).toString()}>
//                     {option}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <select
//               value={selectedProvider}
//               onChange={(e) => setSelectedProvider(e.target.value)}
//               className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none appearance-none bg-white"
//             >
//               {providers.map((provider, index) => (
//                 <option key={index} value={index === 0 ? "all" : provider}>
//                   {provider}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Reviews List */}
//       <div className="space-y-6">
//         {filteredReviews.length === 0 ? (
//           <div className="text-center py-12">
//             <p className="text-gray-500 text-lg">No reviews found matching your criteria.</p>
//             <p className="text-gray-400 mt-2">Try adjusting your search or filter options.</p>
//           </div>
//         ) : (
//           filteredReviews.map((review) => (
//             <div key={review.id} className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm relative">
//               {/* Bookmark Button */}
//               <button className="absolute top-4 right-4 p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors duration-200">
//                 <FiBookmark className="w-5 h-5" />
//               </button>

//               {/* Reviewer Info */}
//               <div className="flex items-center space-x-3 mb-4">
//                 <h4 className="font-semibold text-gray-800">{review.reviewerName}</h4>
//                 <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full">
//                   Pet: {review.petName}
//                 </span>
//               </div>

//               {/* Rating and Date */}
//               <div className="flex items-center space-x-4 mb-3">
//                 <StarRating rating={review.rating} size="md" />
//                 <span className="text-gray-500 text-sm">{review.date}</span>
//               </div>

//               {/* Provider */}
//               <div className="mb-4">
//                 <a 
//                   href="#" 
//                   className="text-blue-600 hover:text-blue-800 font-medium"
//                 >
//                   {review.provider}
//                 </a>
//               </div>

//               {/* Review Text */}
//               <p className="text-gray-700 mb-4 leading-relaxed">{review.reviewText}</p>

//               {/* Provider Response */}
//               {review.providerResponse && (
//                 <div className="bg-amber-50 border-l-4 border-orange-200 p-4 rounded-r-lg">
//                   <div className="flex items-center space-x-2 mb-2">
//                     <span className="font-semibold text-gray-800">Provider Response</span>
//                     <span className="text-orange-500">💬</span>
//                   </div>
//                   <p className="text-gray-700">{review.providerResponse}</p>
//                 </div>
//               )}
//             </div>
//           ))
//         )}
//       </div>

//       {/* Load More Button */}
//       {filteredReviews.length > 0 && (
//         <div className="text-center mt-8">
//           <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-medium transition-colors duration-200">
//             Load More Reviews
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };



