export function warning(message, throwable) {
  if (throwable) {
    console.error(message, throwable);
  } else {
    console.error(message);
  }
  if (process.env.NODE_ENV === "development") {
    try {
      throw new Error(message);
    } catch (e) {}
  }
}
