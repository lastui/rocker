export function warning(message, throwable) {
  if (throwable !== undefined) {
    console.error(message, throwable);
  } else {
    console.error(message);
  }
}
