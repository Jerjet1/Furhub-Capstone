import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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

      {/* Billing History */}
      <Card className="border-[#E0E0E0] mt-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-[#212121]">Billing History</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-[#FAFAFA] rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#E8F5E8] rounded-full flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-[#4CAF50]" />
                </div>
                <div>
                  <p className="font-medium text-[#212121]">
                    February 2024 - Professional Plan
                  </p>
                  <p className="text-sm text-[#757575]">Paid on Feb 15, 2024</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-[#212121]">$49.99</p>
                <Badge className="bg-[#E8F5E8] text-[#4CAF50] hover:bg-[#E8F5E8]">
                  Paid
                </Badge>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#FAFAFA] rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#E8F5E8] rounded-full flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-[#4CAF50]" />
                </div>
                <div>
                  <p className="font-medium text-[#212121]">
                    January 2024 - Professional Plan
                  </p>
                  <p className="text-sm text-[#757575]">Paid on Jan 15, 2024</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-[#212121]">$49.99</p>
                <Badge className="bg-[#E8F5E8] text-[#4CAF50] hover:bg-[#E8F5E8]">
                  Paid
                </Badge>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#FAFAFA] rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#E8F5E8] rounded-full flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-[#4CAF50]" />
                </div>
                <div>
                  <p className="font-medium text-[#212121]">
                    December 2023 - Professional Plan
                  </p>
                  <p className="text-sm text-[#757575]">Paid on Dec 15, 2023</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-[#212121]">$49.99</p>
                <Badge className="bg-[#E8F5E8] text-[#4CAF50] hover:bg-[#E8F5E8]">
                  Paid
                </Badge>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#FAFAFA] rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#FFF3E0] rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-[#FF9800]" />
                </div>
                <div>
                  <p className="font-medium text-[#212121]">
                    Setup Fee - Account Activation
                  </p>
                  <p className="text-sm text-[#757575]">Paid on Nov 20, 2023</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-[#212121]">$25.00</p>
                <Badge className="bg-[#E8F5E8] text-[#4CAF50] hover:bg-[#E8F5E8]">
                  Paid
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </UserLayoutPage>
  );
};
