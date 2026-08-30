// Resolves a Minecraft profile from a Microsoft OAuth access token, via the
// standard chain third-party Minecraft launchers use (see
// https://wiki.vg/Microsoft_Authentication_Scheme): Xbox Live -> XSTS ->
// Minecraft services. Server-side only — the Microsoft/Xbox/Minecraft
// tokens involved must never reach the client.
//
// Requires the Microsoft OAuth token to have been granted the
// `XboxLive.signin offline_access` scope (see signInWithAzure in
// auth-client.ts).

export type MinecraftProfile = {
  uuid: string;
  username: string;
};

type XboxAuthResponse = {
  Token: string;
  DisplayClaims: { xui: { uhs: string }[] };
};

async function xboxLiveAuthenticate(
  microsoftAccessToken: string,
): Promise<XboxAuthResponse> {
  const res = await fetch("https://user.auth.xboxlive.com/user/authenticate", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      Properties: {
        AuthMethod: "RPS",
        SiteName: "user.auth.xboxlive.com",
        RpsTicket: `d=${microsoftAccessToken}`,
      },
      RelyingParty: "http://auth.xboxlive.com",
      TokenType: "JWT",
    }),
  });
  if (!res.ok) {
    throw new Error(`Xbox Live authenticate failed: ${res.status}`);
  }
  return res.json();
}

async function xstsAuthorize(xboxLiveToken: string): Promise<XboxAuthResponse> {
  const res = await fetch("https://xsts.auth.xboxlive.com/xsts/authorize", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      Properties: { SandboxId: "RETAIL", UserTokens: [xboxLiveToken] },
      RelyingParty: "rp://api.minecraftservices.com/",
      TokenType: "JWT",
    }),
  });
  if (!res.ok) {
    // Common case: XErr 2148916233 (no Xbox account) / 2148916238 (child
    // account needs family group). Not an error worth surfacing to the
    // user — it just means there's no Minecraft profile to link.
    throw new Error(`XSTS authorize failed: ${res.status}`);
  }
  return res.json();
}

async function loginWithXbox(
  userHash: string,
  xstsToken: string,
): Promise<{ access_token: string }> {
  const res = await fetch(
    "https://api.minecraftservices.com/authentication/login_with_xbox",
    {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        identityToken: `XBL3.0 x=${userHash};${xstsToken}`,
      }),
    },
  );
  if (!res.ok) {
    throw new Error(`Minecraft login_with_xbox failed: ${res.status}`);
  }
  return res.json();
}

async function fetchMinecraftProfile(
  minecraftAccessToken: string,
): Promise<MinecraftProfile | null> {
  const res = await fetch("https://api.minecraftservices.com/minecraft/profile", {
    headers: { Authorization: `Bearer ${minecraftAccessToken}` },
  });
  if (res.status === 404) return null; // Microsoft account owns no Minecraft license
  if (!res.ok) {
    throw new Error(`Minecraft profile fetch failed: ${res.status}`);
  }
  const data = (await res.json()) as { id: string; name: string };
  return { uuid: data.id, username: data.name };
}

// Never throws — returns null for any failure in the chain (no Xbox
// account, no Minecraft license, transient API error, etc.), since not
// having a linked Minecraft profile is an expected, common outcome, not a
// sign-in failure.
export async function resolveMinecraftProfile(
  microsoftAccessToken: string,
): Promise<MinecraftProfile | null> {
  try {
    const xbl = await xboxLiveAuthenticate(microsoftAccessToken);
    const userHash = xbl.DisplayClaims.xui[0]?.uhs;
    if (!userHash) return null;

    const xsts = await xstsAuthorize(xbl.Token);
    const mc = await loginWithXbox(userHash, xsts.Token);
    return await fetchMinecraftProfile(mc.access_token);
  } catch (err) {
    console.error("Minecraft profile resolution failed:", err);
    return null;
  }
}
