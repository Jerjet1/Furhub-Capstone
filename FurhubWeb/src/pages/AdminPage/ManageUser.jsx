import React from "react";
import { UserLayoutPage } from "../../components/Layout/UserLayoutPage";
import { ProviderTable } from "../../components/Tables/ProviderTable";
// import
export const ManageUser = () => {
  return (
    <UserLayoutPage>
      <div className="w-full h-full flex  bg-amber-100">
        <ProviderTable />
      </div>
    </UserLayoutPage>
  );
};
