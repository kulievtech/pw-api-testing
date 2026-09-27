import { APILogger } from "../utils/logger";
import { RequestHandler } from "../utils/request-handler";
import { config } from "../api-test.config";
import { request } from "@playwright/test";

export async function createToken(
  email: string,
  password: string,
): Promise<string> {
  const context = await request.newContext();
  const logger = new APILogger();
  const api = new RequestHandler(context, config.baseUrl, logger);

  try {
    const loginResponse = await api
      .path("/users/login")
      .body({
        user: {
          email: email,
          password: password,
        },
      })
      .postRequest(200);

    return `Token ${loginResponse.user.token}`;
  } catch (error) {
    if (error instanceof Error) {
      Error.captureStackTrace(error, createToken);
    }
    throw error;
  } finally {
    await context.dispose();
  }
}
