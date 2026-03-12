import { useState, useEffect } from 'react';
import Joyride, { Step, CallBackProps, STATUS } from 'react-joyride';
import { BookOpen } from 'lucide-react';

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
            Let&apos;s take a quick tour to show you how to get the most out of your dashboard.
          </p>
          <p className="text-sm text-slate-600">
            This tour has 5 steps. You can skip anytime by clicking the x button.
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
            Here you can see your total feedback, average rating, and positive vs. negative counts. These update in real-time as customers submit feedback.
          </p>
        </div>
      ),
      placement: 'bottom',
    },
    {
      target: '[data-tour="recent-feedback"]',
      content: (
        <div className="p-2">
          <h3 className="text-lg font-bold text-slate-900 mb-2">Feedback List</h3>
          <p className="text-slate-700 mb-2">
            Use the View dropdown to see feedback, suggestions, or opt-ins. Low ratings (1-3 stars) come to you privately, while high ratings (4-5 stars) are directed to public review sites.
          </p>
          <p className="text-sm text-slate-600">
            Use filters and export to manage your data.
          </p>
        </div>
      ),
      placement: 'top',
    },
    {
      target: '[data-tour="sidebar-feedback"]',
      content: (
        <div className="p-2">
          <h3 className="text-lg font-bold text-slate-900 mb-2">Navigation</h3>
          <p className="text-slate-700 mb-2">
            Use the sidebar to access:
          </p>
          <ul className="text-sm text-slate-600 space-y-1 mb-2">
            <li><strong>Feedback</strong> – View feedback, suggestions, and opt-ins (use the View dropdown to switch)</li>
            <li><strong>Locations</strong> – Manage locations, review platforms, branding, and get your feedback links</li>
            <li><strong>Settings</strong> – Manage your account, email, password, and preferences</li>
          </ul>
        </div>
      ),
      placement: 'right',
    },
    {
      target: '[data-tour="help-button"]',
      content: (
        <div className="p-2">
          <h3 className="text-xl font-bold text-slate-900 mb-3">You&apos;re All Set!</h3>
          <p className="text-slate-700 mb-2">
            You can restart this tour anytime from the Tutorial button. Visit Locations and edit a location to add review platforms and branding, then share your feedback link.
          </p>
        </div>
      ),
      placement: 'left',
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
      className="flex items-center gap-2 px-3 py-2 w-full justify-start text-sm font-medium text-slate-900 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
      title="Start Tutorial"
    >
      <BookOpen className="w-5 h-5 flex-shrink-0" />
      <span className="inline">Tutorial</span>
    </button>
  );
}
