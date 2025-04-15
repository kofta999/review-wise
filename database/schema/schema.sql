CREATE TYPE UserRole AS ENUM ('BUSINESS', 'REVIEWER', 'ADMIN');

CREATE TABLE "user" (
    "user_id" SERIAL PRIMARY KEY,
    "email" VARCHAR UNIQUE NOT NULL,
    "password" VARCHAR NOT NULL,
    "role" UserRole NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "business" (
    "business_id" SERIAL PRIMARY KEY,
    "user_id" INT NOT NULL,
    "name" VARCHAR NOT NULL,
    "description" VARCHAR NOT NULL,
    FOREIGN KEY ("user_id") REFERENCES "user" ("user_id") ON DELETE CASCADE
);

CREATE TABLE "review" (
    "review_id" SERIAL PRIMARY KEY,
    "business_id" INT NOT NULL,
    "rating" INT NOT NULL,
    "title" VARCHAR NOT NULL,
    "description" VARCHAR NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("business_id") REFERENCES "business" ("business_id") ON DELETE CASCADE,
    CHECK ("rating" BETWEEN 1 AND 5)
);
