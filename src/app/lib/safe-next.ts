// Only a same-origin relative path is a safe redirect target. Rejects
// absolute/protocol-relative URLs ("//evil.com", "/\evil.com") and the
// userinfo-confusion trick ("@evil.com", which browsers resolve as
// `http://localhost:3000@evil.com` -> host "evil.com") by requiring the
// value to start with exactly one "/".
export function safeNext(raw: string | null | undefined): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//") || raw.startsWith("/\\")) {
    return "/";
  }
  return raw;
}
