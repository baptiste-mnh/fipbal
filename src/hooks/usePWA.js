import { useState, useEffect } from "react";

export const usePWA = () => {
  const [canInstall, setCanInstall] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [hasNativePrompt, setHasNativePrompt] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Check if browser supports beforeinstallprompt
    const supportsInstallPrompt = "onbeforeinstallprompt" in window;

    // Set initial hasNativePrompt based on browser support
    setHasNativePrompt(supportsInstallPrompt);

    // Check if app is already installed
    const checkStandalone = () => {
      const standalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        window.navigator.standalone ||
        document.referrer.includes("android-app://");
      setIsStandalone(standalone);

      if (!standalone) {
        setCanInstall(true);
      }
    };

    checkStandalone();

    // Handle beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsReady(true);
      setCanInstall(true);

      // Show prompt if not dismissed and not standalone
      const dismissed = localStorage.getItem("pwa-install-dismissed");
      if (!dismissed && !isStandalone) {
        setShowInstallPrompt(true);
      }
    };

    // Handle app installed event
    const handleAppInstalled = () => {
      setCanInstall(false);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
      setHasNativePrompt(false);
      setIsStandalone(true);
      localStorage.removeItem("pwa-install-dismissed");
    };

    // Add event listeners
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    // Check manifest and service worker
    const checkPWARequirements = async () => {
      // Check manifest
      const manifestLink = document.querySelector('link[rel="manifest"]');

      if (manifestLink) {
        try {
          const response = await fetch(manifestLink.href);
          const manifest = await response.json();
        } catch (error) {
          // Silent fail
        }
      }

      // Check service worker
      if ("serviceWorker" in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
      }
    };

    checkPWARequirements();

    // Show fallback prompt after delay if no native prompt
    const fallbackTimer = setTimeout(() => {
      const dismissed = localStorage.getItem("pwa-install-dismissed");
      if (!isStandalone && !dismissed && !deferredPrompt) {
        setIsReady(true);
        setShowInstallPrompt(true);
      }
    }, 2000);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
      clearTimeout(fallbackTimer);
    };
  }, [isStandalone]);

  const install = async () => {
    if (!deferredPrompt) {
      return false;
    }

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === "accepted") {
        setCanInstall(false);
        setShowInstallPrompt(false);
        setDeferredPrompt(null);
        setHasNativePrompt(false);
      }

      return outcome === "accepted";
    } catch (error) {
      return false;
    }
  };

  const dismiss = () => {
    setShowInstallPrompt(false);
    localStorage.setItem("pwa-install-dismissed", "true");
  };

  return {
    canInstall,
    isStandalone,
    showInstallPrompt,
    hasNativePrompt,
    isReady,
    install,
    dismiss,
  };
};
