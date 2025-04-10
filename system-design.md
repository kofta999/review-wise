2025-04-07 16:01
Tags: #projects
##### Content
## Application Layers
- **Presentation**
	- Use prefix `/api/v1`
	- [[review wise project#API Endpoints|Endpoints]]

- **Business**
	- Businesses Service
		- `registerBusiness`
		- `getBusinessById`
	- Reviews Service
		- `reviewBusiness`
		- `getReviewsForBusiness`
	- Admin Service
		- `removeBusiness`
		- `removeReview`

- **Domain**
	- Business Entity
		- Attributes similar to its table
		- Additional Methods
			- `calculateAverageRating`
			- `generateSlug`
	
	- Review Entity
		- Attributes similar to its table
		- Additional Methods
			- will be decided later

- **Data Access**
	- Business DAO (data access object) methods
		- `create`
		- `remove`
		- `getById`
	
	- Review DAO methods
		- `create`
		- `remove`
		- `getReviewsForBusiness`
		- `getRatingsForBusiness`

## Core Features:
1.  **Business Registration:**
    * Allow businesses to register and create a profile on your platform.

2.  **Review Submission:**
    * Enable users to submit reviews for registered businesses. This would include text content, a star rating (or similar), and potentially optional fields.

3.  **Review Retrieval:**
    * Allow users (and businesses) to retrieve reviews for a specific business. This would likely involve pagination and sorting options (e.g., most recent, highest rated).

4.  **Business Profile Retrieval:**
    * Enable retrieval of business details and their overall rating.

5.  **Admin/Moderation (Basic):**
    * Potentially include basic administrative endpoints for managing businesses and reviews (e.g., deleting inappropriate reviews).

## Technical Requirements
* **Caching:** Cache frequently accessed business profiles, aggregated ratings, and potentially lists of recent reviews.

- **Error Handling:** Should handle all errors accordingly, in services and routes.

* **Logging:** Log API requests, review submissions, moderation actions, and errors.

* **JWT / OAuth:** Implement authentication for businesses to manage their profiles and potentially for users to submit reviews (to prevent anonymous spam, though Trustpilot allows some anonymous reviews). OAuth could be used for social login for reviewers.

* **Unit Testing:** Test your API endpoints, data models, review submission/retrieval logic, and rating aggregation functions.

* **Any Design Pattern:**
    * **Repository Pattern:** For data access to businesses and reviews.
    * **Service Layer:** To handle business logic related to review processing and rating calculations.
	
* **CI/CD Pipeline:** Automate the build, test, and deployment of your API to AWS.

* **AWS Deployment (Lambda Preferred):** Design your API to be deployed as Lambda functions behind API Gateway. This could be more challenging due to the potentially stateful nature of some aspects, but it's a good exercise in serverless architecture. Consider how you'd handle data persistence and potential rate limiting at the API Gateway level.

* **Basic Security Practices like Rate Limiting:** Implement rate limiting on review submission and potentially retrieval endpoints to prevent abuse. Input validation will be crucial for review content.

* **Fully Documented:** Document your API endpoints, request/response formats, and authentication mechanisms using OpenAPI/Swagger.

* **High Load:** Use benchmark testing tools

## Tech Stack
- Backend Framework: `hono`
- Database Tooling: `pg`, `pgtyped`
- Validation Library: `zod`
- Documentation: `openapi-hono`, `scalar`
- Logging: `pino`, `hono-pino`, `pino-pretty`
- Caching: in-memory then use redis later
- Load testing: try `oha` for basic testing then use a well-made tool

## Extension Features
* **User Accounts for Reviewers:** Implement user registration and profiles for reviewers.

* **Review Upvoting/Downvoting:** Allow users to vote on the helpfulness of reviews.

* **Flagging Reviews:** Enable users to flag reviews for moderation.

* **Business Responses to Reviews:** Allow businesses to respond to reviews.

* **More Advanced Rating Aggregation:** Implement weighted averages, handling of spam reviews, etc.

* **Search Functionality:** Allow users to search for businesses and reviews.

* **Notifications:** Implement email notifications for businesses when they receive new reviews.

* **Analytics Dashboard:** Create basic analytics for businesses to track their reviews and ratings.

## ERD
```
Table "business" {
  "business_id" serial [pk, increment]
  "name" varchar
  "description" varchar
  // "avatar_url" varchar
}

Table "review" {
  "review_id" serial [pk, increment]
  "business_id" int
  "rating" int
  "title" varchar
  "description" varchar
  "created_at" timestamp
}

Table "admin" {
  "admin_id" serial [pk, increment]
  "email" varchar
  "password" varchar
}

Ref:"business"."business_id" < "review"."business_id"
```

## API Endpoints

- `/businesses`
	- `POST /` Register a new business
	- `GET /:id` Get a business's details
	- `GET /:id/reviews` Get a business's reviews
	- `POST /:id/reviews` Submit a review for the business
	
- `/admin`
	- `DELETE /reviews` Deletes a review

## Data Flow
1.  **Controller:** Receives raw request -> Maps to **Request DTO** -> Sends DTO to Service.

2.  **Service:** Receives **Request DTO** -> Interacts with **Domain Entities** (creates, updates, retrieves via Data Access) -> May return **Domain Entities** to other services or maps to **Response DTO**.

3.  **Data Access:** Receives **Domain Entities** (for persistence) -> Interacts with the database. Retrieves raw data -> Maps raw data to **Domain Entities** -> Returns **Domain Entities** to the Service.

4.  **Controller:** Receives **Response DTO** from Service -> Transforms to HTTP response.

##### References
[[TrustPilot.excalidraw|Diagrams]]
[ERD](https://dbdiagram.io/d/67f3d63f4f7afba184a2b5b0)