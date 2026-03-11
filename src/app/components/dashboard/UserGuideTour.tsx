import { useState, useEffect } from 'react';
import Joyride, { Step, CallBackProps, STATUS } from 'react-joyride';
import { HelpCircle } from 'lucide-react';

interface UserGuideTourProps {
  run?: boolean;
  onComplete?: () => void;
}

export function UserGuideTour({ run = false, onComplete }: UserGuideTourProps) {
  const [runTour, setRunTour] = useState(run);

  useEffect(() => {
    setRunTour(run);
  }, [run]);

  const steps: Step[] = [
    {
      target: 'body',
      content: (
        <div className="p-2">
          <h3 className="text-xl font-bold text-slate-900 mb-3">Welcome to Feedback Page!</h3>
          <p className="text-slate-700 mb-3">
            Let's take a quick tour to show you how to get the most out of your dashboard.
          </p>
          <p className="text-sm text-slate-600">
            This will only take 2 minutes. You can skip anytime by clicking the x button.
          </p>
        </div>
      ),
      placement: 'center',
      disableBeacon: true,
    },
    {
      target: '[data-tour="stats-overview"]',
      content: (
        <div className="p-2">
          <h3 className="text-lg font-bold text-slate-900 mb-2">Your Stats at a Glance</h3>
          <p className="text-slate-700">
            Here you can see your total feedback, average rating, and response rate. These update in real-time as customers submit feedback.
          </p>
        </div>
      ),
      placement: 'bottom',
    },
    {
      target: '[data-tour="locations"]',
      content: (
        <div className="p-2">
          <h3 className="text-lg font-bold text-slate-900 mb-2">Manage Locations</h3>
          <p className="text-slate-700 mb-2">
            If you have multiple locations, you can add and manage them here. Each location gets its own unique feedback link.
          </p>
          <p className="text-sm text-slate-600">
            Click "Add Location" to create your first location or additional ones.
          </p>
        </div>
      ),
      placement: 'bottom',
    },
    {
      target: '[data-tour="feedback-link"]',
      content: (
        <div className="p-2">
          <h3 className="text-lg font-bold text-slate-900 mb-2">Your Feedback Link</h3>
          <p className="text-slate-700 mb-2">
            This is your unique feedback link. Share it with customers via:
          </p>
          <ul className="text-sm text-slate-600 space-y-1 mb-2">
            <li>QR codes (download below)</li>
            <li>Email signatures</li>
            <li>Text messages</li>
            <li>Receipts or packaging</li>
          </ul>
          <p className="text-sm text-slate-600">
            Click the copy icon to copy your link instantly.
          </p>
        </div>
      ),
      placement: 'top',
    },
    {
      target: '[data-tour="qr-code"]',
      content: (
        <div className="p-2">
          <h3 className="text-lg font-bold text-slate-900 mb-2">QR Code</h3>
          <p className="text-slate-700">
            Download your QR code to print on receipts, table tents, or business cards. Customers can scan it to leave feedback instantly!
          </p>
        </div>
      ),
      placement: 'top',
    },
    {
      target: '[data-tour="recent-feedback"]',
      content: (
        <div className="p-2">
          <h3 className="text-lg font-bold text-slate-900 mb-2">Recent Feedback</h3>
          <p className="text-slate-700 mb-2">
            See the latest feedback from your customers. Low ratings (1-3 stars) come to you privately, while high ratings (4-5 stars) are directed to public review sites.
          </p>
          <p className="text-sm text-slate-600">
            Click any feedback item to see full details and mark it as resolved.
          </p>
        </div>
      ),
      placement: 'top',
    },
    {
      target: '[data-tour="sidebar-settings"]',
      content: (
        <div className="p-2">
          <h3 className="text-lg font-bold text-slate-900 mb-2">Settings and Customization</h3>
          <p className="text-slate-700 mb-2">
            In Settings, you can:
          </p>
          <ul className="text-sm text-slate-600 space-y-1">
            <li>Add your review platform links (Google, Yelp, Facebook)</li>
            <li>Customize your branding</li>
            <li>Set up email notifications</li>
            <li>Configure thank you messages</li>
          </ul>
        </div>
      ),
      placement: 'right',
    },
    {
      target: '[data-tour="sidebar-feedback"]',
      content: (
        <div className="p-2">
          <h3 className="text-lg font-bold text-slate-900 mb-2">All Feedback</h3>
          <p className="text-slate-700">
            Access all your feedback in one place. Filter by rating, date, or status. Export to CSV for further analysis.
          </p>
        </div>
      ),
      placement: 'right',
    },
    {
      target: '[data-tour="sidebar-optins"]',
      content: (
        <div className="p-2">
          <h3 className="text-lg font-bold text-slate-900 mb-2">Newsletter Sign-ups</h3>
          <p className="text-slate-700">
            Customers who give 4-5 stars can opt-in to your newsletter/rewards program. View and export their contact information here.
          </p>
        </div>
      ),
      placement: 'right',
    },
    {
      target: '[data-tour="help-button"]',
      content: (
        <div className="p-2">
          <h3 className="text-lg font-bold text-slate-900 mb-2">Need Help?</h3>
          <p className="text-slate-700 mb-2">
            Click the help icon anytime to:
          </p>
          <ul className="text-sm text-slate-600 space-y-1 mb-2">
            <li>Restart this tutorial</li>
            <li>Access our help center</li>
            <li>Contact support</li>
          </ul>
        </div>
      ),
      placement: 'left',
    },
    {
      target: 'body',
      content: (
        <div className="p-2">
          <h3 className="text-xl font-bold text-slate-900 mb-3">You are All Set!</h3>
          <p className="text-slate-700 mb-3">
            You now know the basics of Feedback Page. Start by adding your review platform links in Settings, then share your feedback link with customers!
          </p>
          <p className="text-sm text-slate-600">
            Remember, you can restart this tour anytime from the help menu.
          </p>
        </div>
      ),
      placement: 'center',
    },
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRunTour(false);
      localStorage.setItem('feedback-page-tour-completed', 'true');
      onComplete?.();
    }
  };

  return (
    <Joyride
      steps={steps}
      run={runTour}
      continuous
      showProgress
      showSkipButton
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: '#000000',
          zIndex: 10000,
        },
        tooltip: {
          borderRadius: 12,
          padding: 0,
        },
        tooltipContainer: {
          textAlign: 'left',
        },
        tooltipContent: {
          padding: '12px 0',
        },
        buttonNext: {
          backgroundColor: '#000000',
          borderRadius: 8,
          padding: '8px 16px',
          fontWeight: 600,
        },
        buttonBack: {
          color: '#64748b',
          marginRight: 8,
        },
        buttonSkip: {
          color: '#94a3b8',
        },
      }}
      locale={{
        back: 'Back',
        close: 'Close',
        last: 'Finish',
        next: 'Next',
        skip: 'Skip Tour',
      }}
    />
  );
}

interface UserGuideButtonProps {
  onOpen?: () => void;
  onStartTour: () => void;
}

export function UserGuideButton({ onOpen, onStartTour }: UserGuideButtonProps) {
  const handleClick = () => {
    onStartTour();
    onOpen?.();
  };

  return (
    <button
      onClick={handleClick}
      data-tour="help-button"
      className="flex items-center gap-2 px-3 py-2 w-full justify-start text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
      title="Start User Guide"
    >
      <HelpCircle className="w-5 h-5" />
      <span className="hidden sm:inline">Help and Tutorial</span>
    </button>
  );
}
