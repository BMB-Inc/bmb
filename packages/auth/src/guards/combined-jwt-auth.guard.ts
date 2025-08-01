import { WebAuthService } from "@bmb-inc/auth";
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Kysely } from "kysely";
import { UsersDB } from "@bmb-inc/types";

@Injectable()
export class CombinedJwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(CombinedJwtAuthGuard.name);
  private readonly jwtAuthGuard: CanActivate;
  private readonly webAuthService: WebAuthService;

  constructor(
    @Inject("USERS_DATABASE") private readonly usersDB: Kysely<UsersDB>
  ) {
    // Initialize the legacy JWT guard
    this.jwtAuthGuard = new (class extends AuthGuard("jwt") {})();

    // Initialize WebAuthService for V2 authentication
    const auth = {
      clientId: process.env["AUTH_CLIENT_ID"],
      clientSecret: process.env["AUTH_CLIENT_SECRET"],
      redirectUri: process.env["AUTH_REDIRECT_URI"],
      tenantId: process.env["AUTH_TENANT_ID"],
    };
    this.webAuthService = new WebAuthService(auth);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // First, try V2 authentication
    try {
      const v2Token = request.cookies["Authorization-V2"];
      if (v2Token) {
        this.logger.debug("Attempting V2 authentication");
        const decoded = await this.webAuthService.validateToken(v2Token);
        if (decoded.claims && decoded.claims.upn) {
          const user = await this.usersDB
            .selectFrom("User")
            .selectAll()
            .where("User.email", "=", decoded.claims.upn)
            .executeTakeFirst();

          if (decoded.claims.exp < Date.now() / 1000) {
            this.logger.debug("V2 authentication failed: Token expired");

            request.cookies["Authorization-V2"] = null;
            request.user = null;
            return false;
          }

          request.user = user;
        } else {
          this.logger.debug("V2 authentication failed: No upn found");
          request.cookies["Authorization-V2"] = null;
          request.user = null;
          return false;
        }
        this.logger.debug("V2 authentication successful");
        return true;
      }
    } catch (error: unknown) {
      this.logger.debug(
        "V2 authentication failed:",
        error instanceof Error ? error.message : String(error)
      );
      // Continue to legacy authentication
    }

    // Fall back to legacy authentication
    try {
      const legacyToken =
        request.cookies?.Authorization || request.headers?.authorization;

      if (legacyToken) {
        this.logger.debug("Attempting legacy authentication");
        const result = await this.jwtAuthGuard.canActivate(context);
        if (result) {
          this.logger.debug("Legacy authentication successful");
          return true;
        }
      }
    } catch (error: unknown) {
      this.logger.debug(
        "Legacy authentication failed:",
        error instanceof Error ? error.message : String(error)
      );
    }

    // If both methods fail
    this.logger.warn("Both V2 and legacy authentication failed");
    return false;
  }
}
