import { APIRequestContext, expect } from "@playwright/test";
import { APILogger } from "./logger";
import { test } from "@playwright/test";

export class RequestHandler {
  private request: APIRequestContext;
  private logger: APILogger;
  private baseUrl?: string;
  private defaultBaseUrl: string;
  private apiPath: string = "";
  private queryParams: object = {};
  private requestHeaders: Record<string, string> = {};
  private requestBody: object = {};
  private defaultAuthToken: string = "";
  private clearAuthFlag: boolean = false;

  constructor(
    request: APIRequestContext,
    apiBaseUrl: string,
    logger: APILogger,
    authToken: string = "",
  ) {
    this.request = request;
    this.defaultBaseUrl = apiBaseUrl;
    this.logger = logger;
    this.defaultAuthToken = authToken;
  }

  url(url: string): RequestHandler {
    this.baseUrl = url;
    return this;
  }

  path(path: string): RequestHandler {
    this.apiPath = path;
    return this;
  }

  params(params: object): RequestHandler {
    this.queryParams = params;
    return this;
  }

  headers(headers: Record<string, string>): RequestHandler {
    this.requestHeaders = headers;
    return this;
  }

  body(body: object): RequestHandler {
    this.requestBody = body;
    return this;
  }

  clearAuth(): RequestHandler {
    this.clearAuthFlag = true;
    return this;
  }

  /**
   * Sends a GET request and verifies the expected response status code.
   *
   * @param statusCode - The expected HTTP response status code.
   * @returns The parsed JSON response body.
   */
  async getRequest(statusCode: number) {
    const url = this.getUrl();
    const responseJSON = await test.step(`GET request to ${url}`, async () => {
      this.logger.logRequest("GET", url, this.getHeaders());

      const response = await this.request.get(url, {
        headers: this.getHeaders(),
      });

      this.cleanUpFields();

      const actualStatusCode = response.status();
      const responseJSON = await response.json();

      this.logger.logResponse(actualStatusCode, responseJSON);
      this.statusCodeValidator(actualStatusCode, statusCode, this.getRequest);

      return responseJSON;
    });

    return responseJSON;
  }

  /**
   * Sends a POST request and verifies the expected response status code.
   *
   * @param statusCode - The expected HTTP response status code.
   * @returns The parsed JSON response body.
   */
  async postRequest(statusCode: number) {
    const url = this.getUrl();

    const responseJSON = await test.step(`POST request to ${url}`, async () => {
      this.logger.logRequest("POST", url, this.getHeaders(), this.requestBody);

      const response = await this.request.post(url, {
        headers: this.getHeaders(),
        data: this.requestBody,
      });

      this.cleanUpFields();

      const actualStatusCode = response.status();
      const responseJSON = await response.json();

      this.logger.logResponse(actualStatusCode, responseJSON);
      this.statusCodeValidator(actualStatusCode, statusCode, this.postRequest);

      return responseJSON;
    });

    return responseJSON;
  }

  /**
   * Sends a PUT request and verifies the expected response status code.
   *
   * @param statusCode - The expected HTTP response status code.
   * @returns The parsed JSON response body.
   */
  async putRequest(statusCode: number) {
    const url = this.getUrl();

    const responseJSON = await test.step(`PUT request to ${url}`, async () => {
      this.logger.logRequest("PUT", url, this.getHeaders(), this.requestBody);

      const response = await this.request.put(url, {
        headers: this.getHeaders(),
        data: this.requestBody,
      });

      this.cleanUpFields();

      const actualStatusCode = response.status();
      const responseJSON = await response.json();

      this.logger.logResponse(actualStatusCode, responseJSON);
      this.statusCodeValidator(actualStatusCode, statusCode, this.putRequest);

      return responseJSON;
    });

    return responseJSON;
  }

  /**
   * Sends a DELETE request and verifies the expected response status code.
   *
   * @param statusCode - The expected HTTP response status code.
   */
  async deleteRequest(statusCode: number) {
    const url = this.getUrl();

    await test.step(`DELETE request to ${url}`, async () => {
      this.logger.logRequest("DELETE", url, this.getHeaders());

      const response = await this.request.delete(url, {
        headers: this.getHeaders(),
      });

      this.cleanUpFields();

      const actualStatusCode = response.status();

      this.logger.logResponse(actualStatusCode);
      this.statusCodeValidator(
        actualStatusCode,
        statusCode,
        this.deleteRequest,
      );
    });
  }

  private getUrl(): string {
    const url = new URL(
      `${this.baseUrl ?? this.defaultBaseUrl}${this.apiPath}`,
    );
    for (const [key, value] of Object.entries(this.queryParams)) {
      url.searchParams.append(key, value);
    }

    return url.toString();
  }

  private statusCodeValidator(
    actualStatusCode: number,
    expectedStatusCode: number,
    callingMethod: Function,
  ) {
    if (actualStatusCode !== expectedStatusCode) {
      const logs = this.logger.getRecentLogs();
      const error = new Error(
        `Expected status code ${expectedStatusCode}, but received ${actualStatusCode}\n\nRecent API Activity: \n${logs}`,
      );
      Error.captureStackTrace(error, callingMethod);

      throw error;
    }
  }

  private getHeaders() {
    if (!this.clearAuthFlag) {
      this.requestHeaders["Authorization"] =
        this.requestHeaders["Authorization"] || this.defaultAuthToken;
    }

    return this.requestHeaders;
  }

  private cleanUpFields() {
    this.requestBody = {};
    this.requestHeaders = {};
    this.queryParams = {};
    this.baseUrl = undefined;
    this.apiPath = "";
    this.clearAuthFlag = false;
  }
}
