# Review Wise: A Comprehensive Review Platform

## Table of Contents

* [Overview](#overview)
* [System Architecture](#system-architecture)
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

Review Wise is a platform designed to facilitate the collection and display of user reviews for businesses. This platform provides core features such as business registration, review submission, and review retrieval, along with additional features like user accounts, review voting, and moderation. This README provides a comprehensive overview of the system's architecture, features, and technical requirements.

## System Architecture

The application follows a layered architecture, promoting separation of concerns and maintainability. Here's a breakdown of the layers:

* **Presentation Layer:** Handles API requests and responses. Uses the Hono framework.
* **Business Layer:** Contains the core business logic, including services for managing businesses, reviews, and users.
* **Domain Layer:** Defines the core business entities (Business, Review, User) and their associated logic.
* **Data Access Layer:** Provides an abstraction over the database, handling data persistence and retrieval using PostgreSQL and `pgtyped`.

### Application Layers

Here's a more detailed look at each layer, incorporating information from the code:

* **Presentation Layer**
    * **Purpose:** Handles HTTP requests and responses, input validation, and serialization/deserialization.
    * **Technologies:** Hono framework, `openapi-hono`, `scalar`, `zod`.
    * **Key Components:**
        * Controllers: Handle request processing and coordinate with the Business Layer. (e.g., `BusinessController`, `AuthController`).
        * Routes: Define API endpoints and map them to controller actions (e.g., `business.routes.ts`, `auth.routes.ts`).
        * Middleware: Handles cross-cutting concerns such as logging, error handling, and authentication (`pino-logger.middleware.ts`, `error-handler.middleware.ts`, `auth.middleware.ts`).
        * Schemas: Define the structure of request and response data using `zod`. For example, `IdSchema`, `GetBusinessReviewsSchema`.
        * OpenAPI: Defines API documentation.
* **Business Layer**
    * **Purpose:** Implements the core business logic of the application.
    * **Key Components:**
        * Services: Provide specific business functionalities, such as:
            * `BusinessService`: Manages business registration and retrieval. Implements `IBusinessService` (defined in `business.service.interface.ts`).
            * `ReviewService`: Handles review submission and retrieval. Implements `IReviewService` (defined in `review.service.interface.ts`).
            * `UserService`: Manages user registration and authentication. Implements `IUserService` (defined in `user.service.interface.ts`).
            * `BunPasswordService`: Handles password hashing. Implements `IPasswordService` (defined in `password.service.interface.ts`).
            * `HonoJwtService`: Handles JWT signing and verification. Implements `IJwtService` (defined in `jwt.service.interface.ts`).
        * Interfaces: Define contracts for services (e.g., `IBusinessService`, `IUserService`).
* **Domain Layer**
    * **Purpose:** Defines the core business entities and their behavior.
    * **Key Components:**
        * Entities: Represent the core domain objects:
            * `Business`: Represents a business entity.
            * `Review`: Represents a review entity.
            * `User`: Represents a user entity.
        * Entity Logic: Entities may contain methods that encapsulate business logic (e.g., `Business.calculateAverageRating()`).
* **Data Access Layer**
    * **Purpose:** Handles communication with the database.
    * **Technologies:** PostgreSQL, `pg`, `pgtyped`.
    * **Key Components:**
        * Repositories: Implement data access logic for each entity:
            * `BusinessRepository`: Handles data access for businesses. Implements `IBusinessRepository` (defined in `business.repository.interface.ts`).
            * `ReviewRepository`: Handles data access for reviews. Implements `IReviewRepository` (defined in `review.repository.interface.ts`).
            * `UserRepository`: Handles data access for users. Implements `IUserRepository` (defined in `user.repository.interface.ts`).
        * Interfaces: Define contracts for repositories (e.g., `IBusinessRepository`, `IReviewRepository`).
        * Types: Define types specific to the data access layer (e.g., `BusinessRepositoryTypes`, `ReviewRepositoryTypes`, `UserRepositoryTypes`).

### Data Flow

Here's an ASCII diagram illustrating the typical data flow for a request:

```
+---------------------+
|  1. Controller      |
+---------------------+
         |
         V
+---------------------+
|  2. Request DTO     |
+---------------------+
         |
         V
+---------------------+
|  3. Service         |
|  (Business Logic)   |
+---------------------+
         |
         V
+---------------------+
|  4. Domain Entities |
+---------------------+
         |
         V
+---------------------+
|  5. Data Access Layer|
|  (Repositories)      |
+---------------------+
         |
         V
+---------------------+
|  6. Response DTO    |
+---------------------+
         |
         V
+---------------------+
|  7. Response        |
+---------------------+
```

1.  **Controller:** Receives an HTTP request.
2.  **Request DTO:** The request data is mapped to a Data Transfer Object (DTO) for validation and transfer to the service layer.
3.  **Service:** The service layer processes the request, interacting with domain entities and repositories.
4.  **Domain Entities:** Services use domain entities to enforce business logic.
5.  **Data Access Layer:** Repositories handle database interactions (CRUD operations).
6.  **Response DTO:** The service may return a DTO to the controller.
7.  **Response:** The controller constructs and sends the HTTP response.

## Core Features

1.  **Business Registration:** Businesses can register and create a profile, including details like name and description.
2.  **Review Submission:** Users can submit reviews for registered businesses, including a rating and textual content.
3.  **Review Retrieval:** Users and businesses can retrieve reviews for a specific business, with options for pagination and sorting.
4.  **Business Profile Retrieval:** Retrieval of business details, including the average rating.
5.  **User Authentication:** Users can register and log in to the system.
6.  **API Documentation:** The API is documented using OpenAPI.

## Technical Requirements

* Backend Framework: Hono
* Database: PostgreSQL
* Database Tooling: `pg`, `pgtyped`
* Validation: `zod`
* Documentation: `openapi-hono`, `scalar`
* Password Hashing: `bun`
* JWT: `hono/jwt`
* Logging: `pino`, `hono-pino`, `pino-pretty`
* Error Handling: Centralized error handling middleware.
* Testing: Unit tests for API endpoints and business logic.
* Design Pattern: Repository Pattern, Service Layer
* Security:
    * Authentication using JWT.
    * Input validation.
    * Rate limiting (recommended).
* Caching: In-memory caching (with a plan to use Redis).
* Load Testing: Use `oha` or a similar tool for load testing.

## ERD (Entity-Relationship Diagram)

```sql
Enum UserRole:
  ├── BUSINESS
  ├── REVIEWER
  └── ADMIN

Table: users
  ┌────────────┬───────────────────────────────┐
  │ user_id    │ SERIAL [pk, increment]        │
  │ email      │ VARCHAR [unique, not null]    │
  │ password   │ VARCHAR [not null]            │
  │ role       │ UserRole [not null]           │
  └────────────┴───────────────────────────────┘

         │
         │
         ▼
Table: business
  ┌────────────┬───────────────────────────────┐
  │ business_id│ SERIAL [pk, increment]        │
  │ user_id    │ INT [not null]                │◄──────────────────────────────┐
  │ name       │ VARCHAR [not null]            │                               │
  │ description│ VARCHAR [not null]            │                               │
  └────────────┴───────────────────────────────┘                               │
                                                                               │
         │                                                                     │
         │                                                                     │
         ▼                                                                     │
Table: review                                                                  │
  ┌────────────┬────────────────────────────────────────────────────────────┐  |
  │ review_id  │ SERIAL [pk, increment]                                     │  | 
  │ business_id│ INT [not null]                                             │──┘
  │ rating     │ INT [not null]                                             │
  │ title      │ VARCHAR [not null]                                         │
  │ description│ VARCHAR [not null]                                         │
  │ created_at │ TIMESTAMP [not null, default: CURRENT_TIMESTAMP]           │
  └────────────┴────────────────────────────────────────────────────────────┘
```

## API Endpoints

### Business API

* `POST /api/v1/businesses`: Register a new business.
* `GET /api/v1/businesses/:id`: Get a business's details.
* `GET /api/v1/businesses/:id/reviews`: Get a business's reviews.
* `POST /api/v1/businesses/:id/reviews`: Submit a review for a business.

### Authentication API

* `POST /api/v1/auth/login`: Log in a user (business or reviewer).

## How to Run the Application

1.  **Prerequisites:**
    * PostgreSQL database.
    * Node.js and Bun.sh installed.
    * Docker and docker-compose installed.
2.  **Installation:**
    * Clone the repository.
    * Install dependencies: `bun install`.
3.  **Configuration Setup:**
    * Database setup is handled by docker-compose.
    * You can modify configuration in docker-compose.yml file.
    * You must add environment variables to a `.env` file according to `.env.example`.
4.  **Run the application:** Run `bun dev`. defaults to port `3000`.
5.  **API Documentation:** Access the API documentation at the configured OpenAPI endpoint `/reference`.

## Extension Features

The following are some potential extension features:

* User Accounts for Reviewers: Implement user profiles for reviewers.
* Review Upvoting/Downvoting: Allow users to vote on the helpfulness of reviews.
* Flagging Reviews: Enable users to flag reviews for moderation.
* Business Responses to Reviews: Allow businesses to respond to reviews.
* Advanced Rating Aggregation: Implement more sophisticated rating calculations.
* Search Functionality: Enable searching for businesses and reviews.
* Notifications: Implement notifications (e.g., email) for new reviews.
* Analytics Dashboard: Provide analytics for businesses.
