"use client";

import { useEffect, useState } from "react";
import { fetchSettings } from "@/lib/settings";

export default function SetFavicon() {
  const [favicon, setFavicon] = useState("");

  useEffect(() => {
    const loadFavicon = async () => {
      const settings = await fetchSettings();
      if (settings.favicon) {
        setFavicon(settings.favicon);
      }
    };
    loadFavicon();
  }, []);

  useEffect(() => {
    if (favicon) {
      const existingLink = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
      if (existingLink) {
        existingLink.href = favicon;
      } else {
        const link = document.createElement("link");
        link.type = "image/x-icon";
        link.rel = "icon";
        link.href = favicon;
        document.head.appendChild(link);
      }
    }
  }, [favicon]);

  return null;
}
