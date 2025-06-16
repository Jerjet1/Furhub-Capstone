export const handleNumberChange = (e, setValue) => {
  const input = e.target.value;
  if (/^\d*$/.test(input)) {
    setValue(input);
  }
};
