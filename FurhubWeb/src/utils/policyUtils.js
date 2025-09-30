import { toast } from "sonner";

// Function to add a new policy
export const addPolicy = (policies, setPolicies) => {
  if (policies.length > 1) {
    toast.warning("maximum policy 2 only");
    return;
  }
  setPolicies((prev) => [
    ...prev,
    {
      policy_type: "",
      description: "",
      fee: "",
      grace_period_minutes: "",
      active: true, // default true
    },
  ]);
};

// Function to handle input changes for policies
export const handlePolicyChange = (setPolicies) => (index, field, value) => {
  setPolicies((prev) =>
    prev.map((policy, i) =>
      i === index ? { ...policy, [field]: value } : policy
    )
  );
};

// Function to toggle active/inactive state of policy
export const togglePolicyActive = (setPolicies) => (index) => {
  setPolicies((prev) =>
    prev.map((policy, i) =>
      i === index ? { ...policy, active: !policy.active } : policy
    )
  );
};
