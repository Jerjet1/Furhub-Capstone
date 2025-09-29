
import React, { useMemo, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, SafeAreaView } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

type ReviewItem = {
  id: number;
  userInitial: string;
  userName: string;
  daysAgo: string;
  rating: number;
  text: string;
};

const MOCK_REVIEWS: ReviewItem[] = [
  { id: 1, userInitial: "D", userName: "Daniel Garcia", daysAgo: "2 weeks ago", rating: 5, text: "Good overall. My dog enjoyed the stay but I wished the walk times were more flexible." },
  { id: 2, userInitial: "E", userName: "Emily Davis", daysAgo: "3 days ago", rating: 5, text: "My dog Bella had a great time! Loved the daily photo updates." },
  { id: 3, userInitial: "J", userName: "James Wilson", daysAgo: "5 days ago", rating: 4, text: "Decent service, but my dog seemed stressed when I picked him up." },
  { id: 4, userInitial: "O", userName: "Olivia Martinez", daysAgo: "1 day ago", rating: 5, text: "Excellent care and very professional staff. Highly recommend!" },
  { id: 5, userInitial: "S", userName: "Sophia Lee", daysAgo: "1 week ago", rating: 3, text: "Average experience. Room for improvement on communication." },
  { id: 6, userInitial: "M", userName: "Michael Chen", daysAgo: "4 weeks ago", rating: 2, text: "Scheduling was confusing and pickup was delayed." },
];

const PAGE_SIZE = 4;

function StarRow({ value }: { value: number }) {
  const nodes = [] as React.ReactNode[];
  for (let i = 1; i <= 5; i++) {
    nodes.push(
      <FontAwesome
        key={i}
        name="star"
        size={14}
        color={i <= value ? "#f59e0b" : "#d1d5db"}
      />
    );
  }
  return <View className="flex-row items-center space-x-1">{nodes}</View>;
}

function DistributionBar({ label, count, total }: { label: string; count: number; total: number }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <View className="flex-row items-center mb-2">
      <Text className="w-6 text-xs text-gray-700">{label}</Text>
      <View className="flex-1 h-2 bg-gray-200 rounded-full mx-2 overflow-hidden">
        <View style={{ width: `${pct}%` }} className="h-2 bg-blue-500" />
      </View>
      <Text className="w-5 text-xs text-gray-500 text-right">{count}</Text>
    </View>
  );
}

export default function WalkerReviewsScreen() {
  const [filter, setFilter] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [dropdownHeight, setDropdownHeight] = useState(0); // added

  const filtered = useMemo(() => {
    return filter ? MOCK_REVIEWS.filter((r) => r.rating === filter) : MOCK_REVIEWS;
  }, [filter]);

  const total = filtered.length;
  const start = (page - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const counts = useMemo(() => {
    const c = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } as Record<number, number>;
    for (const r of MOCK_REVIEWS) c[r.rating as 1 | 2 | 3 | 4 | 5] += 1;
    return c;
  }, []);

  const avg = useMemo(() => {
    if (!MOCK_REVIEWS.length) return 0;
    const sum = MOCK_REVIEWS.reduce((acc, r) => acc + r.rating, 0);
    return Math.round((sum / MOCK_REVIEWS.length) * 10) / 10;
  }, []);

  function applyFilter(v: number | null) {
    setFilter(v);
    setPage(1);
    setFilterOpen(false);
  }

  return (
    <SafeAreaView className="flex-1 bg-[#f8fafc]">
      <FlatList
        data={pageItems}
        keyExtractor={(i) => String(i.id)}
        contentContainerStyle={{ padding: 16 }}
        ListHeaderComponent={
          <View>
            <View className="bg-white rounded-2xl border border-gray-200 p-4 mb-4">
              <View className="flex-row items-end">
                <Text className="text-3xl font-bold text-gray-900 mr-2">{avg}</Text>
                <Text className="text-yellow-500 mr-2">★</Text>
                <Text className="text-gray-500">Based on {MOCK_REVIEWS.length} reviews</Text>
              </View>
              <View className="mt-4">
                <DistributionBar label="5★" count={counts[5]} total={MOCK_REVIEWS.length} />
                <DistributionBar label="4★" count={counts[4]} total={MOCK_REVIEWS.length} />
                <DistributionBar label="3★" count={counts[3]} total={MOCK_REVIEWS.length} />
                <DistributionBar label="2★" count={counts[2]} total={MOCK_REVIEWS.length} />
                <DistributionBar label="1★" count={counts[1]} total={MOCK_REVIEWS.length} />
              </View>
            </View>

            <View className="bg-white rounded-2xl border border-gray-200 p-3 mb-3 flex-row items-center justify-between" style={{ position: "relative" }}>
              <Text className="font-semibold text-gray-800">Feedbacks</Text>
              <View style={{ position: "relative" }}>
                <TouchableOpacity
                  onPress={() => setFilterOpen((s) => !s)}
                  className="flex-row items-center px-3 py-2 rounded-lg border border-gray-300"
                >
                  <Text className="mr-2">Filter</Text>
                  <FontAwesome name="chevron-down" size={12} color="#6b7280" />
                </TouchableOpacity>
                {filterOpen && (
                  <View
                    className="absolute right-0 mt-2 w-40 bg-white rounded-xl border border-gray-200"
                    style={{
                      zIndex: 100,
                      elevation: 12,
                      shadowColor: "#000",
                      shadowOpacity: 0.15,
                      shadowRadius: 8,
                      shadowOffset: { width: 0, height: 4 }
                    }}
                    onLayout={(e) => setDropdownHeight(e.nativeEvent.layout.height)}
                  >
                    <TouchableOpacity onPress={() => applyFilter(null)} className="px-3 py-2">
                      <Text className="text-gray-700">All Reviews</Text>
                    </TouchableOpacity>
                    {[5, 4, 3, 2, 1].map((n) => (
                      <TouchableOpacity key={n} onPress={() => applyFilter(n)} className="px-3 py-2">
                        <Text className="text-gray-700">{n} Stars</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </View>

            {/* Spacer to push list items below dropdown (height set when open) */}
            {filterOpen && <View style={{ height: dropdownHeight + 8 }} />}
          </View>
        }
        renderItem={({ item }) => (
          <View className="bg-white rounded-2xl border border-gray-200 p-4 mb-3">
            <View className="flex-row items-center mb-2">
              <View className="w-8 h-8 rounded-full bg-blue-100 items-center justify-center mr-2">
                <Text className="text-blue-700 font-semibold">{item.userInitial}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 font-semibold">{item.userName}</Text>
                <Text className="text-gray-500 text-xs">{item.daysAgo}</Text>
              </View>
              <StarRow value={item.rating} />
            </View>
            <Text className="text-gray-700 leading-5">{item.text}</Text>
          </View>
        )}
        ListFooterComponent={
          <View className="flex-row items-center justify-center space-x-2 mt-2">
            <TouchableOpacity
              disabled={page <= 1}
              onPress={() => setPage((p) => Math.max(1, p - 1))}
              className={`px-4 py-2 rounded-lg border ${page <= 1 ? "border-gray-200 bg-gray-100" : "border-gray-300 bg-white"}`}
            >
              <Text className="text-gray-700">Previous</Text>
            </TouchableOpacity>
            <View className="px-3 py-2 rounded-lg bg-gray-100 border border-gray-200">
              <Text className="text-gray-700">{page}</Text>
            </View>
            <TouchableOpacity
              disabled={page >= totalPages}
              onPress={() => setPage((p) => Math.min(totalPages, p + 1))}
              className={`px-4 py-2 rounded-lg border ${page >= totalPages ? "border-gray-200 bg-gray-100" : "border-gray-300 bg-white"}`}
            >
              <Text className="text-gray-700">Next</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
}