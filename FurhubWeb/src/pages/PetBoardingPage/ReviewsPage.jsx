import React, { useState } from "react";
import { Search, Filter, Star, MoreHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserLayoutPage } from "../../components/Layout/UserLayoutPage";

// ✅ Mock reviews
const mockReviews = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "/woman-brown-hair.png",
    rating: 5,
    time: "2 days ago",
    text: "Absolutely wonderful experience! The staff took amazing care of Max during our vacation. He came back happy and well-groomed.",
  },
  {
    id: 2,
    name: "Michael Smith",
    avatar: "/man-black-hair.png",
    rating: 4,
    time: "1 week ago",
    text: "Good service overall, but I think the grooming could be a little faster. Otherwise, very friendly staff.",
  },
  {
    id: 3,
    name: "Emily Davis",
    avatar: "/woman-blonde-hair.png",
    rating: 5,
    time: "3 days ago",
    text: "My dog Bella had a great time! Loved the daily photo updates.",
  },
  {
    id: 4,
    name: "James Wilson",
    avatar: "/man-brown-hair.png",
    rating: 3,
    time: "5 days ago",
    text: "Decent service, but my dog seemed stressed when I picked him up.",
  },
  {
    id: 5,
    name: "Olivia Martinez",
    avatar: "/woman-curly-hair.png",
    rating: 5,
    time: "1 day ago",
    text: "Excellent care and very professional staff. Highly recommend!",
  },
  {
    id: 6,
    name: "Daniel Garcia",
    avatar: "/man-short-hair.png",
    rating: 4,
    time: "2 weeks ago",
    text: "Good overall. My dog enjoyed the stay but I wish pickup times were more flexible.",
  },
  {
    id: 7,
    name: "Sophia Lee",
    avatar: "/woman-asian.png",
    rating: 5,
    time: "6 days ago",
    text: "Amazing service, very clean facility and kind staff.",
  },
  {
    id: 8,
    name: "William Brown",
    avatar: "/man-beard.png",
    rating: 2,
    time: "3 weeks ago",
    text: "Not satisfied, my pet was not groomed properly.",
  },
  {
    id: 9,
    name: "Isabella Taylor",
    avatar: "/woman-red-hair.png",
    rating: 5,
    time: "4 days ago",
    text: "They treated my dog like family! Will definitely return.",
  },
  {
    id: 10,
    name: "Liam Anderson",
    avatar: "/man-gray-hair.png",
    rating: 4,
    time: "1 month ago",
    text: "Overall good experience, but pricing could be clearer.",
  },
];

export const ReviewsPage = () => {
  const [page, setPage] = useState(1);
  const perPage = 5;
  const totalPages = Math.ceil(mockReviews.length / perPage);

  const paginatedReviews = mockReviews.slice(
    (page - 1) * perPage,
    page * perPage
  );

  // Calculate overall stats
  const totalReviews = mockReviews.length;
  const totalRating = mockReviews.reduce((sum, r) => sum + r.rating, 0);
  const averageRating = (totalRating / totalReviews).toFixed(1);

  // Distribution (counts for each rating)
  const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  mockReviews.forEach((r) => {
    ratingCounts[r.rating] = (ratingCounts[r.rating] || 0) + 1;
  });

  return (
    <UserLayoutPage>
      <div className="flex items-center justify-between mb-6">
        {/* header */}
        <div>
          <h1 className="text-3xl font-bold text-[#212121]">
            Reviews & Ratings
          </h1>
          <p className="text-[#757575]">Monitor customer feedback</p>
        </div>
      </div>

      {/* Rating Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">
        <Card className="border-[#E0E0E0]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-medium text-[#757575]">
              Overall Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-3xl font-bold text-[#212121]">
                {averageRating}
              </span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= Math.round(Number(averageRating))
                        ? "fill-[#FF9800] text-[#FF9800]"
                        : "text-[#E0E0E0]"
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-sm text-[#757575]">
              Based on {totalReviews} reviews
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Rating Distribution */}
      <Card className="border-[#E0E0E0] mb-6">
        <CardHeader>
          <CardTitle className="text-[#212121]">Rating Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = ratingCounts[rating];
              const percentage = (count / totalReviews) * 100 || 0;
              return (
                <div key={rating} className="flex items-center gap-4">
                  <div className="flex items-center gap-1 w-16">
                    <span className="text-sm text-[#424242]">{rating}</span>
                    <Star className="h-4 w-4 fill-[#FF9800] text-[#FF9800]" />
                  </div>
                  <div className="flex-1 bg-[#F5F5F5] rounded-full h-2">
                    <div
                      className="bg-[#4285F4] h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-[#757575] w-12">{count}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <Card className="border-[#E0E0E0]">
        <CardHeader className="border-b border-[#E0E0E0] last:border-b-0">
          <CardTitle className="text-[#212121] flex flex-row justify-between text-xl ">
            Feedbacks
            <div className="flex items-center gap-3">
              <Select>
                <SelectTrigger className="w-44 border-[#E0E0E0]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Reviews</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardTitle>
          {/* <CardDescription className="text-[#757575]">
            customer feedback and ratings
          </CardDescription> */}
        </CardHeader>
        <CardContent className="space-y-6">
          {paginatedReviews.map((review) => (
            <div
              key={review.id}
              className="border-b border-[#E0E0E0] pb-6 last:border-b-0">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={review.avatar} />
                    <AvatarFallback className="bg-[#4285F4] text-white">
                      {review.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium text-[#212121]">
                      {review.name}
                    </h4>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= review.rating
                                ? "fill-[#FF9800] text-[#FF9800]"
                                : "text-[#E0E0E0]"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-[#757575]">
                        {review.time}
                      </span>
                    </div>
                  </div>
                </div>
                {/* <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#616161] hover:bg-[#F5F5F5]">
                  <MoreHorizontal className="h-4 w-4" />
                </Button> */}
              </div>
              <p className="text-[#424242] mb-3">"{review.text}"</p>
            </div>
          ))}
        </CardContent>
      </Card>
      {/* ✅ Pagination */}
      <div className="mt-6 flex justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              />
            </PaginationItem>

            {[...Array(totalPages)].map((_, idx) => (
              <PaginationItem key={idx}>
                <PaginationLink
                  href="#"
                  isActive={page === idx + 1}
                  onClick={() => setPage(idx + 1)}>
                  {idx + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, totalPages))
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </UserLayoutPage>
  );
};
