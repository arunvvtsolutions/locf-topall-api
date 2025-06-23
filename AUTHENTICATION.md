# Phone Number Authentication API

This API provides phone number-based authentication using OTP (One-Time Password) sent via SMS.

## Endpoints

### 1. Send OTP

Send an OTP to the provided phone number.

**Endpoint:** `POST /auth/send-otp`

**Request Body:**
```json
{
  "phone": "9876543210"
}
```

**Note:** The phone number should be a string of 10-15 digits. Non-digit characters will be automatically removed.

**Response:**
```json
{
  "message": "OTP sent successfully"
}
```

### 2. Verify OTP

Verify the OTP sent to the user's phone number.

**Endpoint:** `POST /auth/verify-otp`

**Request Body:**
```json
{
  "phone": "9876543210",
  "otp": 123456
}
```

**Note:** The phone number should be a string of 10-15 digits. Non-digit characters will be automatically removed.

**Response:**
```json
{
  "message": "OTP verified successfully",
  "user": {
    "id": 1,
    "phone": 1234567890,
    "email": "1234567890@temp.com",
    "role": "user"
  }
}
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# MSG91 OTP Configuration
OTP_BASE_URL=https://control.msg91.com/api/sendhttp.php
AUTH_KEY=your_auth_key_here
TEMPLATE_ID=your_template_id_here
SENDER_ID=your_sender_id_here
ROUTE=4
```

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- MySQL database
- MSG91 account for sending SMS

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up your database and update the `.env` file with your database credentials.

3. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

4. Start the development server:
   ```bash
   npm run start:dev
   ```

The API will be available at `http://localhost:3000` by default.

## Error Handling

The API returns appropriate HTTP status codes and error messages in case of failures. Common error responses include:

- `400 Bad Request`: Invalid request body or missing required fields
- `401 Unauthorized`: Invalid OTP or OTP has expired
- `500 Internal Server Error`: Server-side error (check server logs for details)
