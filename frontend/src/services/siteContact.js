export const siteContact = {
  companyName: "Vicente Viajes",
  phoneDigits: "34612477810",
  phoneDisplay: "+34 612 47 78 10",
  phoneHref: "tel:+34612477810",
  email: "info@vicenteviajes.com",
  emailHref: "mailto:info@vicenteviajes.com",
  addressLine1: "Avenida del Marqués de Corbera 46, Local 1",
  addressLine2: "28017 Madrid, España",
  addressShort: "Av. Marqués de Corbera 46, Madrid",
};

export function buildWhatsAppUrl(message = "") {
  const baseUrl = `https://wa.me/${siteContact.phoneDigits}`;
  const normalizedMessage = String(message || "").trim();
  return normalizedMessage
    ? `${baseUrl}?text=${encodeURIComponent(normalizedMessage)}`
    : baseUrl;
}