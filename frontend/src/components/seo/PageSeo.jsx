import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const DEFAULT_SITE_NAME = "Vicente Viajes";
const DEFAULT_SITE_URL = (import.meta.env.VITE_SITE_URL || "https://vicenteviajes.com").replace(/\/$/, "");

function upsertMeta({ name, property, content }) {
  if (!content) return;

  const selector = name ? `meta[name="${name}"]` : `meta[property="${property}"]`;
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement("meta");
    if (name) {
      element.setAttribute("name", name);
    }
    if (property) {
      element.setAttribute("property", property);
    }
    document.head.appendChild(element);
  }

  element.setAttribute("content", content);
}

function upsertLink(rel, href) {
  if (!href) return;

  let element = document.head.querySelector(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", rel);
    document.head.appendChild(element);
  }

  element.setAttribute("href", href);
}

export default function PageSeo({
  title,
  description,
  path,
  type = "website",
  noIndex = false,
}) {
  const location = useLocation();

  useEffect(() => {
    const normalizedPath = path || location.pathname || "/";
    const canonicalUrl = `${DEFAULT_SITE_URL}${normalizedPath === "/" ? "" : normalizedPath}`;
    const fullTitle = title ? `${title} | ${DEFAULT_SITE_NAME}` : DEFAULT_SITE_NAME;
    const robots = noIndex ? "noindex, nofollow" : "index, follow";

    document.title = fullTitle;

    upsertMeta({ name: "description", content: description });
    upsertMeta({ name: "robots", content: robots });
    upsertMeta({ property: "og:site_name", content: DEFAULT_SITE_NAME });
    upsertMeta({ property: "og:locale", content: "es_ES" });
    upsertMeta({ property: "og:type", content: type });
    upsertMeta({ property: "og:title", content: fullTitle });
    upsertMeta({ property: "og:description", content: description });
    upsertMeta({ property: "og:url", content: canonicalUrl });
    upsertMeta({ name: "twitter:card", content: "summary" });
    upsertMeta({ name: "twitter:title", content: fullTitle });
    upsertMeta({ name: "twitter:description", content: description });
    upsertLink("canonical", canonicalUrl);
  }, [description, location.pathname, noIndex, path, title, type]);

  return null;
}