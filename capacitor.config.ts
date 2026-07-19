import type { CapacitorConfig } from "@capacitor/cli";

// appId is a placeholder — replace with your own reverse-domain identifier
// (e.g. com.yourcompany.steady) before registering the app with Apple/Google.
// It must be unique and can't be changed later without republishing as a new app.
const config: CapacitorConfig = {
  appId: "com.steady.app",
  appName: "Steady",
  webDir: "dist",
  backgroundColor: "#fafaf5",
  ios: {
    contentInset: "always",
  },
  android: {
    backgroundColor: "#fafaf5",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 400,
      backgroundColor: "#fafaf5",
      androidSplashResourceName: "splash",
      showSpinner: false,
    },
  },
};

export default config;
