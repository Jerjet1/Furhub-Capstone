// utils/formErrors.ts
export function extractErrorMessages(errors, parentKey = "") {
  let messages = [];

  for (const key in errors) {
    if (!errors[key]) continue;

    const currentKey = parentKey ? `${parentKey}.${key}` : key;

    if (errors[key].message) {
      messages.push(errors[key].message);
    }

    if (errors[key].types) {
      messages = messages.concat(Object.values(errors[key].types));
    }

    if (errors[key].length) {
      errors[key].forEach((item, idx) => {
        messages = messages.concat(
          extractErrorMessages(item, `${currentKey}[${idx}]`)
        );
      });
    }

    if (errors[key].type === "object" || typeof errors[key] === "object") {
      messages = messages.concat(extractErrorMessages(errors[key], currentKey));
    }
  }

  return messages;
}
