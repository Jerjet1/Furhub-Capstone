import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Bell,
  Home,
  Users,
  Calendar,
  Settings,
  PawPrint,
  Search,
  Filter,
  Download,
  CreditCard,
  TrendingUp,
  DollarSign,
  UserCheck,
  AlertTriangle,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserLayoutPage } from "../../components/Layout/UserLayoutPage";
export const AdminSubscription = () => {
  return (
    <UserLayoutPage>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#212121]">
            Subscription Management
          </h1>
          <p className="text-[#757575]">
            Monitor and manage all service provider subscriptions
          </p>
        </div>
        <div className="space-x-5"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card className="border-[#E0E0E0]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#757575]">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#212121]">$24,580</div>
          </CardContent>
        </Card>
        <Card className="border-[#E0E0E0]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#757575]">
              Active Subscriptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#212121]">156</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="border-[#E0E0E0] mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#9E9E9E]" />
                <Input
                  placeholder="Search email, or subscription ID..."
                  className="pl-10 border-[#E0E0E0] focus:border-[#4285F4]"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select>
                <SelectTrigger className="w-[120px] border-[#E0E0E0]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscribed users */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#212121]">All Subscriptions</CardTitle>
          <CardDescription className="text-[#757575]">
            Manage service provider subscriptions and billing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Avatar</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Expiration Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell
                  colSpan={7}
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
