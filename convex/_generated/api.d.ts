/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as CustomPassword from "../CustomPassword.js";
import type * as ResendOTP from "../ResendOTP.js";
import type * as ResendOTPPasswordReset from "../ResendOTPPasswordReset.js";
import type * as admin from "../admin.js";
import type * as auth from "../auth.js";
import type * as dailyLogTemplates from "../dailyLogTemplates.js";
import type * as dailyLogs from "../dailyLogs.js";
import type * as feed from "../feed.js";
import type * as feedback from "../feedback.js";
import type * as forecast from "../forecast.js";
import type * as generator from "../generator.js";
import type * as http from "../http.js";
import type * as myFunctions from "../myFunctions.js";
import type * as newsletter from "../newsletter.js";
import type * as payments from "../payments.js";
import type * as prompts from "../prompts.js";
import type * as randomizer from "../randomizer.js";
import type * as score from "../score.js";
import type * as stripe from "../stripe.js";
import type * as templates from "../templates.js";
import type * as testing from "../testing.js";
import type * as userAttributes from "../userAttributes.js";
import type * as userSubscriptions from "../userSubscriptions.js";
import type * as users from "../users.js";
import type * as waitlist from "../waitlist.js";
import type * as webhooks from "../webhooks.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  CustomPassword: typeof CustomPassword;
  ResendOTP: typeof ResendOTP;
  ResendOTPPasswordReset: typeof ResendOTPPasswordReset;
  admin: typeof admin;
  auth: typeof auth;
  dailyLogTemplates: typeof dailyLogTemplates;
  dailyLogs: typeof dailyLogs;
  feed: typeof feed;
  feedback: typeof feedback;
  forecast: typeof forecast;
  generator: typeof generator;
  http: typeof http;
  myFunctions: typeof myFunctions;
  newsletter: typeof newsletter;
  payments: typeof payments;
  prompts: typeof prompts;
  randomizer: typeof randomizer;
  score: typeof score;
  stripe: typeof stripe;
  templates: typeof templates;
  testing: typeof testing;
  userAttributes: typeof userAttributes;
  userSubscriptions: typeof userSubscriptions;
  users: typeof users;
  waitlist: typeof waitlist;
  webhooks: typeof webhooks;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
