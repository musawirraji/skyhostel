# Sky Hostel

A modern hostel management system for student accommodation with Remita payment integration.

## Features

- Room browsing and selection
- Multi-step registration form with validation
- Remita payment integration for processing hostel fees
- Payment receipt generation
- Image upload to Supabase storage for student passport/ID
- Room assignment and tracking
- Payment verification

## Tech Stack

- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- Supabase (PostgreSQL & Storage)
- React Hook Form with Zod validation
- Remita Payment Gateway

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase account
- Remita Merchant Account

### Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Remita Configuration
REMITA_MERCHANT_ID=your_remita_merchant_id
REMITA_API_KEY=your_remita_api_key
REMITA_SERVICE_TYPE_ID=your_remita_service_type_id
NEXT_PUBLIC_REMITA_SERVICE_TYPE_ID=your_remita_service_type_id
NEXT_PUBLIC_REMITA_KEY=your_remita_public_key
NEXT_PUBLIC_REMITA_SDK_URL=https://remitademo.net/payment/v1/remita-pay-inline.bundle.js

# Remita API Configuration (Optional for Development)
REMITA_API_BASE_URL=https://api-demo.systemspecsng.com
NEXT_PUBLIC_REMITA_ENV=demo
USE_MOCK_ON_VERCEL=false
```

### Supabase Setup

1. Create a new Supabase project
2. Run the database setup script located in `supabase/seed.sql`
3. Create a storage bucket called `uploads` for storing student passport photos

### Remita Setup

1. Sign up for a Remita Merchant account
2. Obtain your Merchant ID, API Key, and Service Type ID
3. Add these credentials to your `.env.local` file

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/skyhostel.git
cd skyhostel
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The application uses the following Supabase tables:

- `users`: Stores student personal information
- `next_of_kin`: Stores next of kin information
- `security_info`: Stores security-related information
- `guarantors`: Stores guarantor information
- `rooms`: Stores room details like type, block, and pricing
- `room_assignments`: Links users to rooms with payment status
- `payments`: Stores payment information including Remita RRR and status

## Registration Process

The registration process follows these steps:

1. **Payment**: Users must make payment first before proceeding to registration

   - Choose payment option (Full, Half, or Custom amount)
   - Generate Remita RRR
   - Complete payment using Remita gateway
   - Verify payment status

2. **Registration Form**: Multi-step form with 5 sections

   - Section A: Personal Information
   - Section B: Next of Kin Details
   - Section C: Security Information
   - Section D: Rules & Regulations
   - Section E: Guarantor Information

3. **Confirmation**: Success message and payment receipt

## Remita Integration

This project uses the Remita Payment Gateway for processing payments:

- RRR generation
- Payment processing
- Payment status verification

The integration is handled in the `lib/remita.ts` file, which provides functions for:

- Generating RRR numbers
- Verifying payments by RRR
- Calculating payment amounts based on options

## Supabase Storage

Student passport photographs are stored in Supabase Storage:

1. Images are uploaded to the `uploads` bucket in the `passport_photos` folder
2. The URL is stored in the `passport_url` field of the `users` table

## API Endpoints

The application includes the following API endpoints:

- `/api/register`: Handles user registration
- `/api/rrr-generation`: Generates Remita RRR for payment
- `/api/verify-payment`: Verifies payment status
- `/api/check-payment-status`: Checks if a matriculation number has a paid status
- `/api/payment`: Processes payment information

## Testing

You can test the application using the provided sample paid user:

- Matriculation Number: ABC/12345
- Remita RRR: 290019681818

## Deployment

The application can be deployed to any platform that supports Next.js, such as Vercel, Netlify, or AWS.

```bash
npm run build
# or
yarn build
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Setting up ImageKit Integration

The application uses ImageKit for passport photo uploads. To configure the ImageKit integration:

1. Create a `.env.local` file in the project root with the following variables:

   ```
   NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=your_public_key_here
   IMAGEKIT_PRIVATE_KEY=your_private_key_here
   ```

2. Replace `your_public_key_here` and `your_private_key_here` with your actual ImageKit API keys, which you can find in your ImageKit dashboard under Developer Options.

3. Make sure the ImageKit URL endpoint in `lib/imagekit.ts` matches your account's URL endpoint.
