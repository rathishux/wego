import type { CapacitorConfig } from "@capacitor/cli";

// appId must be unique and can't be changed later without republishing as a new app.
const config: CapacitorConfig = {
  appId: "com.rathish.steady",
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
