# Review Wise: A Comprehensive Review Platform

## Table of Contents

* [Overview](#overview)
* [Hexagonal Architecture](#hexagonal-architecture)

  * [Application Layers](#application-layers)
  * [Data Flow](#data-flow)
* [Core Features](#core-features)
* [Technical Requirements](#technical-requirements)
* [ERD (Entity-Relationship Diagram)](#erd-entity-relationship-diagram)
* [API Endpoints](#api-endpoints)

  * [Business API](#business-api)
  * [Authentication API](#authentication-api)
* [How to Run the Application](#how-to-run-the-application)
* [Extension Features](#extension-features)

## Overview

**Review Wise** is a modular platform for collecting and displaying user reviews for businesses. It follows **Hexagonal Architecture (Ports and Adapters)** to ensure separation of concerns, testability, and adaptability to various interfaces and infrastructure. Core features include business registration, user authentication, review submission and retrieval, as well as support for caching and OpenAPI-based documentation.

---

## Hexagonal Architecture

The application is structured according to the **Hexagonal Architecture**, where core business logic is isolated from external concerns such as databases, web frameworks, or caching systems.

### Architecture Overview

![image](https://github.com/user-attachments/assets/b546403d-24ba-41ad-a5f7-b3d9f9a8fa8f)

* **Core (Inside the Hexagon):**

  * **Domain Layer:** Contains the essential domain entities and business rules (e.g., `Business`, `Review`, `User`).
  * **Application Layer:** Contains services that orchestrate use cases using domain models and port interfaces.

* **Ports (Boundaries of the Hexagon):**

  * **Input Ports:** Interfaces defining how the core logic can be invoked (e.g., `RegisterBusinessPort`, `ReviewBusinessPort`).
  * **Output Ports:** Interfaces for infrastructure-level operations (e.g., `CachePort`, `RepositoryPorts`, `PasswordPort`, `JwtPort`).

* **Adapters (Outside the Hexagon):**

  * **Driving Adapters:** HTTP controllers and routes built using Hono framework.
  * **Driven Adapters:** Implementations of infrastructure logic like PostgreSQL repositories, Redis/in-memory cache, and password hashing.

---

### Application Layers

#### 1. **Presentation Layer (Driving Adapter)**

* **Purpose:** Handle HTTP communication using the Hono framework.
* **Components:**

  * Controllers: `auth.controller.ts`, `business.controller.ts`
  * Middleware: `auth.middleware.ts`, `error-handler.middleware.ts`, `rate-limiter.middleware.ts`
  * Routes: Defined in `*.routes.ts`
  * Schemas: Validation using `zod`
  * OpenAPI docs: Generated via `openapi-hono`

#### 2. **Application Layer**

* **Purpose:** Execute core business use cases.
* **Components:**

  * Services: `BusinessService`, `ReviewService`, `UserService`
  * Ports (Input): Define expected inputs for use cases (`register-business.port.ts`, `review-business.port.ts`)

#### 3. **Domain Layer**

* **Purpose:** Models domain entities and encapsulates business logic.
* **Entities:**

  * `Business`: Includes business logic like `calculateAverageRating()`
  * `Review`, `User`

#### 4. **Infrastructure Layer (Driven Adapters)**

* **Purpose:** Implements interfaces for persistence, caching, and security.
* **Components:**

  * **Database:** PostgreSQL using `pgtyped` (`postgres.data-source.ts`)
  * **Caching:** In-memory (`memory-cache.adapter.ts`) and Redis (`redis-cache.adapter.ts`) with a common `CachePort`
  * **Security:** Password hashing (`bun`, `bcrypt`) and JWT using `HonoJwtService`
  * **Repositories:** Concrete implementations for `UserRepository`, `ReviewRepository`, `BusinessRepository`

---

### Data Flow

```
┌────────────────────┐
│ 1. Controller      │
└────────────────────┘
         │
         ▼
┌────────────────────┐
│ 2. Request DTO     │
└────────────────────┘
         │
         ▼
┌────────────────────┐
│ 3. Input Port      │
└────────────────────┘
         │
         ▼
┌────────────────────┐
│ 4. Application Svc │
└────────────────────┘
         │
         ▼
┌────────────────────┐
│ 5. Domain Entity   │
└────────────────────┘
         │
         ▼
┌────────────────────┐
│ 6. Output Port     │
└────────────────────┘
         │
         ▼
┌───────────────────────┐
│ 7. Adapter (DB/Cache) │
└───────────────────────┘
         │
         ▼
┌────────────────────┐
│ 8. Response DTO    │
└────────────────────┘
         │
         ▼
┌────────────────────┐
│ 9. HTTP Response   │
└────────────────────┘
```

---

## Core Features

1. **Business Registration**
2. **User Authentication**
3. **Review Submission & Retrieval**
4. **Business Profile Viewing with Average Rating**
5. **OpenAPI Documentation**
6. **Caching Layer**

   * Uses an abstraction over `CachePort`
   * Supports both in-memory and Redis-based caching
   * Improves performance for read-heavy endpoints like reviews retrieval

---

## Technical Requirements

* **Backend Framework:** Hono
* **Architecture Style:** Hexagonal Architecture (Ports & Adapters)
* **Database:** PostgreSQL
* **ORM/Query Builder:** `pgtyped`
* **Caching:** In-memory (default) and Redis-ready
* **Validation:** `zod`
* **API Documentation:** `openapi-hono`, `scalar`
* **Security:**

  * Password Hashing: `bun`, `bcrypt`
  * Authentication: JWT (`hono/jwt`)
  * Rate Limiting: Middleware-enabled
* **Logging:** `pino`, `hono-pino`, `pino-pretty`
* **Testing:** Unit testing for services and endpoints
* **Load Testing:** `oha` or equivalent

---

## ERD (Entity-Relationship Diagram)

```sql
Enum UserRole:
  ├── BUSINESS
  ├── REVIEWER
  └── ADMIN

Table: users
  ┌────────────┬───────────────────────────────┐
  │ user_id    │ SERIAL [pk]                   │
  │ email      │ VARCHAR [unique, not null]    │
  │ password   │ VARCHAR [not null]            │
  │ role       │ UserRole [not null]           │
  └────────────┴───────────────────────────────┘

         │
         ▼
Table: business
  ┌────────────┬───────────────────────────────┐
  │ business_id│ SERIAL [pk]                   │
  │ user_id    │ INT [fk to users]             │
  │ name       │ VARCHAR [not null]            │
  │ description│ VARCHAR [not null]            │
  └────────────┴───────────────────────────────┘

         │
         ▼
Table: review
  ┌────────────┬─────────────────────────────────────────────┐
  │ review_id  │ SERIAL [pk]                                 │
  │ business_id│ INT [fk to business]                        │
  │ rating     │ INT [1–5]                                   │
  │ title      │ VARCHAR [not null]                          │
  │ description│ VARCHAR [not null]                          │
  │ created_at │ TIMESTAMP [default: CURRENT_TIMESTAMP]      │
  └────────────┴─────────────────────────────────────────────┘
```

---

## API Endpoints

### Business API

* `POST /api/v1/businesses` – Register a business
* `GET /api/v1/businesses/:id` – Get business details (with average rating)
* `GET /api/v1/businesses/:id/reviews` – List reviews for a business
* `POST /api/v1/businesses/:id/reviews` – Submit a review

### Authentication API

* `POST /api/v1/auth/login` – Log in (JWT-based)

---

## How to Run the Application

1. **Requirements:**

   * Node.js and Bun.sh
   * Docker + docker-compose
   * PostgreSQL database

2. **Install dependencies:**

   ```bash
   bun install
   ```

3. **Setup Configuration:**

   * Add `.env` file based on `.env.example`
   * Start PostgreSQL using `docker-compose up -d`

4. **Run the Application:**

   ```bash
   bun dev
   ```

5. **View API Documentation:**
   Visit: `http://localhost:3000/reference`

---

## Extension Features

* Reviewer Profiles
* Review Voting (upvote/downvote)
* Review Moderation (flagging)
* Business Reply to Reviews
* Advanced Rating Algorithms
* Search & Filtering
* Notification System (email/web)
* Business Analytics Dashboard
