import React, { useEffect, useMemo, useState } from "react";
import { Cookie, ShieldCheck, BarChart3, SlidersHorizontal, Megaphone, X } from "lucide-react";
import {
  acceptAllCookies,
  applyConsentMode,
  getConsent,
  getDefaultPreferences,
  rejectOptionalCookies,
  saveConsent,
} from "../../services/cookieConsent";

function ToggleRow({ icon: Icon, title, description, checked, disabled, onChange }) {
  return (
    <div className="rounded-xl border border-forest/10 bg-sand/40 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-3">
          <div className="mt-0.5 h-9 w-9 rounded-lg bg-white flex items-center justify-center border border-forest/10">
            <Icon className="h-4 w-4 text-teal" />
          </div>
          <div>
            <p className="font-semibold text-forest text-sm">{title}</p>
            <p className="text-xs text-forest/65 mt-1">{description}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onChange}
          disabled={disabled}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? "bg-teal" : "bg-forest/20"} ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
          aria-pressed={checked}
          aria-label={`Alternar ${title}`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${checked ? "translate-x-5" : "translate-x-1"}`}
          />
        </button>
      </div>
    </div>
  );
}

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [preferences, setPreferences] = useState(getDefaultPreferences());
  const [hasStoredConsent, setHasStoredConsent] = useState(false);

  useEffect(() => {
    const existingConsent = getConsent();
    if (existingConsent) {
      setPreferences(existingConsent.preferences);
      applyConsentMode(existingConsent);
      setHasStoredConsent(true);
      setVisible(false);
      return;
    }

    setPreferences(getDefaultPreferences());
    setHasStoredConsent(false);
    setVisible(true);
  }, []);

  useEffect(() => {
    const onOpenSettings = () => {
      const existingConsent = getConsent();
      if (existingConsent) {
        setPreferences(existingConsent.preferences);
        setHasStoredConsent(true);
      }
      setVisible(true);
      setSettingsOpen(true);
    };

    const onConsentUpdated = (event) => {
      const consent = event?.detail || getConsent();
      if (!consent) return;
      setPreferences(consent.preferences);
      setHasStoredConsent(true);
      applyConsentMode(consent);
    };

    window.addEventListener("vv:open-cookie-settings", onOpenSettings);
    window.addEventListener("vv:cookie-consent-updated", onConsentUpdated);

    return () => {
      window.removeEventListener("vv:open-cookie-settings", onOpenSettings);
      window.removeEventListener("vv:cookie-consent-updated", onConsentUpdated);
    };
  }, []);

  const canClose = useMemo(() => hasStoredConsent, [hasStoredConsent]);

  const handleAcceptAll = () => {
    const consent = acceptAllCookies();
    applyConsentMode(consent);
    setHasStoredConsent(true);
    setVisible(false);
    setSettingsOpen(false);
  };

  const handleRejectOptional = () => {
    const consent = rejectOptionalCookies();
    applyConsentMode(consent);
    setHasStoredConsent(true);
    setVisible(false);
    setSettingsOpen(false);
  };

  const handleSaveSettings = () => {
    const consent = saveConsent(preferences);
    applyConsentMode(consent);
    setHasStoredConsent(true);
    setVisible(false);
    setSettingsOpen(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[120] p-3 sm:p-4">
      <div className="max-w-5xl mx-auto rounded-2xl border border-forest/15 bg-white shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-teal/10 to-sage/10 border-b border-forest/10 px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Cookie className="h-4 w-4 text-teal" />
            <p className="text-sm font-semibold text-forest">Configuración de cookies</p>
          </div>
          {canClose && (
            <button
              type="button"
              onClick={() => {
                setVisible(false);
                setSettingsOpen(false);
              }}
              className="h-8 w-8 rounded-lg border border-forest/10 hover:bg-white transition-colors flex items-center justify-center"
              aria-label="Cerrar panel de cookies"
            >
              <X className="h-4 w-4 text-forest/70" />
            </button>
          )}
        </div>

        <div className="px-4 sm:px-6 py-4 space-y-4">
          <p className="text-sm text-forest/75 leading-relaxed">
            Utilizamos cookies propias y de terceros para fines técnicos (siempre activas) y,
            solo si usted lo autoriza, para preferencias, analítica y marketing. Rechazar cookies
            opcionales es tan sencillo como aceptarlas.
          </p>
          <p className="text-xs text-forest/65 leading-relaxed">
            No instalamos cookies opcionales hasta que usted preste su consentimiento expreso.
            Continuar navegando no equivale a aceptar.
          </p>
          <p className="text-xs text-forest/65 leading-relaxed">
            Antes de aceptar, puede revisar nuestra{" "}
            <a href="/politica-de-cookies" className="text-teal underline hover:text-sage transition-colors">
              Política de Cookies
            </a>
            {" "}y la{" "}
            <a href="/politica-de-privacidad" className="text-teal underline hover:text-sage transition-colors">
              Política de Privacidad
            </a>
            .
          </p>

          {settingsOpen && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <ToggleRow
                icon={ShieldCheck}
                title="Necesarias y seguridad"
                description="Obligatorias para sesión, protección CSRF y estabilidad técnica del sitio."
                checked
                disabled
              />
              <ToggleRow
                icon={SlidersHorizontal}
                title="Preferencias"
                description="Guarda opciones de experiencia, como idioma y configuración visual."
                checked={preferences.preferences}
                onChange={() =>
                  setPreferences((prev) => ({ ...prev, preferences: !prev.preferences }))
                }
              />
              <ToggleRow
                icon={BarChart3}
                title="Analíticas"
                description="Mide el uso del sitio para mejorarlo (ej. GA4 con IP anonimizada)."
                checked={preferences.analytics}
                onChange={() =>
                  setPreferences((prev) => ({ ...prev, analytics: !prev.analytics }))
                }
              />
              <ToggleRow
                icon={Megaphone}
                title="Marketing"
                description="Permite personalización publicitaria y medición de campañas."
                checked={preferences.marketing}
                onChange={() =>
                  setPreferences((prev) => ({ ...prev, marketing: !prev.marketing }))
                }
              />
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleAcceptAll}
              className="px-4 py-2 rounded-xl bg-teal text-white text-sm font-semibold hover:bg-teal-dark transition-colors"
            >
              Aceptar todas
            </button>
            <button
              type="button"
              onClick={handleRejectOptional}
              className="px-4 py-2 rounded-xl border border-teal text-teal bg-white text-sm font-semibold hover:bg-teal/5 transition-colors"
            >
              Rechazar opcionales
            </button>
            {!settingsOpen ? (
              <button
                type="button"
                onClick={() => setSettingsOpen(true)}
                className="px-4 py-2 rounded-xl border border-teal text-teal bg-white text-sm font-semibold hover:bg-teal/5 transition-colors"
              >
                Configurar
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSaveSettings}
                className="px-4 py-2 rounded-xl border border-teal/30 text-teal text-sm font-semibold hover:bg-teal/5 transition-colors"
              >
                Guardar selección
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
