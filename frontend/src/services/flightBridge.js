import airports from "../data/airports.json";

// Endpoint externo (contrato fijo): no renombrar campos del payload.
export const FLIGHT_BRIDGE_URL =
  "https://vuelos.vicenteviajes.com/wtc/vv/vuelos/QueryBridge.aspx";

const normalizeText = (value) =>
  String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const airportSearchIndex = airports.map((airport) => ({
  ...airport,
  // Campos normalizados para busqueda tolerante a acentos/mayusculas.
  normalizedId: normalizeText(airport.id),
  normalizedCity: normalizeText(airport.ciudad),
  normalizedValue: normalizeText(airport.value),
}));

const getMatchScore = (airport, query) => {
  if (airport.normalizedId === query) return 0;
  if (airport.normalizedId.startsWith(query)) return 1;
  if (airport.normalizedCity === query) return 2;
  if (airport.normalizedCity.startsWith(query)) return 3;
  if (airport.normalizedValue.startsWith(query)) return 4;
  if (airport.normalizedCity.includes(query)) return 5;
  return 6;
};

export const searchAirports = (query, limit = 8) => {
  // Busqueda principal para autocompletado de origen/destino.
  const normalizedQuery = normalizeText(query);
  if (normalizedQuery.length < 2) {
    // Evita sugerencias ruidosas con 1 caracter.
    return [];
  }

  return airportSearchIndex
    .filter(
      (airport) =>
        airport.normalizedId.includes(normalizedQuery) ||
        airport.normalizedCity.includes(normalizedQuery) ||
        airport.normalizedValue.includes(normalizedQuery)
    )
    .sort((left, right) => {
      const leftScore = getMatchScore(left, normalizedQuery);
      const rightScore = getMatchScore(right, normalizedQuery);
      if (leftScore !== rightScore) {
        return leftScore - rightScore;
      }
      return left.value.localeCompare(right.value, "es");
    })
    .slice(0, limit);
};

export const resolveAirport = (query) => {
  // Resolucion estricta usada al enviar formulario si no hubo click en sugerencia.
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) {
    return null;
  }

  return (
    airportSearchIndex.find((airport) => airport.normalizedId === normalizedQuery) ||
    airportSearchIndex.find((airport) => airport.normalizedValue === normalizedQuery) ||
    null
  );
};

export const formatBridgeDate = (value) => String(value || "").replaceAll("-", "");

// Helpers base64url para serializar payload dentro de la URL interna /buscar/:token.
const encodeBase64Url = (value) =>
  btoa(unescape(encodeURIComponent(value)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");

const decodeBase64Url = (value) => {
  const normalized = String(value || "")
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  const padding = normalized.length % 4;
  const padded = padding ? normalized + "=".repeat(4 - padding) : normalized;
  return decodeURIComponent(escape(atob(padded)));
};

export const buildFlightBridgePayload = ({
  tripType,
  originAirport,
  destinationAirport,
  departureDate,
  returnDate,
  adults,
  children,
  babies,
}) => ({
  // Nombres de claves exigidos por QueryBridge.aspx.
  startPt: originAirport.ciudad,
  endPt: destinationAirport.ciudad,
  startPtCode: originAirport.id,
  endPtCode: destinationAirport.id,
  startDt: formatBridgeDate(departureDate),
  endDt: tripType === "round-trip" ? formatBridgeDate(returnDate) : "",
  flightType: tripType === "round-trip" ? "1" : "0",
  adults: String(adults),
  children: String(children),
  infants: String(babies),
});

export const encodeFlightSearchPayload = (payload) =>
  // Permite transportar el payload por URL interna sin caracteres conflictivos.
  encodeBase64Url(JSON.stringify(payload));

export const decodeFlightSearchPayload = (value) => {
  try {
    return JSON.parse(decodeBase64Url(value));
  } catch {
    // Token invalido o manipulado.
    return null;
  }
};

export const submitFlightBridge = (payload, options = {}) => {
  const { target = "_self" } = options;
  // Se usa formulario POST nativo para compatibilidad con el motor externo.
  const form = document.createElement("form");
  form.method = "POST";
  form.action = FLIGHT_BRIDGE_URL;
  form.target = target;
  form.style.display = "none";

  Object.entries(payload).forEach(([key, value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = value;
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
};
