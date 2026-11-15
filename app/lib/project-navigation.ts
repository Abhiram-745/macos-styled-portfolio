const PROJECT_HASH = "#projects/";

export const projectPayload = (id: string) => `project:${id}`;

export const projectIdFromPayload = (payload?: string) =>
  payload?.startsWith("project:") ? payload.slice(8) || null : null;

export const projectHash = (id: string) =>
  `${PROJECT_HASH}${encodeURIComponent(id)}`;

export const projectIdFromHash = (hash: string): string | null => {
  if (!hash.startsWith(PROJECT_HASH)) return null;
  try {
    const id = decodeURIComponent(hash.slice(PROJECT_HASH.length));
    return id && !id.includes("/") ? id : null;
  } catch {
    return null;
  }
};

export const replaceProjectHash = (id: string | null) => {
  const hash = id ? projectHash(id) : "";
  if (window.location.hash === hash) return;
  window.history.replaceState(
    null,
    "",
    `${window.location.pathname}${window.location.search}${hash}`
  );
};
