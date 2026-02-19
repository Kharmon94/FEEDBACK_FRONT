import { createBrowserRouter } from 'react-router';
import { HomePage } from './components/HomePage';
import { RatingPage } from './components/RatingPage';
import { LocationRatingPage } from './components/LocationRatingPage';
import { FeedbackForm } from './components/FeedbackForm';
import { ThankYouPage } from './components/ThankYouPage';
import { OptInPage } from './components/OptInPage';
import { SubmittedPage } from './components/SubmittedPage';
import { SuggestionForm } from './components/SuggestionForm';
import { LoginPage } from './components/LoginPage';
import { AuthCallbackPage } from './components/AuthCallbackPage';
import { OnboardingFlow } from './components/OnboardingFlow';
import { Dashboard } from './components/Dashboard';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { PricingPage } from './components/PricingPage';
import { FeaturesPage } from './components/FeaturesPage';
import { HowItWorksPage } from './components/HowItWorksPage';
import { HelpCenter } from './components/HelpCenter';
import { ContactUsPage } from './components/ContactUsPage';
import { PrivacyPage } from './components/PrivacyPage';
import { TermsOfServicePage } from './components/TermsOfServicePage';
import { NotFoundPage } from './components/NotFoundPage';
import { AddLocationPage } from './components/dashboard/AddLocationPage';
import { EditLocationPage } from './components/dashboard/EditLocationPage';
import { LocationStatsPage } from './components/dashboard/LocationStatsPage';
import { CancelPlanPage } from './components/dashboard/CancelPlanPage';
import { PlansPage } from './components/dashboard/PlansPage';
import { ContactSupportPage } from './components/dashboard/ContactSupportPage';
import { TrialExpiredPage } from './components/dashboard/TrialExpiredPage';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminUsersPage } from './components/admin/AdminUsersPage';
import { AdminUserDetail } from './components/admin/AdminUserDetail';
import { AdminLocationsPage } from './components/admin/AdminLocationsPage';
import { AdminLocationDetail } from './components/admin/AdminLocationDetail';
import { AdminFeedbackPage } from './components/admin/AdminFeedbackPage';
import { AdminSuggestionsPage } from './components/admin/AdminSuggestionsPage';
import { AdminAnalyticsPage } from './components/admin/AdminAnalyticsPage';
import { AdminSettingsPage } from './components/admin/AdminSettingsPage';
import { AdminLoginPage } from './components/admin/AdminLoginPage';
import { AdminPlansPage } from './components/admin/AdminPlansPage';
import { ForgotPasswordPage } from './components/ForgotPasswordPage';
import { ResetPasswordPage } from './components/ResetPasswordPage';
import { VerifyEmailPage } from './components/VerifyEmailPage';
import { EmailPreferencesPage } from './components/EmailPreferencesPage';
import { EmailPreferencesUnsubscribePage } from './components/EmailPreferencesUnsubscribePage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: HomePage,
    errorElement: <NotFoundPage />,
  },
  {
    path: '/demo',
    Component: RatingPage,
  },
  {
    path: '/l/:locationId',
    Component: LocationRatingPage,
  },
  {
    path: '/feedback',
    Component: FeedbackForm,
  },
  {
    path: '/thank-you',
    Component: ThankYouPage,
  },
  {
    path: '/opt-in',
    Component: OptInPage,
  },
  {
    path: '/feedback-submitted',
    Component: SubmittedPage,
  },
  {
    path: '/suggestion',
    Component: SuggestionForm,
  },
  {
    path: '/suggestion-submitted',
    Component: SubmittedPage,
  },
  {
    path: '/login',
    Component: LoginPage,
  },
  {
    path: '/forgot-password',
    Component: ForgotPasswordPage,
  },
  {
    path: '/reset-password',
    Component: ResetPasswordPage,
  },
  {
    path: '/verify-email',
    Component: VerifyEmailPage,
  },
  {
    path: '/email-preferences',
    Component: EmailPreferencesPage,
  },
  {
    path: '/email-preferences/unsubscribe',
    Component: EmailPreferencesUnsubscribePage,
  },
  {
    path: '/auth/callback',
    Component: AuthCallbackPage,
  },
  {
    path: '/onboarding',
    Component: OnboardingFlow,
  },
  {
    path: '/dashboard',
    Component: DashboardLayout,
    children: [
      {
        index: true,
        Component: Dashboard,
      },
      {
        path: 'locations/new',
        Component: AddLocationPage,
      },
      {
        path: 'locations/edit/:locationId',
        Component: EditLocationPage,
      },
      {
        path: 'locations/:locationId',
        Component: LocationStatsPage,
      },
      {
        path: 'plans',
        Component: PlansPage,
      },
      {
        path: 'cancel-plan',
        Component: CancelPlanPage,
      },
      {
        path: 'contact-support',
        Component: ContactSupportPage,
      },
      {
        path: 'trial-expired',
        Component: TrialExpiredPage,
      },
    ],
  },
  {
    path: '/pricing',
    Component: PricingPage,
  },
  {
    path: '/features',
    Component: FeaturesPage,
  },
  {
    path: '/how-it-works',
    Component: HowItWorksPage,
  },
  {
    path: '/help',
    Component: HelpCenter,
  },
  {
    path: '/contact-us',
    Component: ContactUsPage,
  },
  {
    path: '/privacy',
    Component: PrivacyPage,
  },
  {
    path: '/terms',
    Component: TermsOfServicePage,
  },
  {
    path: '/terms-of-service',
    Component: TermsOfServicePage,
  },
  {
    path: '/admin/login',
    Component: AdminLoginPage,
  },
  {
    path: '/admin',
    Component: AdminLayout,
    children: [
      {
        index: true,
        Component: AdminDashboard,
      },
      {
        path: 'users',
        Component: AdminUsersPage,
      },
      {
        path: 'users/:userId',
        Component: AdminUserDetail,
      },
      {
        path: 'locations',
        Component: AdminLocationsPage,
      },
      {
        path: 'locations/:locationId',
        Component: AdminLocationDetail,
      },
      {
        path: 'feedback',
        Component: AdminFeedbackPage,
      },
      {
        path: 'suggestions',
        Component: AdminSuggestionsPage,
      },
      {
        path: 'analytics',
        Component: AdminAnalyticsPage,
      },
      {
        path: 'plans',
        Component: AdminPlansPage,
      },
      {
        path: 'settings',
        Component: AdminSettingsPage,
      },
    ],
  },
  {
    path: '*',
    Component: NotFoundPage,
  },
]);