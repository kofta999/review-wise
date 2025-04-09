import type { ContentfulStatusCode } from "hono/utils/http-status";

export class BaseApiError extends Error {
  code: ContentfulStatusCode;

  constructor(code: ContentfulStatusCode) {
    super();
    this.code = code;
  }
}
