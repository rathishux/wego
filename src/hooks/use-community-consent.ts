import * as React from "react";

const CONSENT_KEY = "steady.community.consentGivenAt";

export function useCommunityConsent() {
  const [hasConsented, setHasConsented] = React.useState(
    () => localStorage.getItem(CONSENT_KEY) !== null,
  );

  function giveConsent() {
    localStorage.setItem(CONSENT_KEY, String(Date.now()));
    setHasConsented(true);
  }

  return { hasConsented, giveConsent };
}
