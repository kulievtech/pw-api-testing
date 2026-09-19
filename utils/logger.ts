export class APILogger {
  private recentLogs: any[] = [];

  /**
   * Logs the details of an API request.
   * @param method - The HTTP method of the request (e.g., GET, POST).
   * @param url - The URL of the request.
   * @param header - The headers of the request as a key-value pair object.
   * @param body - The body of the request (optional).
   */
  logRequest(
    method: "GET" | "POST" | "PUT" | "DELETE",
    url: string,
    header: Record<string, string>,
    body?: any,
  ) {
    const logEntry = { method, url, header, body };
    this.recentLogs.push({ type: "Request Details", data: logEntry });
  }

  /**
   * Logs the details of an API response.
   * @param statusCode - The HTTP status code of the response.
   * @param body - The body of the response (optional).
   */
  logResponse(statusCode: number, body?: any) {
    const logEntry = { statusCode, body };
    this.recentLogs.push({ type: "Response Details", data: logEntry });
  }

  /**
   * Retrieves the recent logs in a formatted string.
   * @returns A string representation of the recent logs.
   */
  getRecentLogs() {
    const logs = this.recentLogs
      .map((log) => {
        return `===${log.type}===\n${JSON.stringify(log.data, null, 4)}`;
      })
      .join("\n\n");

    return logs;
  }
}
