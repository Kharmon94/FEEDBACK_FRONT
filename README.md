# Feedback Page

A modern SaaS application that helps businesses capture negative customer experiences privately while directing happy customers to leave public reviews.

## Features

### Customer Experience
- **Simple Star Rating**: Clean 1-5 star rating interface
- **Smart Routing**: 
  - 1-3 stars → Private feedback form
  - 4-5 stars → Public review platform links
- **Suggestion Box**: Additional way for customers to share improvement ideas
- **Mobile-First Design**: Beautiful responsive design that works on all devices

### Business Dashboard
- **View All Feedback**: See all private feedback and suggestions in one place
- **Analytics**: Track total feedback, suggestions, and average ratings
- **Export Data**: Download all feedback as CSV
- **Custom Branding**: Add your business logo and name
- **Multiple Review Platforms**: Link to Google, Yelp, Facebook, TripAdvisor, and more

### Authentication & Payments
- **User Authentication**: Secure login/signup via Rails API (Devise + JWT)
- **Subscription Plans**: Free, Pro, and Enterprise tiers
- **Stripe Integration**: Ready for payment processing (requires setup)
- **Protected Routes**: Dashboard and admin features require authentication

## Getting Started

### For Business Owners

1. Visit `/home` to learn more about Feedback Page
2. Click "Get Started" or "Sign Up" to create an account
3. Choose a pricing plan at `/pricing`
4. Complete the 3-step onboarding at `/onboarding`:
   - Enter your business name
   - Add your logo (optional)
   - Configure review platform links
5. Share your feedback page URL with customers
6. View feedback in your dashboard at `/dashboard`

### For Customers

1. Customer opens your feedback page at `/`
2. They select a star rating (1-5)
3. Based on rating:
   - **Low (1-3)**: Redirected to private feedback form
   - **High (4-5)**: Shown thank you page with review platform links
4. They can also submit suggestions via the suggestion feature

## Routes

### Public Pages
- `/home` - Landing page with product information
- `/login` - Sign in / Sign up page
- `/pricing` - Subscription plans and pricing
- `/help` - Help center with guides for finding review links

### Customer-Facing
- `/` - Customer rating page (demo business)
- `/feedback` - Private feedback form
- `/thank-you` - Thank you page with review links
- `/suggestion` - Suggestion submission form

### Admin (Requires Authentication)
- `/onboarding` - Business setup wizard
- `/dashboard` - Admin dashboard with feedback analytics

## Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Routing**: React Router
- **Authentication**: Rails API (Devise + JWT)
- **Backend**: Rails API (see `../feedback_api`)
- **Payments**: Stripe (integration ready)
- **Date Utilities**: date-fns
- **Icons**: lucide-react

## Setup Instructions

### Stripe Integration (Production)

To enable real payment processing:

1. **Get Stripe API Keys** — Sign up at https://stripe.com, get API keys, create products and prices.
2. **Set Environment Variables** — Add `STRIPE_SECRET_KEY` to Rails, `VITE_STRIPE_PUBLIC_KEY` to frontend `.env`.
3. **Configure Webhook** — Point Stripe webhook to your Rails API endpoint.

## Data Persistence

All data is stored in the Rails API (SQLite in dev, PostgreSQL in production):
- Business profiles, locations, onboarding
- Customer feedback and suggestions

## Design Philosophy

The design prioritizes:
- **Trust**: Clean, professional aesthetic
- **Simplicity**: Minimal clicks to complete actions
- **Clarity**: Clear messaging and visual hierarchy
- **Mobile-First**: Optimized for mobile users
- **Speed**: Fast load times and smooth interactions

## Future Enhancements

Potential features for future development:
- Email notifications when negative feedback is received
- Multi-business support for agencies
- Custom domains for each business
- Advanced analytics and trends
- Response templates for feedback
- Integration with customer service tools
- SMS notifications
- Team collaboration features
- Custom branding colors and themes