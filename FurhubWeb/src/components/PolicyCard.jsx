import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller, useWatch } from "react-hook-form";

export const PolicyCard = ({
  policy,
  index,
  togglePolicy,
  handlePolicyChange,
  errors,
  control,
}) => {
  // read the active value from RHF so the card always reflects form state
  const isActive = useWatch({
    control,
    name: `boarding_policy.${index}.active`,
    defaultValue: policy.active,
  });
  const handleDecimalInput = (e) => {
    let value = e.currentTarget.value;

    // Allow only digits and decimal point
    value = value.replace(/[^0-9.]/g, "");

    // Prevent multiple decimals
    const parts = value.split(".");
    if (parts.length > 2) {
      value = parts[0] + "." + parts.slice(1).join("");
    }

    // Restrict to 2 decimal places
    if (parts[1]?.length > 2) {
      value = parts[0] + "." + parts[1].slice(0, 2);
    }

    // Prevent leading "-"
    if (value.startsWith("-")) {
      value = value.replace("-", "");
    }

    e.currentTarget.value = value;
  };
  return (
    <div
      className={`relative border p-4 rounded-lg space-y-3 ${
        isActive ? "bg-[#FAFAFA]" : "bg-gray-200 opacity-60"
      }`}>
      {/* Toggle button */}
      <button
        type="button"
        className={`absolute top-1 right-2 ${
          isActive
            ? "text-red-500 hover:text-red-700"
            : "text-green-600 hover:text-green-800"
        }`}
        onClick={() => togglePolicy(index)}>
        {isActive ? "✕" : "↺"}
      </button>

      <div className="space-y-2">
        {/* Description */}
        <p className="text-md text-[#424242] font-bold">Policy Description</p>
        <Controller
          control={control}
          name={`boarding_policy.${index}.description`}
          defaultValue={policy.description}
          render={({ field }) => (
            <Textarea
              className="h-52"
              disabled={!isActive}
              placeholder="Enter policy details..."
              {...field}
            />
          )}
        />

        {/* Policy Type */}
        <Controller
          control={control}
          name={`boarding_policy.${index}.policy_type`}
          defaultValue={policy.policy_type}
          render={({ field }) => (
            <Select
              disabled={!isActive}
              value={field.value}
              onValueChange={(val) => field.onChange(val)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Policy Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="late_pickup">Late Pickup</SelectItem>
                <SelectItem value="cancellation">Cancellation</SelectItem>
              </SelectContent>
            </Select>
          )}
        />

        {/* Fee */}
        <Controller
          control={control}
          name={`boarding_policy.${index}.fee`}
          defaultValue={policy.fee}
          render={({ field }) => (
            <Input
              type="text"
              maxLength={10}
              inputMode="numeric"
              disabled={!isActive}
              placeholder="Fee (optional)"
              {...field}
              onInput={(e) => {
                handleDecimalInput(e);
                // update react-hook-form's value from DOM after sanitizing
                field.onChange(e.currentTarget.value);
              }}
            />
          )}
        />

        {/* Grace Period */}
        <Controller
          control={control}
          name={`boarding_policy.${index}.grace_period_minutes`}
          defaultValue={policy.grace_period_minutes}
          render={({ field }) => (
            <Input
              type="text"
              disabled={!isActive}
              maxLength={3}
              placeholder="Grace Period (minutes)"
              {...field}
              onInput={(e) => {
                e.currentTarget.value = e.currentTarget.value.replace(
                  /\D/g,
                  ""
                );
                field.onChange(e.currentTarget.value);
              }}
            />
          )}
        />
      </div>
    </div>
  );
};
