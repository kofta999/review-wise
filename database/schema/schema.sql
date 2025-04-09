CREATE TABLE "business" (
    "business_id" SERIAL PRIMARY KEY,
    "name" VARCHAR NOT NULL,
    "description" VARCHAR NOT NULL
);

CREATE TABLE "review" (
    "review_id" SERIAL PRIMARY KEY,
    "business_id" INT NOT NULL,
    "rating" INT NOT NULL,
    "title" VARCHAR NOT NULL,
    "description" VARCHAR NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("business_id") REFERENCES "business" ("business_id"),
    CHECK ("rating" BETWEEN 1 AND 5)
);

CREATE TABLE "admin" (
    "admin_id" SERIAL PRIMARY KEY,
    "email" VARCHAR NOT NULL,
    "password" VARCHAR NOT NULL
);
