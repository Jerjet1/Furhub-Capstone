// import React, { useState } from "react";
// import { FiX, FiStar } from "react-icons/fi";
// import { StarRating } from "./StarRating";

// export const WriteReviewModal = ({ isOpen, onClose, onSubmit }) => {
//   const [formData, setFormData] = useState({
//     provider: "",
//     petName: "",
//     rating: 0,
//     reviewText: "",
//     experience: ""
//   });

//   const [errors, setErrors] = useState({});

//   const providers = [
//     "Happy Paws Boarding",
//     "Paws & Play Pet Care", 
//     "Furry Friends Pet Hotel",
//     "Pet Paradise Resort",
//     "Cozy Critter Care"
//   ];

//   const experienceOptions = [
//     "Excellent",
//     "Very Good", 
//     "Good",
//     "Fair",
//     "Poor"
//   ];

//   const handleInputChange = (field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: value
//     }));
    
//     // Clear error when user starts typing
//     if (errors[field]) {
//       setErrors(prev => ({
//         ...prev,
//         [field]: ""
//       }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.provider) {
//       newErrors.provider = "Please select a provider";
//     }
//     if (!formData.petName.trim()) {
//       newErrors.petName = "Please enter your pet's name";
//     }
//     if (formData.rating === 0) {
//       newErrors.rating = "Please select a rating";
//     }
//     if (!formData.reviewText.trim()) {
//       newErrors.reviewText = "Please write a review";
//     }
//     if (formData.reviewText.trim().length < 10) {
//       newErrors.reviewText = "Review must be at least 10 characters long";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
    
//     if (validateForm()) {
//       onSubmit(formData);
//       // Reset form
//       setFormData({
//         provider: "",
//         petName: "",
//         rating: 0,
//         reviewText: "",
//         experience: ""
//       });
//       setErrors({});
//     }
//   };

//   const handleClose = () => {
//     setFormData({
//       provider: "",
//       petName: "",
//       rating: 0,
//       reviewText: "",
//       experience: ""
//     });
//     setErrors({});
//     onClose();
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//         {/* Header */}
//         <div className="flex justify-between items-center p-6 border-b border-gray-200">
//           <h2 className="text-2xl font-bold text-gray-800">Write a Review</h2>
//           <button
//             onClick={handleClose}
//             className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
//           >
//             <FiX className="w-6 h-6" />
//           </button>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="p-6 space-y-6">
//           {/* Provider Selection */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Boarding Provider *
//             </label>
//             <select
//               value={formData.provider}
//               onChange={(e) => handleInputChange("provider", e.target.value)}
//               className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none ${
//                 errors.provider ? "border-red-500" : "border-gray-300"
//               }`}
//             >
//               <option value="">Select a provider</option>
//               {providers.map((provider, index) => (
//                 <option key={index} value={provider}>
//                   {provider}
//                 </option>
//               ))}
//             </select>
//             {errors.provider && (
//               <p className="mt-1 text-sm text-red-600">{errors.provider}</p>
//             )}
//           </div>

//           {/* Pet Name */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Pet's Name *
//             </label>
//             <input
//               type="text"
//               value={formData.petName}
//               onChange={(e) => handleInputChange("petName", e.target.value)}
//               placeholder="Enter your pet's name"
//               className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none ${
//                 errors.petName ? "border-red-500" : "border-gray-300"
//               }`}
//             />
//             {errors.petName && (
//               <p className="mt-1 text-sm text-red-600">{errors.petName}</p>
//             )}
//           </div>

//           {/* Rating */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Rating *
//             </label>
//             <div className="flex items-center space-x-2">
//               <StarRating
//                 rating={formData.rating}
//                 size="lg"
//                 interactive={true}
//                 onRatingChange={(rating) => handleInputChange("rating", rating)}
//               />
//               <span className="text-sm text-gray-600">
//                 {formData.rating > 0 && `${formData.rating} out of 5 stars`}
//               </span>
//             </div>
//             {errors.rating && (
//               <p className="mt-1 text-sm text-red-600">{errors.rating}</p>
//             )}
//           </div>

//           {/* Overall Experience */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Overall Experience
//             </label>
//             <select
//               value={formData.experience}
//               onChange={(e) => handleInputChange("experience", e.target.value)}
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
//             >
//               <option value="">Select experience level</option>
//               {experienceOptions.map((option, index) => (
//                 <option key={index} value={option}>
//                   {option}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Review Text */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Your Review *
//             </label>
//             <textarea
//               value={formData.reviewText}
//               onChange={(e) => handleInputChange("reviewText", e.target.value)}
//               placeholder="Share your experience with this boarding provider..."
//               rows={6}
//               className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none resize-none ${
//                 errors.reviewText ? "border-red-500" : "border-gray-300"
//               }`}
//             />
//             <div className="flex justify-between mt-1">
//               {errors.reviewText && (
//                 <p className="text-sm text-red-600">{errors.reviewText}</p>
//               )}
//               <p className="text-sm text-gray-500 ml-auto">
//                 {formData.reviewText.length}/500 characters
//               </p>
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
//             <button
//               type="button"
//               onClick={handleClose}
//               className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors duration-200"
//             >
//               Submit Review
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };



