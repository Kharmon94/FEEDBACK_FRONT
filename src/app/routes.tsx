import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router';

const HomePage = lazy(() => import('./components/HomePage').then((m) => ({ default: m.HomePage })));
const RatingPage = lazy(() => import('./components/RatingPage').then((m) => ({ default: m.RatingPage })));
const LocationRatingPage = lazy(() => import('./components/LocationRatingPage').then((m) => ({ default: m.LocationRatingPage })));
const FeedbackForm = lazy(() => import('./components/FeedbackForm').then((m) => ({ default: m.FeedbackForm })));
const ThankYouPage = lazy(() => import('./components/ThankYouPage').then((m) => ({ default: m.ThankYouPage })));
const OptInPage = lazy(() => import('./components/OptInPage').then((m) => ({ default: m.OptInPage })));
const SubmittedPage = lazy(() => import('./components/SubmittedPage').then((m) => ({ default: m.SubmittedPage })));
const SuggestionForm = lazy(() => import('./components/SuggestionForm').then((m) => ({ default: m.SuggestionForm })));
const LoginPage = lazy(() => import('./components/LoginPage').then((m) => ({ default: m.LoginPage })));
const AuthCallbackPage = lazy(() => import('./components/AuthCallbackPage').then((m) => ({ default: m.AuthCallbackPage })));
const OnboardingFlow = lazy(() => import('./components/OnboardingFlow').then((m) => ({ default: m.OnboardingFlow })));
const Dashboard = lazy(() => import('./components/Dashboard').then((m) => ({ default: m.Dashboard })));
const DashboardLayout = lazy(() => import('./components/dashboard/DashboardLayout').then((m) => ({ default: m.DashboardLayout })));
const PricingPage = lazy(() => import('./components/PricingPage').then((m) => ({ default: m.PricingPage })));
const FeaturesPage = lazy(() => import('./components/FeaturesPage').then((m) => ({ default: m.FeaturesPage })));
const HowItWorksPage = lazy(() => import('./components/HowItWorksPage').then((m) => ({ default: m.HowItWorksPage })));
const HelpCenter = lazy(() => import('./components/HelpCenter').then((m) => ({ default: m.HelpCenter })));
const ContactUsPage = lazy(() => import('./components/ContactUsPage').then((m) => ({ default: m.ContactUsPage })));
const PrivacyPage = lazy(() => import('./components/PrivacyPage').then((m) => ({ default: m.PrivacyPage })));
const TermsOfServicePage = lazy(() => import('./components/TermsOfServicePage').then((m) => ({ default: m.TermsOfServicePage })));
const NotFoundPage = lazy(() => import('./components/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));
const AddLocationPage = lazy(() => import('./components/dashboard/AddLocationPage').then((m) => ({ default: m.AddLocationPage })));
const EditLocationPage = lazy(() => import('./components/dashboard/EditLocationPage').then((m) => ({ default: m.EditLocationPage })));
const LocationStatsPage = lazy(() => import('./components/dashboard/LocationStatsPage').then((m) => ({ default: m.LocationStatsPage })));
const CancelPlanPage = lazy(() => import('./components/dashboard/CancelPlanPage').then((m) => ({ default: m.CancelPlanPage })));
const PlansPage = lazy(() => import('./components/dashboard/PlansPage').then((m) => ({ default: m.PlansPage })));
const ContactSupportPage = lazy(() => import('./components/dashboard/ContactSupportPage').then((m) => ({ default: m.ContactSupportPage })));
const TrialExpiredPage = lazy(() => import('./components/dashboard/TrialExpiredPage').then((m) => ({ default: m.TrialExpiredPage })));
const AdminLayout = lazy(() => import('./components/admin/AdminLayout').then((m) => ({ default: m.AdminLayout })));
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard').then((m) => ({ default: m.AdminDashboard })));
const AdminUsersPage = lazy(() => import('./components/admin/AdminUsersPage').then((m) => ({ default: m.AdminUsersPage })));
const AdminUserDetail = lazy(() => import('./components/admin/AdminUserDetail').then((m) => ({ default: m.AdminUserDetail })));
const AdminLocationsPage = lazy(() => import('./components/admin/AdminLocationsPage').then((m) => ({ default: m.AdminLocationsPage })));
const AdminLocationDetail = lazy(() => import('./components/admin/AdminLocationDetail').then((m) => ({ default: m.AdminLocationDetail })));
const AdminFeedbackPage = lazy(() => import('./components/admin/AdminFeedbackPage').then((m) => ({ default: m.AdminFeedbackPage })));
const AdminSuggestionsPage = lazy(() => import('./components/admin/AdminSuggestionsPage').then((m) => ({ default: m.AdminSuggestionsPage })));
const AdminOptInsPage = lazy(() => import('./components/admin/AdminOptInsPage').then((m) => ({ default: m.AdminOptInsPage })));
const AdminAnalyticsPage = lazy(() => import('./components/admin/AdminAnalyticsPage').then((m) => ({ default: m.AdminAnalyticsPage })));
const AdminSettingsPage = lazy(() => import('./components/admin/AdminSettingsPage').then((m) => ({ default: m.AdminSettingsPage })));
const AdminLoginPage = lazy(() => import('./components/admin/AdminLoginPage').then((m) => ({ default: m.AdminLoginPage })));
const AdminPlansPage = lazy(() => import('./components/admin/AdminPlansPage').then((m) => ({ default: m.AdminPlansPage })));
const ForgotPasswordPage = lazy(() => import('./components/ForgotPasswordPage').then((m) => ({ default: m.ForgotPasswordPage })));
const ResetPasswordPage = lazy(() => import('./components/ResetPasswordPage').then((m) => ({ default: m.ResetPasswordPage })));
const VerifyEmailPage = lazy(() => import('./components/VerifyEmailPage').then((m) => ({ default: m.VerifyEmailPage })));
const EmailPreferencesPage = lazy(() => import('./components/EmailPreferencesPage').then((m) => ({ default: m.EmailPreferencesPage })));
const EmailPreferencesUnsubscribePage = lazy(() => import('./components/EmailPreferencesUnsubscribePage').then((m) => ({ default: m.EmailPreferencesUnsubscribePage })));

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900" />
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <HomePage />
      </Suspense>
    ),
    errorElement: (
      <Suspense fallback={<LoadingFallback />}>
        <NotFoundPage />
      </Suspense>
    ),
  },
  {
    path: '/demo',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <RatingPage />
      </Suspense>
    ),
  },
  {
    path: '/l/:locationId',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <LocationRatingPage />
      </Suspense>
    ),
  },
  {
    path: '/l/:locationId/suggestions',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <SuggestionForm />
      </Suspense>
    ),
  },
  {
    path: '/l/:locationId/opt-in',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <OptInPage />
      </Suspense>
    ),
  },
  {
    path: '/feedback',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <FeedbackForm />
      </Suspense>
    ),
  },
  {
    path: '/thank-you',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <ThankYouPage />
      </Suspense>
    ),
  },
  {
    path: '/opt-in',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <OptInPage />
      </Suspense>
    ),
  },
  {
    path: '/feedback-submitted',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <SubmittedPage />
      </Suspense>
    ),
  },
  {
    path: '/suggestion',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <SuggestionForm />
      </Suspense>
    ),
  },
  {
    path: '/suggestion-submitted',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <SubmittedPage />
      </Suspense>
    ),
  },
  {
    path: '/login',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: '/forgot-password',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <ForgotPasswordPage />
      </Suspense>
    ),
  },
  {
    path: '/reset-password',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <ResetPasswordPage />
      </Suspense>
    ),
  },
  {
    path: '/verify-email',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <VerifyEmailPage />
      </Suspense>
    ),
  },
  {
    path: '/email-preferences',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <EmailPreferencesPage />
      </Suspense>
    ),
  },
  {
    path: '/email-preferences/unsubscribe',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <EmailPreferencesUnsubscribePage />
      </Suspense>
    ),
  },
  {
    path: '/auth/callback',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <AuthCallbackPage />
      </Suspense>
    ),
  },
  {
    path: '/onboarding',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <OnboardingFlow />
      </Suspense>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <DashboardLayout />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: 'locations/new',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AddLocationPage />
          </Suspense>
        ),
      },
      {
        path: 'locations/edit/:locationId',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <EditLocationPage />
          </Suspense>
        ),
      },
      {
        path: 'locations/:locationId',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <LocationStatsPage />
          </Suspense>
        ),
      },
      {
        path: 'plans',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <PlansPage />
          </Suspense>
        ),
      },
      {
        path: 'cancel-plan',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <CancelPlanPage />
          </Suspense>
        ),
      },
      {
        path: 'contact-support',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ContactSupportPage />
          </Suspense>
        ),
      },
      {
        path: 'trial-expired',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <TrialExpiredPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: '/pricing',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <PricingPage />
      </Suspense>
    ),
  },
  {
    path: '/features',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <FeaturesPage />
      </Suspense>
    ),
  },
  {
    path: '/how-it-works',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <HowItWorksPage />
      </Suspense>
    ),
  },
  {
    path: '/help',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <HelpCenter />
      </Suspense>
    ),
  },
  {
    path: '/contact-us',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <ContactUsPage />
      </Suspense>
    ),
  },
  {
    path: '/privacy',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <PrivacyPage />
      </Suspense>
    ),
  },
  {
    path: '/terms',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <TermsOfServicePage />
      </Suspense>
    ),
  },
  {
    path: '/terms-of-service',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <TermsOfServicePage />
      </Suspense>
    ),
  },
  {
    path: '/admin/login',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <AdminLoginPage />
      </Suspense>
    ),
  },
  {
    path: '/admin',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <AdminLayout />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AdminDashboard />
          </Suspense>
        ),
      },
      {
        path: 'users',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AdminUsersPage />
          </Suspense>
        ),
      },
      {
        path: 'users/:userId',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AdminUserDetail />
          </Suspense>
        ),
      },
      {
        path: 'locations',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AdminLocationsPage />
          </Suspense>
        ),
      },
      {
        path: 'locations/:locationId',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AdminLocationDetail />
          </Suspense>
        ),
      },
      {
        path: 'feedback',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AdminFeedbackPage />
          </Suspense>
        ),
      },
      {
        path: 'suggestions',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AdminSuggestionsPage />
          </Suspense>
        ),
      },
      {
        path: 'opt-ins',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AdminOptInsPage />
          </Suspense>
        ),
      },
      {
        path: 'analytics',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AdminAnalyticsPage />
          </Suspense>
        ),
      },
      {
        path: 'plans',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AdminPlansPage />
          </Suspense>
        ),
      },
      {
        path: 'settings',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AdminSettingsPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: '*',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <NotFoundPage />
      </Suspense>
    ),
  },
]);
