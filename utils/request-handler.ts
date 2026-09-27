import { APIRequestContext, expect } from "@playwright/test";
import { APILogger } from "./logger";

export class RequestHandler {
  private request: APIRequestContext;
  private logger: APILogger;
  private baseUrl?: string;
  private defaultBaseUrl: string;
  private apiPath: string = "";
  private queryParams: object = {};
  private requestHeaders: Record<string, string> = {};
  private requestBody: object = {};

  constructor(
    request: APIRequestContext,
    apiBaseUrl: string,
    logger: APILogger,
  ) {
    this.request = request;
    this.defaultBaseUrl = apiBaseUrl;
    this.logger = logger;
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

  /**
   * Sends a GET request and verifies the expected response status code.
   *
   * @param statusCode - The expected HTTP response status code.
   * @returns The parsed JSON response body.
   */
  async getRequest(statusCode: number) {
    const url = this.getUrl();

    this.logger.logRequest("GET", url, this.requestHeaders);

    const response = await this.request.get(url, {
      headers: this.requestHeaders,
    });

    this.cleanUpFields();

    const actualStatusCode = response.status();
    const responseJSON = await response.json();

    this.logger.logResponse(actualStatusCode, responseJSON);
    this.statusCodeValidator(actualStatusCode, statusCode, this.getRequest);

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

    this.logger.logRequest("POST", url, this.requestHeaders, this.requestBody);

    const response = await this.request.post(url, {
      headers: this.requestHeaders,
      data: this.requestBody,
    });

    this.cleanUpFields();

    const actualStatusCode = response.status();
    const responseJSON = await response.json();

    this.logger.logResponse(actualStatusCode, responseJSON);
    this.statusCodeValidator(actualStatusCode, statusCode, this.postRequest);

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

    this.logger.logRequest("PUT", url, this.requestHeaders, this.requestBody);

    const response = await this.request.put(url, {
      headers: this.requestHeaders,
      data: this.requestBody,
    });

    this.cleanUpFields();

    const actualStatusCode = response.status();
    const responseJSON = await response.json();

    this.logger.logResponse(actualStatusCode, responseJSON);
    this.statusCodeValidator(actualStatusCode, statusCode, this.putRequest);

    return responseJSON;
  }

  /**
   * Sends a DELETE request and verifies the expected response status code.
   *
   * @param statusCode - The expected HTTP response status code.
   */
  async deleteRequest(statusCode: number) {
    const url = this.getUrl();

    this.logger.logRequest("DELETE", url, this.requestHeaders);

    const response = await this.request.delete(url, {
      headers: this.requestHeaders,
    });

    this.cleanUpFields();

    const actualStatusCode = response.status();

    this.logger.logResponse(actualStatusCode);
    this.statusCodeValidator(actualStatusCode, statusCode, this.deleteRequest);
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

  private cleanUpFields() {
    this.requestBody = {};
    this.requestHeaders = {};
    this.queryParams = {};
    this.baseUrl = undefined;
    this.apiPath = "";
  }
}
