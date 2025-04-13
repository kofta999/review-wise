import { BaseApiError } from "./base-error";

export class ResourceAlreadyExists extends BaseApiError {
  constructor(type?: string) {
    super(409, `${type ?? "Resource"} Already exists`);
  }
}
