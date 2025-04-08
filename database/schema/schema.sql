CREATE TABLE "business" (
    "business_id" SERIAL PRIMARY KEY,
    "name" VARCHAR,
    "description" VARCHAR
);

CREATE TABLE "review" (
    "review_id" SERIAL PRIMARY KEY,
    "business_id" INT,
    "rating" INT,
    "title" VARCHAR,
    "description" VARCHAR,
    "created_at" TIMESTAMP,
    FOREIGN KEY ("business_id") REFERENCES "business" ("business_id")
);

CREATE TABLE "admin" (
    "admin_id" SERIAL PRIMARY KEY,
    "email" VARCHAR,
    "password" VARCHAR
);
