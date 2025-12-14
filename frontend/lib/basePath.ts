const rawBasePath = process.env.NEXT_PUBLIC_BASE_PATH?.trim() ?? "";
const normalizedBasePath =
  rawBasePath === "" ? "" : `/${rawBasePath.replace(/^\/|\/$/g, "")}`;

export function withBasePath(path: string) {
  if (!normalizedBasePath) {
    return path;
  }

  if (path.startsWith("/")) {
    return `${normalizedBasePath}${path}`;
  }

  return `${normalizedBasePath}/${path}`;
}

export { normalizedBasePath as basePath };
