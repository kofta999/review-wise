import type { Pool } from "pg";

export class ReviewRepository {
  db: Pool;

  constructor(db: Pool) {
    this.db = db;
  }
}
