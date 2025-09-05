import React from "react";

export const ProviderTable = () => {
  return (
    <div className="w-full h-full bg-amber-100">
      <table className="">
        <thead>
          <tr className="">
            <th>Applicant ID</th>
            <th>Role Applied</th>
            <th>Requirements</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>
  );
};
