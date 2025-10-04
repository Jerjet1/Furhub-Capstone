const regex = /^\d{0,10}(\.\d{0,2})?$/;

// Utility: keep value as number-formatted string with max 2 decimals
export const formatTwoDecimals = (val) => {
  if (val === "") return "";
  const num = Number(val);
  if (Number.isNaN(num)) return "";
  return parseFloat(num.toFixed(2)).toString();
};

export const handleHourlyChange = (e, setHourly) => {
  const input = e.target.value;
  if (input === "" || regex.test(input)) {
    // allow typing but when possible update formatted values
    setHourly(input);
  }
};

export const handleDailyChange = (e, setDaily) => {
  const input = e.target.value;
  if (input === "" || regex.test(input)) {
    setDaily(input);
  }
};

export const handleWeeklyChange = (e, setWeekly) => {
  const input = e.target.value;
  if (input === "" || regex.test(input)) {
    setWeekly(input);
  }
};
