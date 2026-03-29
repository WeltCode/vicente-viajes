const CONSENT_STORAGE_KEY = "vv_cookie_consent";
const CONSENT_COOKIE_NAME = "vv_cookie_consent";
const CONSENT_VERSION = "1.0";
const CONSENT_MAX_AGE_SECONDS = 60 * 60 * 24 * 180; // 180 dias
const CONSENT_MAX_AGE_MS = CONSENT_MAX_AGE_SECONDS * 1000;

const DEFAULT_PREFERENCES = {
  necessary: true,
  security: true,
  preferences: false,
  analytics: false,
  marketing: false,
};

let gaScriptLoaded = false;

function isHttps() {
  return typeof window !== "undefined" && window.location.protocol === "https:";
}

function safeJsonParse(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function writeConsentCookie(consent) {
  if (typeof document === "undefined") return;

  const encoded = encodeURIComponent(JSON.stringify(consent));
  const secureFlag = isHttps() ? "; Secure" : "";
  document.cookie = `${CONSENT_COOKIE_NAME}=${encoded}; Max-Age=${CONSENT_MAX_AGE_SECONDS}; Path=/; SameSite=Lax${secureFlag}`;
}

function clearConsentCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${CONSENT_COOKIE_NAME}=; Max-Age=0; Path=/; SameSite=Lax`;
}

function readConsentCookie() {
  if (typeof document === "undefined") return null;

  const pair = document.cookie
    .split("; ")
    .find((item) => item.startsWith(`${CONSENT_COOKIE_NAME}=`));

  if (!pair) return null;

  const value = pair.slice(CONSENT_COOKIE_NAME.length + 1);
  return safeJsonParse(decodeURIComponent(value));
}

function normalizeConsent(rawConsent) {
  if (!rawConsent || typeof rawConsent !== "object") return null;

  const decidedAt = rawConsent.decidedAt || new Date().toISOString();
  const decidedAtMs = Date.parse(decidedAt);
  if (!Number.isFinite(decidedAtMs)) return null;
  if (Date.now() - decidedAtMs > CONSENT_MAX_AGE_MS) return null;

  return {
    version: rawConsent.version || CONSENT_VERSION,
    decidedAt,
    preferences: {
      ...DEFAULT_PREFERENCES,
      ...(rawConsent.preferences || {}),
      necessary: true,
      security: true,
    },
  };
}

export function getConsent() {
  if (typeof window === "undefined") return null;

  const fromStorage = safeJsonParse(window.localStorage.getItem(CONSENT_STORAGE_KEY));
  const normalizedStorage = normalizeConsent(fromStorage);
  if (normalizedStorage) return normalizedStorage;

  if (fromStorage && !normalizedStorage) {
    clearConsent();
  }

  const normalizedCookie = normalizeConsent(readConsentCookie());
  if (normalizedCookie) {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(normalizedCookie));
    return normalizedCookie;
  }

  if (readConsentCookie() && !normalizedCookie) {
    clearConsent();
  }

  return null;
}

export function saveConsent(preferences) {
  if (typeof window === "undefined") return null;

  const consent = normalizeConsent({
    version: CONSENT_VERSION,
    decidedAt: new Date().toISOString(),
    preferences,
  });

  window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consent));
  writeConsentCookie(consent);

  window.dispatchEvent(new CustomEvent("vv:cookie-consent-updated", { detail: consent }));

  return consent;
}

export function acceptAllCookies() {
  return saveConsent({
    necessary: true,
    security: true,
    preferences: true,
    analytics: true,
    marketing: true,
  });
}

export function rejectOptionalCookies() {
  return saveConsent({
    necessary: true,
    security: true,
    preferences: false,
    analytics: false,
    marketing: false,
  });
}

export function clearConsent() {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(CONSENT_STORAGE_KEY);
  clearConsentCookie();
}

export function openCookieSettings() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("vv:open-cookie-settings"));
}

function ensureGtagBase() {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() {
    window.dataLayer.push(arguments);
  };
}

function ensureGaScriptLoaded() {
  if (typeof document === "undefined" || gaScriptLoaded) return;

  const measurementId = import.meta.env.VITE_GA4_MEASUREMENT_ID;
  if (!measurementId) return;

  const alreadyInDom = document.querySelector(`script[data-ga4-id=\"${measurementId}\"]`);
  if (alreadyInDom) {
    gaScriptLoaded = true;
    return;
  }

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  script.setAttribute("data-ga4-id", measurementId);
  document.head.appendChild(script);

  gaScriptLoaded = true;
}

function getConsentState(consent) {
  const analyticsGranted = Boolean(consent?.preferences?.analytics);
  const preferencesGranted = Boolean(consent?.preferences?.preferences);
  const marketingGranted = Boolean(consent?.preferences?.marketing);

  return {
    analytics_storage: analyticsGranted ? "granted" : "denied",
    ad_storage: marketingGranted ? "granted" : "denied",
    ad_user_data: marketingGranted ? "granted" : "denied",
    ad_personalization: marketingGranted ? "granted" : "denied",
    functionality_storage: preferencesGranted ? "granted" : "denied",
    security_storage: "granted",
  };
}

export function initializeConsentMode() {
  if (typeof window === "undefined") return;

  ensureGtagBase();

  // AEPD/ePrivacy: por defecto, todo lo opcional denegado antes de cualquier medicion.
  window.gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    functionality_storage: "denied",
    security_storage: "granted",
    wait_for_update: 500,
  });

  const consent = getConsent();
  if (consent) {
    applyConsentMode(consent);
  }
}

export function applyConsentMode(consent) {
  if (typeof window === "undefined") return;

  ensureGtagBase();

  const measurementId = import.meta.env.VITE_GA4_MEASUREMENT_ID;
  const consentState = getConsentState(consent);
  const analyticsGranted = consentState.analytics_storage === "granted";
  const marketingGranted = consentState.ad_storage === "granted";

  if (measurementId) {
    window[`ga-disable-${measurementId}`] = !analyticsGranted;
  }

  if (analyticsGranted && measurementId) {
    ensureGaScriptLoaded();
    window.gtag("js", new Date());
    window.gtag("config", measurementId, {
      anonymize_ip: true,
      allow_google_signals: marketingGranted,
    });
  }

  window.gtag("consent", "update", consentState);
}

export function getDefaultPreferences() {
  return { ...DEFAULT_PREFERENCES };
}
