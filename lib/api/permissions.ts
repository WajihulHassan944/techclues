import { api } from "./client";

export const PERMISSION_MODULES = [
  "inbox",
  "bookings",
  "blog",
  "homepage",
  "case-studies",
  "services",
  "faqs",
  "footer-links",
  "testimonials",
  "media",
  "newsletter",
  "email-templates",
  "seo",
] as const;
export type PermissionModuleKey = (typeof PERMISSION_MODULES)[number];
export type PermissionLevel = "none" | "view" | "edit";
export type PermissionMap = Record<PermissionModuleKey, PermissionLevel>;

const ALL_NONE = Object.fromEntries(PERMISSION_MODULES.map((m) => [m, "none"])) as PermissionMap;

/** In-memory only, same lifetime as the access token — re-fetched after login/refresh. */
let myPermissions: PermissionMap = ALL_NONE;

export const getPermission = (module: PermissionModuleKey): PermissionLevel => myPermissions[module] ?? "none";
export const canView = (module: PermissionModuleKey) => getPermission(module) !== "none";
export const canEdit = (module: PermissionModuleKey) => getPermission(module) === "edit";

export async function loadMyPermissions() {
  try {
    myPermissions = await api.get<PermissionMap>("/api/admin/my-permissions");
  } catch {
    myPermissions = ALL_NONE;
  }
  return myPermissions;
}
