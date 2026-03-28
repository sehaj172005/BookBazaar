import PusherServer from "pusher";
import PusherClient from "pusher-js";

// Server-side Pusher (for triggering events)
export const pusherServer = process.env.PUSHER_APP_ID ? new PusherServer({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "us2",
  useTLS: true,
}) : null;

// Client-side Pusher (for subscribing to events)
export const pusherClient = (typeof window !== "undefined" && process.env.NEXT_PUBLIC_PUSHER_KEY)
  ? new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "us2",
    })
  : null;
