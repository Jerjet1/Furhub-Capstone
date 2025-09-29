// import React from "react";
// import { FiStar } from "react-icons/fi";

// export const StarRating = ({ rating, size = "md", showNumber = false, interactive = false, onRatingChange }) => {
//   const sizeClasses = {
//     sm: "w-4 h-4",
//     md: "w-5 h-5", 
//     lg: "w-6 h-6"
//   };

//   const handleStarClick = (starRating) => {
//     if (interactive && onRatingChange) {
//       onRatingChange(starRating);
//     }
//   };

//   const renderStars = () => {
//     const stars = [];
//     const fullStars = Math.floor(rating);
//     const hasHalfStar = rating % 1 !== 0;

//     for (let i = 1; i <= 5; i++) {
//       let starClass = "text-gray-300";
      
//       if (i <= fullStars) {
//         starClass = "text-orange-500 fill-current";
//       } else if (i === fullStars + 1 && hasHalfStar) {
//         starClass = "text-orange-500 fill-current";
//       }

//       stars.push(
//         <FiStar
//           key={i}
//           className={`${sizeClasses[size]} ${starClass} ${
//             interactive ? "cursor-pointer hover:text-orange-400 transition-colors duration-200" : ""
//           }`}
//           style={i === fullStars + 1 && hasHalfStar ? { clipPath: "inset(0 50% 0 0)" } : {}}
//           onClick={() => handleStarClick(i)}
//         />
//       );
//     }

//     return stars;
//   };

//   return (
//     <div className="flex items-center space-x-1">
//       <div className="flex">
//         {renderStars()}
//       </div>
//       {showNumber && (
//         <span className="ml-2 text-sm font-medium text-gray-600">
//           {rating.toFixed(1)}
//         </span>
//       )}
//     </div>
//   );
// };



