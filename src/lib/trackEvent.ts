declare global {
  interface Window {
    fbq: (...args: any[]) => void;
  }
}

export const trackEvent = (
  eventName: string,
  data: Record<string, any> = {},
  eventID?: string
) => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", eventName, data, { eventID });
  }
};
