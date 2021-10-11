export function getCookie(cookieName) {
  const name = cookieName + "=";
  const decoded = decodeURIComponent(document.cookie);
  const parts = decoded.split("; ");

  let response;

  parts.forEach((val) => {
    if (val.indexOf(name) === 0) response = val.substring(name.length);
  });

  return response;
}

// log the pageview with their URL
export const pageview = (url) => {
  if (typeof window === "undefined") {
    return;
  }

  if (getCookie("etk-cookie-consent") === "true") {
    window.gtag("config", process.env.GOOGLE_ANALYTICS, {
      page_path: url,
    });
  }
};

// log specific events happening.
export const event = ({ action, params }) => {
  if (typeof window === "undefined") {
    return;
  }

  if (getCookie("etk-cookie-consent") === "true") {
    window.gtag("event", action, params);
  }
};
