
self.addEventListener("push", (event) => {
  console.log("Push received:", event);

  const data = event.data ? event.data.json() : {};

  self.registration.showNotification(data.title || "Notification", {
    body: data.message || "No message",
    icon: "/assets/images/logo.webp",
  });
});
