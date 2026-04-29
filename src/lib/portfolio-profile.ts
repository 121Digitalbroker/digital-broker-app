/**
 * Portfolio profile completion — data lives in Mongo `PortfolioUser`, not Clerk.
 * Clerk only handles authentication; personal / address fields are stored here.
 */
export type PortfolioUserProfileFields = {
  fullName?: string | null;
  phone?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  stateOrRegion?: string | null;
  postalCode?: string | null;
  country?: string | null;
};

export function isPortfolioProfileComplete(
  u: PortfolioUserProfileFields | null | undefined
): boolean {
  if (!u) return false;
  const required = [
    u.fullName,
    u.phone,
    u.addressLine1,
    u.city,
    u.stateOrRegion,
    u.postalCode,
    u.country,
  ];
  return required.every((v) => typeof v === "string" && v.trim().length > 0);
}
