/**
 * Utility to format timestamp like '05:42 PM' as seen in the mockup screenshots
 */
export const getCurrentTimeString = () => {
  const now = new Date();
  return now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};
