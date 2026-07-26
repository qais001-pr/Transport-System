import { useEffect } from "react";
import apiConstant from "../api/apiConstant";

const publicVapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;

if (!publicVapidKey) {
  console.error("VAPID key is missing in env");
}

function urlBase64ToUint8Array(base64String) {
  if (!base64String) {
    throw new Error("VAPID public key is missing");
  }

  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);

  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

export const usePush = (userId) => {
  useEffect(() => {
    console.log("user id....", userId);
    if (!userId) {
      console.log("userId not provided");
      return;
    }
    const register = async () => {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") return;

      const registration = await navigator.serviceWorker.register("/sw.js");

      //   const subscription = await registration.pushManager.subscribe({
      //     userVisibleOnly: true,
      //     applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
      //   });

      const existing = await registration.pushManager.getSubscription();

      let subscription = existing;

      if (!existing) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
        });
      }

      await fetch(`${apiConstant.baseUrl}/subscribe`, {
        method: "POST",
        body: JSON.stringify({ subscription, userId }),
        headers: { "Content-Type": "application/json" },
      });
    };

    register();
  }, [userId]);
};
