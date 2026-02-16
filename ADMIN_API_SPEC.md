# Admin Panel API Specification

This document outlines all the API endpoints needed for the Feedback Page Admin Panel. The frontend is production-ready and expects these endpoints to be implemented in the Ruby on Rails backend.

## Base URL
All admin endpoints should be prefixed with `/api/admin` and require admin authentication.

---

## Authentication
All admin endpoints require authentication with an admin user token. Include the token in the Authorization header:
```
Authorization: Bearer {admin_token}
```

---

## 1. Admin Dashboard Overview

### GET `/api/admin/dashboard`
Get system-wide overview statistics.

**Response:**
```json
{
  "totalUsers": 1247,
  "activeUsers": 892,
  "totalLocations": 3456,
  "totalFeedback": 28934,
  "avgRating": 4.2,
  "monthlyRevenue": 45670,
  "newUsersThisMonth": 156,
  "feedbackThisMonth": 2847,
  "recentActivity": [
    {
      "id": "1",
      "type": "user|location|feedback|subscription",
      "message": "New user registration",
      "timestamp": "2024-02-14T10:30:00Z",
      "userName": "John Smith",
      "locationName": "Downtown Store"
    }
  ]
}
```

---

## 2. User Management

### GET `/api/admin/users`
Get list of all users with filtering and search.

**Query Parameters:**
- `search` (optional): Search by name or email
- `plan` (optional): Filter by plan (free, starter, pro, business, enterprise)
- `status` (optional): Filter by status (active, inactive, suspended)
- `page` (optional): Page number for pagination
- `per_page` (optional): Results per page (default: 50)

**Response:**
```json
{
  "users": [
    {
      "id": "1",
      "name": "John Smith",
      "email": "john.smith@example.com",
      "plan": "pro",
      "status": "active",
      "locationsCount": 3,
      "feedbackCount": 245,
      "createdAt": "2024-01-15T00:00:00Z",
      "lastLogin": "2024-02-10T08:30:00Z",
      "mrr": 59
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 25,
    "totalCount": 1247,
    "perPage": 50
  },
  "totalMRR": 45670
}
```

### GET `/api/admin/users/:id`
Get detailed information about a specific user.

**Response:**
```json
{
  "id": "1",
  "name": "John Smith",
  "email": "john.smith@example.com",
  "plan": "pro",
  "status": "active",
  "locationsCount": 3,
  "feedbackCount": 245,
  "createdAt": "2024-01-15T00:00:00Z",
  "lastLogin": "2024-02-10T08:30:00Z",
  "mrr": 59,
  "locations": [...],
  "billingHistory": [...],
  "accountNotes": "..."
}
```

### PUT `/api/admin/users/:id/suspend`
Suspend a user account.

**Response:**
```json
{
  "success": true,
  "message": "User suspended successfully"
}
```

### PUT `/api/admin/users/:id/activate`
Activate a suspended user account.

**Response:**
```json
{
  "success": true,
  "message": "User activated successfully"
}
```

### GET `/api/admin/users/export`
Export users to CSV.

**Query Parameters:** Same as GET `/api/admin/users`

**Response:** CSV file download

---

## 3. Location Management

### GET `/api/admin/locations`
Get list of all locations across all users.

**Query Parameters:**
- `search` (optional): Search by location name, user name, or email
- `status` (optional): Filter by status (active, inactive)
- `page` (optional): Page number for pagination
- `per_page` (optional): Results per page (default: 50)

**Response:**
```json
{
  "locations": [
    {
      "id": "1",
      "name": "Downtown Store",
      "userId": "1",
      "userName": "John Smith",
      "userEmail": "john.smith@example.com",
      "feedbackCount": 156,
      "avgRating": 4.3,
      "createdAt": "2024-01-15T00:00:00Z",
      "lastFeedback": "2024-02-14T10:30:00Z",
      "isActive": true
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 70,
    "totalCount": 3456,
    "perPage": 50
  }
}
```

### GET `/api/admin/locations/:id`
Get detailed information about a specific location.

**Response:**
```json
{
  "id": "1",
  "name": "Downtown Store",
  "userId": "1",
  "userName": "John Smith",
  "userEmail": "john.smith@example.com",
  "feedbackCount": 156,
  "avgRating": 4.3,
  "createdAt": "2024-01-15T00:00:00Z",
  "lastFeedback": "2024-02-14T10:30:00Z",
  "isActive": true,
  "platforms": {...},
  "recentFeedback": [...]
}
```

### GET `/api/admin/locations/export`
Export locations to CSV.

**Query Parameters:** Same as GET `/api/admin/locations`

**Response:** CSV file download

---

## 4. Feedback Management

### GET `/api/admin/feedback`
Get list of all feedback submissions.

**Query Parameters:**
- `search` (optional): Search by comment, location, user, or customer name
- `rating` (optional): Filter by rating (1-5, or "positive" for 4-5, "negative" for 1-3)
- `location_id` (optional): Filter by location
- `user_id` (optional): Filter by user
- `page` (optional): Page number for pagination
- `per_page` (optional): Results per page (default: 50)

**Response:**
```json
{
  "feedback": [
    {
      "id": "1",
      "rating": 5,
      "comment": "Excellent service!",
      "locationId": "1",
      "locationName": "Downtown Store",
      "userId": "1",
      "userName": "John Smith",
      "userEmail": "john.smith@example.com",
      "createdAt": "2024-02-14T10:30:00Z",
      "hasImages": false,
      "phoneNumber": "555-0123",
      "contactMe": false,
      "customerName": "Alice Brown",
      "customerEmail": "alice.b@email.com",
      "imageUrls": []
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 579,
    "totalCount": 28934,
    "perPage": 50
  }
}
```

### GET `/api/admin/feedback/:id`
Get detailed information about a specific feedback submission.

**Response:**
```json
{
  "id": "1",
  "rating": 5,
  "comment": "Excellent service!",
  "locationId": "1",
  "locationName": "Downtown Store",
  "userId": "1",
  "userName": "John Smith",
  "userEmail": "john.smith@example.com",
  "createdAt": "2024-02-14T10:30:00Z",
  "hasImages": false,
  "phoneNumber": "555-0123",
  "contactMe": false,
  "customerName": "Alice Brown",
  "customerEmail": "alice.b@email.com",
  "imageUrls": []
}
```

### GET `/api/admin/feedback/export`
Export feedback to CSV.

**Query Parameters:** Same as GET `/api/admin/feedback`

**Response:** CSV file download

---

## 5. Analytics

### GET `/api/admin/analytics`
Get system-wide analytics and reports.

**Query Parameters:**
- `range` (optional): Time range (7d, 30d, 90d, 1y) - default: 30d

**Response:**
```json
{
  "revenue": {
    "total": 45670,
    "growth": 12.5,
    "byPlan": [
      {
        "plan": "Starter",
        "amount": 8670,
        "percentage": 19
      }
    ]
  },
  "users": {
    "total": 1247,
    "growth": 8.3,
    "newThisMonth": 156,
    "churnRate": 2.1
  },
  "feedback": {
    "total": 28934,
    "growth": 15.7,
    "avgRating": 4.2,
    "ratingDistribution": [
      {
        "rating": 5,
        "count": 14250,
        "percentage": 49
      }
    ]
  },
  "topLocations": [
    {
      "id": "1",
      "name": "Harbor View Restaurant",
      "owner": "David Lee",
      "feedbackCount": 892,
      "avgRating": 4.5
    }
  ],
  "topUsers": [
    {
      "id": "1",
      "name": "David Lee",
      "plan": "Enterprise",
      "mrr": 299,
      "locationsCount": 25
    }
  ]
}
```

### GET `/api/admin/analytics/export`
Export analytics report.

**Query Parameters:** Same as GET `/api/admin/analytics`

**Response:** PDF or CSV file download

---

## 6. System Settings

### GET `/api/admin/settings`
Get current system settings.

**Response:**
```json
{
  "siteName": "Feedback Page",
  "supportEmail": "support@feedbackpage.com",
  "maxLocationsPerUser": 100,
  "enableUserRegistration": true,
  "enableEmailVerification": false,
  "enableSocialLogin": true,
  "emailProvider": "sendgrid",
  "smtpHost": "smtp.sendgrid.net",
  "smtpPort": "587",
  "smtpUsername": "apikey",
  "sessionTimeout": 24,
  "passwordMinLength": 8,
  "require2FA": false,
  "stripePublicKey": "pk_test_...",
  "enableTrialPeriod": true,
  "trialDays": 14,
  "adminEmailAlerts": true,
  "weeklyReports": true,
  "monthlyReports": true
}
```

### PUT `/api/admin/settings`
Update system settings.

**Request Body:**
```json
{
  "siteName": "Feedback Page",
  "supportEmail": "support@feedbackpage.com",
  ...
}
```

**Response:**
```json
{
  "success": true,
  "message": "Settings updated successfully",
  "settings": {...}
}
```

---

## Error Responses

All endpoints should return appropriate HTTP status codes and error messages:

### 400 Bad Request
```json
{
  "error": "Invalid parameters",
  "details": {
    "email": ["is invalid"]
  }
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Admin authentication required"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "Not found",
  "message": "User not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "message": "An unexpected error occurred"
}
```

---

## Notes for Backend Implementation

1. **Authentication**: All admin endpoints must verify that the authenticated user has admin privileges.

2. **Pagination**: Implement cursor-based or offset-based pagination for all list endpoints.

3. **Search**: Implement full-text search for user and location searches.

4. **Filtering**: Support multiple simultaneous filters on list endpoints.

5. **Performance**: Add database indexes on frequently queried fields (email, status, created_at, etc.).

6. **CSV Export**: Generate CSV files with proper headers and formatting. Include all relevant fields.

7. **Rate Limiting**: Implement rate limiting on admin endpoints to prevent abuse.

8. **Audit Logging**: Log all admin actions (user suspension, settings changes, etc.) for security and compliance.

9. **Data Privacy**: Ensure sensitive data (passwords, API keys) is never exposed in API responses.

10. **Real-time Updates**: Consider implementing WebSocket connections for real-time dashboard updates (optional).

---

## Frontend Routes

The admin panel is accessible at the following routes:
- `/admin` - Dashboard overview
- `/admin/users` - User management
- `/admin/locations` - Location management
- `/admin/feedback` - Feedback management
- `/admin/analytics` - Analytics and reports
- `/admin/settings` - System settings

All routes are protected and require admin authentication on the frontend. Implement similar protection on the backend.
