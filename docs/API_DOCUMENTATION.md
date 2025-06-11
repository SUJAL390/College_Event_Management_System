```markdown
# College Event Management System API Documentation

## Overview

This API provides endpoints for managing college events, user registrations, and attendance tracking with QR codes.

## Base Information

- **Base URL**: `http://localhost:8000/api/v1`
- **Interactive Documentation**: [Swagger UI](http://localhost:8000/docs)
- **Authentication**: JWT Bearer Token

## Authentication

### Login
POST /api/v1/auth/login Content-Type: application/x-www-form-urlencoded

**Important Note**: The username field expects an email address.

**Request Body:**
username=user@example.com password=userpassword123

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
Register
POST /api/v1/auth/register
Content-Type: application/json
Request Body:
{
  "email": "user@example.com",
  "username": "username",
  "password": "password123"
}
Using Authentication
All protected endpoints require the JWT token in the Authorization header:
Authorization: Bearer {token}
The token expires after 8 days (11,520 minutes).
Core Resources
Events
Events represent college activities that users can register for.

Endpoint	    Method	    Description	                Auth Required
/events	        GET	        List all events	                No
/events/{id}	GET	        Get event details	            No
/events	        POST        Create new event	            Yes
/events/{id}	PUT	        Update event	                Yes
/events/{id}	DELETE	    Delete event	                Yes (Admin)

Registrations
Registrations connect users to events and generate QR codes.

Endpoint	                    Method	    Description	        Auth Required
/registrations	                POST	    Register for event	    Yes
/registrations	                GET	      List user registrations	Yes
/registrations/qrcode/{id}	    GET	        Get registration QR	    Yes
/registrations/check-in/{id}    POST	    Check in with QR	Yes (Admin)


User Management
Endpoint	                Method	        Description	        Auth Required
/users/me	                GET	            Get current user	    Yes
/users/{id}/registrations	GET	            User's registrations	Yes

Data Models
Event
{
  "id": 1,
  "title": "Tech Conference 2025",
  "description": "Annual technology conference",
  "location": "Main Hall",
  "start_time": "2025-08-15T10:00:00",
  "end_time": "2025-08-15T16:00:00",
  "capacity": 200,
  "category": "technology",
  "image_url": null,
  "created_by": 1,
  "created_at": "2025-06-11T12:34:56"
}

Registration
{
  "id": 1,
  "user_id": 1,
  "event_id": 1,
  "registration_date": "2025-06-11T12:35:00",
  "check_in_time": null,
  "unique_code": "7f9c2ba5-7a1c-4ba3-8a53-4647a3fd64e5",
  "qr_code_url": "/static/qrcodes/registration_1.png"
}
User
{
  "id": 1,
  "email": "user@example.com",
  "username": "username",
  "is_admin": false
}

```markdown
Error Handling
Error responses follow this format:
```

{
  "detail": "Error message describing the issue"
}
Common status codes:

400 - Bad Request (validation error)
401 - Unauthorized (missing/invalid token)
403 - Forbidden (insufficient permissions)
404 - Resource not found
422 - Validation Error
500 - Server Error


Testing
You can use these credentials for testing:

Admin access:
Email: admin@example.com
Password: adminpassword123
CORS Support
The API allows requests from:

http://localhost:3000
http://localhost:8000
```