import React, { useMemo, useState, useCallback } from "react";
import { View, Text, TouchableOpacity, ScrollView, TextInput, BackHandler } from "react-native";
import { router, useFocusEffect } from "expo-router";

type TransactionStatus = "completed" | "pending" | "failed";

type TransactionLog = {
  id: string;
  title: string;
  date: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
};

const mockTransactions: TransactionLog[] = [
  {
    id: "1001",
    title: "Payment Received",
    date: "2024-01-15 10:01",
    amount: 99.99,
    currency: "₱",
    status: "completed",
  },
  {
    id: "1002",
    title: "Money Transfer",
    date: "2024-01-14 10:02",
    amount: 149.5,
    currency: "₱",
    status: "pending",
  },
  {
    id: "1003",
    title: "Service Payment",
    date: "2024-01-13 10:03",
    amount: 75,
    currency: "₱",
    status: "completed",
  },
  {
    id: "1004",
    title: "Transfer Failed",
    date: "2024-01-12 10:04",
    amount: 200,
    currency: "₱",
    status: "failed",
  },
  {
    id: "1005",
    title: "Bill Payment",
    date: "2024-01-11 10:05",
    amount: 89.99,
    currency: "₱",
    status: "completed",
  },
];

const statusTextColor: Record<TransactionStatus, string> = {
  completed: "text-emerald-600",
  pending: "text-amber-600",
  failed: "text-rose-600",
};

const statusBgColor: Record<TransactionStatus, string> = {
  completed: "bg-emerald-100",
  pending: "bg-amber-100",
  failed: "bg-rose-100",
};

type SubscriptionEvent = {
  id: string;
  title: string;
  date: string;
};

const mockSubscriptions: SubscriptionEvent[] = [
  { id: "6001", title: "Created", date: "01/15/2024" },
  { id: "6002", title: "Renewed", date: "01/14/2024" },
  { id: "6003", title: "Cancelled", date: "01/13/2024" },
  { id: "6004", title: "Upgraded", date: "01/12/2024" },
  { id: "6005", title: "Paused", date: "01/11/2024" },
];

export default function HistoryReports() {
  const [activeTab, setActiveTab] = useState<"transactions" | "subscriptions">("transactions");
  const [query, setQuery] = useState("");

  // Hardware back -> Settings screen
  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener("hardwareBackPress", () => {
        router.push("/(owner)/Settings/SettingScreen");
        return true;
      });
      return () => sub.remove();
    }, [])
  );

  const transactions = useMemo(() => mockTransactions, []);
  const subscriptions = useMemo(() => mockSubscriptions, []);

  const filteredTransactions = useMemo(() => {
    if (!query.trim()) return transactions;
    const q = query.toLowerCase();
    return transactions.filter((t) =>
      `${t.title} ${t.id} ${t.date} ${t.amount}`.toLowerCase().includes(q)
    );
  }, [transactions, query]);

  const filteredSubscriptions = useMemo(() => {
    if (!query.trim()) return subscriptions;
    const q = query.toLowerCase();
    return subscriptions.filter((s) => `${s.title} ${s.id} ${s.date}`.toLowerCase().includes(q));
  }, [subscriptions, query]);

  return (
    <View className="flex-1 bg-white">
      <View className="pt-12 px-4 pb-4 border-b border-gray-200 bg-white">
        <TouchableOpacity
          onPress={() => router.push("/(owner)/Settings/SettingScreen")}
          className="mb-3"
        >
          <Text className="text-blue-600">Back</Text>
        </TouchableOpacity>
        <Text className="text-2xl font-semibold">History Reports</Text>
        <Text className="text-gray-500">View transaction logs and subscription history</Text>
      </View>

      <View className="px-3 pt-3">
        <View className="mb-2">
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search records..."
            className="bg-gray-100 rounded-lg px-4 py-3 text-[15px]"
            placeholderTextColor="#9CA3AF"
          />
        </View>
        <View className="flex-row rounded-lg bg-gray-100 p-1">
          <TouchableOpacity
            className={`flex-1 py-2 rounded-md ${activeTab === "transactions" ? "bg-white" : ""}`}
            onPress={() => setActiveTab("transactions")}
          >
            <Text className={`text-center font-medium ${activeTab === "transactions" ? "text-gray-900" : "text-gray-500"}`}>Transaction Logs</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 py-2 rounded-md ${activeTab === "subscriptions" ? "bg-white" : ""}`}
            onPress={() => setActiveTab("subscriptions")}
          >
            <Text className={`text-center font-medium ${activeTab === "subscriptions" ? "text-gray-900" : "text-gray-500"}`}>Subscription History</Text>
          </TouchableOpacity>
        </View>
      </View>

      {activeTab === "transactions" && (
        <ScrollView className="flex-1 px-3 mt-3" contentContainerStyle={{ paddingBottom: 24 }}>
          <View className="rounded-lg border border-gray-200 bg-white">
            <View className="px-4 py-3 border-b border-gray-100 bg-gray-50 rounded-t-lg">
              <Text className="text-base font-semibold">Transaction Logs</Text>
              <Text className="text-xs text-gray-500">All transaction records with payment details</Text>
            </View>

            {filteredTransactions.map((item) => (
              <TouchableOpacity
                key={item.id}
                className="px-4 py-3 border-b border-gray-100"
                onPress={() =>
                  router.push({
                    pathname: "/(owner)/Settings/TransactionDetails",
                    params: {
                      id: item.id,
                      title: item.title,
                      date: item.date,
                      amount: String(item.amount),
                      currency: item.currency,
                      status: item.status,
                    },
                  })
                }
                activeOpacity={0.7}
              >
                <View className="flex-row items-start justify-between">
                  <View className="flex-1 pr-3">
                    <Text className="text-[15px] font-medium" numberOfLines={1}>{item.title}</Text>
                    <Text className="text-xs text-gray-500">{item.date} • ID: {item.id}</Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-[15px] font-semibold">{item.currency}{item.amount.toFixed(2)}</Text>
                    <View className={`mt-1 px-2 py-0.5 rounded-full ${statusBgColor[item.status]}`}>
                      <Text className={`text-[11px] ${statusTextColor[item.status]}`}>{item.status}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}

            <View className="px-4 py-3 flex-row justify-between">
              <TouchableOpacity className="px-3 py-2 rounded-md border border-gray-300">
                <Text className="text-gray-700">Prev</Text>
              </TouchableOpacity>
              <TouchableOpacity className="px-3 py-2 rounded-md border border-gray-300">
                <Text className="text-gray-700">Next</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      )}

      {activeTab === "subscriptions" && (
        <ScrollView className="flex-1 px-3 mt-3" contentContainerStyle={{ paddingBottom: 24 }}>
          <View className="rounded-lg border border-gray-200 bg-white">
            <View className="px-4 py-3 border-b border-gray-100 bg-gray-50 rounded-t-lg">
              <Text className="text-base font-semibold">Subscription History</Text>
              <Text className="text-xs text-gray-500">Subscription actions and lifecycle events</Text>
            </View>

            {filteredSubscriptions.map((item) => (
              <TouchableOpacity
                key={item.id}
                className="px-4 py-3 border-b border-gray-100"
                onPress={() =>
                  router.push({
                    pathname: "/(owner)/Settings/SubscriptionDetails",
                    params: {
                      id: item.id,
                      title: item.title,
                      date: item.date,
                    },
                  })
                }
                activeOpacity={0.7}
              >
                <View className="flex-row items-start justify-between">
                  <View className="flex-1 pr-3">
                    <Text className="text-[15px] font-medium" numberOfLines={1}>{item.title}</Text>
                    <Text className="text-xs text-gray-500">{item.date}</Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-xs text-gray-400">ID: {item.id}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}

            <View className="px-4 py-3 flex-row justify-between">
              <TouchableOpacity className="px-3 py-2 rounded-md border border-gray-300">
                <Text className="text-gray-700">Prev</Text>
              </TouchableOpacity>
              <TouchableOpacity className="px-3 py-2 rounded-md border border-gray-300">
                <Text className="text-gray-700">Next</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
}


