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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
      <Card className="border-[#E0E0E0] mt-6">
        <CardHeader>
          <div className="flex items-center justify-between border-b-[#8a8989] border-b-2">
            <CardTitle className="text-[#212121] text-xl py-2">
              Subscription
            </CardTitle>
            <Button
              variant="outline"
              className="text-[#fafafa] bg-[#297ddd] hover:bg-[#9cb8d8]">
              Subscribe
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-center text-[#212121] text-xl">No active plan</p>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card className="border-[#E0E0E0] mt-6">
        <CardHeader>
          <div className="flex items-center justify-between border-b-[#8a8989] border-b-2">
            <CardTitle className="text-[#212121] text-xl py-2">
              Billing History
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-[#212121] text-xl py-2">
                  No data available.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </UserLayoutPage>
  );
};
