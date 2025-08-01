import { Request } from "express";
import { WebAuthService } from "../service";

export async function authGuard(request: Request) {
  const v2Token = request.cookies["Authorization-V2"];
  const v1Token =
    request.cookies["Authorization"] || request.headers["authorization"];

  const webAuthService = new WebAuthService({
    clientId: process.env["AUTH_CLIENT_ID"],
    clientSecret: process.env["AUTH_CLIENT_SECRET"],
    redirectUri: process.env["AUTH_REDIRECT_URI"],
    tenantId: process.env["AUTH_TENANT_ID"],
  });

  if (v2Token) {
    const validation = await webAuthService.validateToken(v2Token);
    if (!validation.valid || !validation.claims) {
      return { hasPermission: false, error: validation.error };
    }
  } else if (v1Token) {
    // implement legacy validation
  }

  if (!v2Token && !v1Token) {
    return false;
  }
  return true;
}
