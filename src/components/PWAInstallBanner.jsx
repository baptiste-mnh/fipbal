import { X, Download } from "lucide-react";
import { usePWA } from "../hooks/usePWA";

const PWAInstallBanner = () => {
  const {
    canInstall,
    isStandalone,
    showInstallPrompt,
    hasNativePrompt,
    isReady,
    install,
    dismiss,
  } = usePWA();

  const canUseNativeInstall = hasNativePrompt;

  if (!showInstallPrompt || isStandalone || !canUseNativeInstall) {
    return null;
  }

  const getInstallInstructions = () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isChrome = /Chrome/.test(navigator.userAgent);
    const isFirefox = /Firefox/.test(navigator.userAgent);
    const isSafari = /Safari/.test(navigator.userAgent) && !isChrome;

    if (isIOS && isSafari) {
      return "Appuyez sur l'icône de partage puis 'Ajouter à l'écran d'accueil'";
    } else if (isChrome) {
      return "Cliquez sur les 3 points ⋮ puis 'Installer Weather Comparison'";
    } else if (isFirefox) {
      return "Cliquez sur les 3 lignes ☰ puis 'Installer'";
    }
    return "Utilisez les options de votre navigateur pour installer cette app";
  };

  const handleInstallClick = () => {
    if (isReady) {
      install();
    }
  };

  return (
    <div
      data-testid="pwa-install-banner"
      className="fixed bottom-4 left-4 right-4 md:left-auto md:max-w-sm z-50 bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 rounded-xl shadow-xl p-6 backdrop-blur-sm"
    >
      {/* Close button */}
      <button
        onClick={dismiss}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X size={18} />
      </button>

      {/* App icon */}
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 rounded-xl overflow-hidden mr-3">
          <img
            src="/fipbab.png"
            alt="Fait-il plus beau à Lorient qu'à Brest ?"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Installer l&apos;app</h3>
          <p className="text-sm text-gray-600">
            Fait-il plus beau à Lorient qu&apos;à Brest ?
          </p>
        </div>
      </div>

      {/* Installation instructions for fallback */}
      {!canInstall && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-700">{getInstallInstructions()}</p>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleInstallClick}
          disabled={!isReady}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            isReady
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          <Download size={16} />
          Installer
        </button>
        <button
          onClick={dismiss}
          className="px-4 py-2 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors"
        >
          Plus tard
        </button>
      </div>
    </div>
  );
};

export default PWAInstallBanner;
