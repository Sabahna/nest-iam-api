// src/metabase/metabase.controller.ts
import {
  BadRequestException,
  Controller,
  Get,
  InternalServerErrorException,
  Query,
  Req,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";
import * as jwt from "jsonwebtoken";
import { Public } from "nest-iam";

type RequestUser = {
  id: string;
  // Example locked-parameter field (optional)
  accountId?: string;
};

type RequestWithUser = Request & { user?: RequestUser };

type GuestEmbedPayload = {
  resource: { dashboard: number };
  params: Record<string, unknown>;
  exp: number;
};

@Controller("metabase")
@Public(true)
export class MetabaseController {
  constructor(private readonly config: ConfigService) {}

  @Get("guest-token")
  // Add your auth guard here if needed
  // @UseGuards(AuthGuard("jwt"))
  getGuestToken(
    @Req() req: RequestWithUser,
    @Query("dashboardId") dashboardIdQuery?: string,
  ) {
    const secret = this.config.get<string>("METABASE_EMBEDDING_SECRET_KEY");
    if (!secret) {
      throw new InternalServerErrorException(
        "METABASE_EMBEDDING_SECRET_KEY is not set",
      );
    }

    const defaultDashboardId = this.config.get<string>("METABASE_DASHBOARD_ID");
    const dashboardIdRaw = dashboardIdQuery ?? defaultDashboardId;
    const dashboardId = Number(dashboardIdRaw);

    if (!dashboardIdRaw || Number.isNaN(dashboardId) || dashboardId <= 0) {
      throw new BadRequestException("Invalid dashboardId");
    }

    const ttlSeconds = Number(
      this.config.get<string>("METABASE_TOKEN_TTL_SECONDS") ?? "600",
    );
    const now = Math.floor(Date.now() / 1000);

    const payload: GuestEmbedPayload = {
      resource: { dashboard: dashboardId },
      params: req.user?.accountId ? { account_id: [req.user.accountId] } : {},
      exp: now + ttlSeconds,
    };

    const token = jwt.sign(payload, secret);

    return {
      token,
      expiresAt: payload.exp,
    };
  }
}
