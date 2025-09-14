import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { UserLayoutPage } from "../../components/Layout/UserLayoutPage";
import { UserTable } from "../../components/Tables/UserTable";
import { PaginationButton } from "../../components/Buttons/PaginationButton";
import { fetchUsers } from "../../api/Users";
import {
  fetchPetWalkerUsers,
  fetchPetBoardingUsers,
} from "../../api/ProviderAPI";
import { Button } from "@/components/ui/button";

export const ManageUser = () => {
  const [page, setPage] = useState(1);
  const [walkerPage, setWalkerPage] = useState(1);
  const [boardingPage, setBoardingPage] = useState(1);
  const [view, setView] = useState("users");

  const {
    data: userData,
    isLoading: isUserLoading,
    isError: isUserError,
  } = useQuery({
    queryKey: ["users", page],
    queryFn: () => fetchUsers(page),
  });

  const {
    data: walkerData,
    isLoading: isWalkerLoading,
    isError: isWalkerError,
  } = useQuery({
    queryKey: ["walker", walkerPage],
    queryFn: () => fetchPetWalkerUsers(walkerPage),
  });

  const {
    data: boardingData,
    isLoading: isBoardingLoading,
    isError: isBoardingError,
  } = useQuery({
    queryKey: ["boarding", boardingPage],
    queryFn: () => fetchPetBoardingUsers(boardingPage),
  });

  const userHeaders = [
    { key: "id", label: "ID" },
    { key: "first_name", label: "First Name" },
    { key: "last_name", label: "Last Name" },
    { key: "email", label: "Email" },
    { key: "phone_no", label: "Phone No." },
    { key: "action", label: "Action" },
  ];

  const providerHeaders = [
    { key: "user.id", label: "ID" },
    { key: "user.first_name", label: "First Name" },
    { key: "user.last_name", label: "Last Name" },
    { key: "user.email", label: "Email" },
    { key: "status", label: "Status" },
    { key: "action", label: "Action" },
  ];

  return (
    <UserLayoutPage>
      <div className="flex flex-row gap-5 px-14">
        <Button
          onClick={() => setView("users")}
          className={`px-4 py-2 rounded ${
            view === "users"
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "border-[#E0E0E0] text-[#616161] bg-transparent hover:bg-[#F5F5F5]"
          } cursor-pointer`}>
          All Users
        </Button>
        <Button
          onClick={() => setView("walker")}
          className={`px-4 py-2 rounded ${
            view === "walker"
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "border-[#E0E0E0] text-[#616161] bg-transparent hover:bg-[#F5F5F5]"
          } cursor-pointer`}>
          Pet Walker
        </Button>
        <Button
          onClick={() => setView("boarding")}
          className={`px-4 py-2 rounded ${
            view === "boarding"
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "border-[#E0E0E0] text-[#616161] bg-transparent hover:bg-[#F5F5F5]"
          } cursor-pointer`}>
          Pet Boarding
        </Button>
      </div>

      <div className="flex flex-col gap-5">
        {/* all user */}
        {view == "users" && (
          <div className="mt-4">
            {/* pagination button */}
            {userData && (
              <div className="mt-4 flex items-start justify-end px-14">
                <PaginationButton
                  page={page}
                  setPage={setPage}
                  data={userData}
                />
              </div>
            )}
            <div className="px-14 py-2">
              <UserTable
                headers={userHeaders}
                data={userData?.results || []}
                isLoading={isUserLoading}
                isError={isUserError}
              />
            </div>
          </div>
        )}

        {/* pending walker table */}
        {view == "walker" && (
          <div className="mt-4">
            {/* pagination button */}
            {walkerData && (
              <div className="mt-4 flex items-start justify-end px-14">
                <PaginationButton
                  page={walkerPage}
                  setPage={setWalkerPage}
                  data={walkerData}
                />
              </div>
            )}
            <div className="px-14 py-2">
              <UserTable
                headers={providerHeaders}
                data={walkerData?.results || []}
                isLoading={isWalkerLoading}
                isError={isWalkerError}
              />
            </div>
          </div>
        )}

        {/* pending boarding table */}
        {view == "boarding" && (
          <div className="mt-4">
            {/* pagination button */}
            {boardingData && (
              <div className="mt-4 flex items-start justify-end px-14">
                <PaginationButton
                  page={boardingPage}
                  setPage={setBoardingPage}
                  data={boardingData}
                />
              </div>
            )}
            {/* display table */}
            <div className="px-14 py-2">
              <UserTable
                headers={providerHeaders}
                data={boardingData?.results || []}
                isLoading={isBoardingLoading}
                isError={isBoardingError}
              />
            </div>
          </div>
        )}
      </div>
    </UserLayoutPage>
  );
};
