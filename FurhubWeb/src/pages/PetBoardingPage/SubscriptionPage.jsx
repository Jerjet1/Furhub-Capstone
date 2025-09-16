import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Bell,
  Home,
  Users,
  Calendar,
  Settings,
  PawPrint,
  CreditCard,
  Download,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Edit,
} from "lucide-react";
import { UserLayoutPage } from "../../components/Layout/UserLayoutPage";
export const SubscriptionPage = () => {
  return (
    <UserLayoutPage>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#212121]">
            Subscription & Billing
          </h1>
          <p className="text-[#757575]">
            Manage your Furhub subscription and billing information
          </p>
        </div>
      </div>
    </UserLayoutPage>
  );
};
