/**
 * Pulls an invite code out of either a pasted link (with or without a
 * protocol/host) or a bare code typed directly — both are valid input for
 * the "join with a link or code" fields.
 */
export function extractCode(input: string, param: "team" | "code"): string {
  const trimmed = input.trim();
  if (!trimmed) return "";

  try {
    const withProtocol = /^[a-z]+:\/\//i.test(trimmed)
      ? trimmed
      : `https://${trimmed}`;
    const url = new URL(withProtocol);
    const fromUrl = url.searchParams.get(param);
    if (fromUrl) return fromUrl;
  } catch {
    /* not URL-shaped — treat the whole input as a bare code */
  }

  return trimmed;
}
