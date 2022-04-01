export function warning(message, throwable) {
  if (typeof console !== "undefined" && typeof console.error === "function") {
    if (throwable) {
      console.error(message, throwable);
    } else {
      console.error(message);
    }
  }
  try {
    throw new Error(message);
  } catch (e) {}
}
