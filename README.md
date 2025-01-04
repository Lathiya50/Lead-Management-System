# Lead Management System API

A comprehensive REST API for managing leads, contacts, and interactions for Key Account Managers (KAMs).

## Live Deployment

The application is live at: https://lead-management-system-675b.onrender.com

## Features

- Complete lead lifecycle management (New → Contacted → Qualified → Converting → Active)
- Contact management with primary contact designation
- Interaction tracking (calls, emails, meetings)
- Order management and tracking
- KAM performance metrics and dashboard
- Automated call scheduling based on defined frequencies

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose

## Prerequisites

- Node.js 14+
- MongoDB 4.4+
- npm or yarn
- Postman (for API testing)

## Installation

```bash
# Clone repository
git clone https://github.com/Lathiya50/Lead-Management-System

# Install dependencies
npm install

# Set environment variables
cp .env.example .env

# Start development server
npm run dev
```

## Environment Variables

```
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/lead-management
JWT_SECRET=your-jwt-secret
CORS_ORIGIN=https://example.com
```

## Setting Up Postman Collection

1. Download Postman Collection:
   - Download the `PostmanAPICollection.json` file from the repository

2. Import Collection in Postman:
   - Open Postman
   - Click on "Import" button in the top left
   - Drag and drop the `PostmanAPICollection.json` file or click "Upload Files" to select it
   - Click "Import" to confirm

3. Set Up Environment Variables:
   - Create a new environment in Postman (click on "New" → "Environment")
   - Add the following variables:
     - `base_url`: Your API base URL (e.g., `http://localhost:5000` for local development)
     - `jwt_token`: Your authentication token (will be filled after login)

4. Select Environment:
   - Choose your created environment from the environment dropdown in the top right

5. Authentication:
   - After logging in, copy the JWT token
   - Update the `jwt_token` environment variable with your token
   - All requests will automatically use this token for authentication

6. Testing API:
   - All endpoints are organized into folders by resource (Leads, Contacts, Interactions, Orders, KAMs)
   - Each request includes example data in the request body where applicable
   - You can modify the request parameters and body according to your needs

## API Documentation

### Authentication
All routes require JWT authentication. Include token in Authorization header:
```
Authorization: Bearer <token>
```

### API Endpoints

#### Leads
- `GET /api/v1/leads` - Get all leads with filtering & pagination
- `POST /api/v1/leads` - Create new lead
- `GET /api/v1/leads/:id` - Get single lead
- `PUT /api/v1/leads/:id` - Update lead
- `DELETE /api/v1/leads/:id` - Soft delete lead
- `GET /api/v1/leads/:id/stats` - Get lead performance stats
- `PATCH /api/v1/leads/:id/status` - Update lead status
- `GET /api/v1/leads/calls/today` - Get today's scheduled calls

#### Contacts
- `GET /api/v1/leads/:leadId/contacts` - Get all contacts for a lead
- `POST /api/v1/leads/:leadId/contacts` - Create new contact
- `GET /api/v1/leads/:leadId/contacts/:id` - Get single contact
- `PUT /api/v1/leads/:leadId/contacts/:id` - Update contact
- `DELETE /api/v1/leads/:leadId/contacts/:id` - Delete contact

#### Interactions
- `GET /api/v1/leads/:leadId/interactions` - Get lead interactions
- `POST /api/v1/leads/:leadId/interactions` - Create new interaction
- `GET /api/v1/leads/:leadId/interactions/:id` - Get single interaction
- `PUT /api/v1/leads/:leadId/interactions/:id` - Update interaction

#### Orders
- `GET /api/v1/leads/:leadId/orders` - Get all orders for a lead
- `POST /api/v1/leads/:leadId/orders` - Create new order
- `GET /api/v1/leads/:leadId/orders/:id` - Get single order
- `PUT /api/v1/leads/:leadId/orders/:id` - Update order
- `GET /api/v1/leads/:leadId/orders/stats` - Get order statistics

#### KAMs
- `GET /api/v1/kams` - Get all KAMs
- `POST /api/v1/kams` - Create new KAM
- `GET /api/v1/kams/:id` - Get single KAM
- `PUT /api/v1/kams/:id` - Update KAM
- `DELETE /api/v1/kams/:id` - Soft delete KAM
- `GET /api/v1/kams/:id/performance` - Get KAM performance metrics
- `GET /api/v1/kams/dashboard` - Get KAM dashboard data

#### Auth
- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login a user
- `GET /api/v1/auth/me` - Get current authenticated user


## Models

### Lead
- Restaurant name
- Business type
- Status (NEW/CONTACTED/QUALIFIED/CONVERTING/ACTIVE/INACTIVE)
- Assigned KAM
- Call frequency
- Next call date
- Address
- Rating
- Potential value

### Contact
- Name
- Role
- Email
- Phone
- Primary contact flag
- Preferred contact time

### Interaction
- Type (CALL/EMAIL/MEETING/OTHER)
- Notes
- Outcome
- Duration
- Next follow-up date

### Order
- Order number
- Amount
- Status
- Items
- Payment status

### KAM
- Name
- Email
- Phone
- Password
- Timezone
- Active status

## Business Rules

1. Each lead must have one primary contact
2. Lead status transitions follow strict flow:
   - NEW → CONTACTED → QUALIFIED → CONVERTING → ACTIVE
   - Any status can transition to INACTIVE
3. Call scheduling based on defined frequency per lead
4. First order automatically changes lead status to ACTIVE
5. Soft delete for leads and KAMs

## Error Handling

API uses standard HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Server Error

## Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License

MIT License

<!-- # Lead Management System API

A comprehensive REST API for managing leads, contacts, and interactions for Key Account Managers (KAMs).

## Live Deployment

The application is live at: https://lead-management-system-675b.onrender.com

## Features

- Complete lead lifecycle management (New → Contacted → Qualified → Converting → Active)
- Contact management with primary contact designation
- Interaction tracking (calls, emails, meetings)
- Order management and tracking
- KAM performance metrics and dashboard
- Automated call scheduling based on defined frequencies

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose

## Prerequisites

- Node.js 14+
- MongoDB 4.4+
- npm or yarn

## Installation

```bash
# Clone repository
git clone https://github.com/Lathiya50/Lead-Management-System

# Install dependencies
npm install

# Set environment variables
cp .env.example .env

# Start development server
npm run dev
```

## Environment Variables

```
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/lead-management
JWT_SECRET=your-jwt-secret
CORS_ORIGIN=https://example.com
```

## API Documentation

### Authentication
All routes require JWT authentication. Include token in Authorization header:
```
Authorization: Bearer <token>
```

### API Endpoints

#### Leads
- `GET /api/v1/leads` - Get all leads with filtering & pagination
- `POST /api/v1/leads` - Create new lead
- `GET /api/v1/leads/:id` - Get single lead
- `PUT /api/v1/leads/:id` - Update lead
- `DELETE /api/v1/leads/:id` - Soft delete lead
- `GET /api/v1/leads/:id/stats` - Get lead performance stats
- `PATCH /api/v1/leads/:id/status` - Update lead status
- `GET /api/v1/leads/calls/today` - Get today's scheduled calls

#### Contacts
- `GET /api/v1/leads/:leadId/contacts` - Get all contacts for a lead
- `POST /api/v1/leads/:leadId/contacts` - Create new contact
- `GET /api/v1/leads/:leadId/contacts/:id` - Get single contact
- `PUT /api/v1/leads/:leadId/contacts/:id` - Update contact
- `DELETE /api/v1/leads/:leadId/contacts/:id` - Delete contact

#### Interactions
- `GET /api/v1/leads/:leadId/interactions` - Get lead interactions
- `POST /api/v1/leads/:leadId/interactions` - Create new interaction
- `GET /api/v1/leads/:leadId/interactions/:id` - Get single interaction
- `PUT /api/v1/leads/:leadId/interactions/:id` - Update interaction

#### Orders
- `GET /api/v1/leads/:leadId/orders` - Get all orders for a lead
- `POST /api/v1/leads/:leadId/orders` - Create new order
- `GET /api/v1/leads/:leadId/orders/:id` - Get single order
- `PUT /api/v1/leads/:leadId/orders/:id` - Update order
- `GET /api/v1/leads/:leadId/orders/stats` - Get order statistics

#### KAMs
- `GET /api/v1/kams` - Get all KAMs
- `POST /api/v1/kams` - Create new KAM
- `GET /api/v1/kams/:id` - Get single KAM
- `PUT /api/v1/kams/:id` - Update KAM
- `DELETE /api/v1/kams/:id` - Soft delete KAM
- `GET /api/v1/kams/:id/performance` - Get KAM performance metrics
- `GET /api/v1/kams/dashboard` - Get KAM dashboard data

## Models

### Lead
- Restaurant name
- Business type
- Status (NEW/CONTACTED/QUALIFIED/CONVERTING/ACTIVE/INACTIVE)
- Assigned KAM
- Call frequency
- Next call date
- Address
- Rating
- Potential value

### Contact
- Name
- Role
- Email
- Phone
- Primary contact flag
- Preferred contact time

### Interaction
- Type (CALL/EMAIL/MEETING/OTHER)
- Notes
- Outcome
- Duration
- Next follow-up date

### Order
- Order number
- Amount
- Status
- Items
- Payment status

### KAM
- Name
- Email
- Phone
- Timezone
- Active status

## Business Rules

1. Each lead must have one primary contact
2. Lead status transitions follow strict flow:
   - NEW → CONTACTED → QUALIFIED → CONVERTING → ACTIVE
   - Any status can transition to INACTIVE
3. Call scheduling based on defined frequency per lead
4. First order automatically changes lead status to ACTIVE
5. Soft delete for leads and KAMs

## Error Handling

API uses standard HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Server Error

## Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License

MIT License -->