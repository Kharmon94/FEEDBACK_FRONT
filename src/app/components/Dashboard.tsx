import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { LayoutDashboard, MessageSquare, MapPin, CreditCard, Gift, HelpCircle } from 'lucide-react';
import { DashboardOverview } from './dashboard/DashboardOverview';
import { FeedbackList } from './dashboard/FeedbackList';
import { LocationsManager } from './dashboard/LocationsManager';
import { BillingPanel } from './dashboard/BillingPanel';
import { OptInsList } from './dashboard/OptInsList';
import { HelpPanel } from './dashboard/HelpPanel';

export function Dashboard() {
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab');
  
  // Valid tabs list
  const validTabs = ['overview', 'feedback', 'locations', 'opt-ins', 'billing', 'help'];
  
  // Default to overview if tab is invalid or missing
  const [activeTab, setActiveTab] = useState<'overview' | 'feedback' | 'locations' | 'opt-ins' | 'billing' | 'help'>(() => {
    if (tabFromUrl && validTabs.includes(tabFromUrl)) {
      return tabFromUrl as 'overview' | 'feedback' | 'locations' | 'opt-ins' | 'billing' | 'help';
    }
    return 'overview';
  });

  useEffect(() => {
    if (tabFromUrl && validTabs.includes(tabFromUrl)) {
      setActiveTab(tabFromUrl as 'overview' | 'feedback' | 'locations' | 'opt-ins' | 'billing' | 'help');
    } else if (tabFromUrl) {
      // If invalid tab (like 'settings'), default to overview
      setActiveTab('overview');
    }
  }, [tabFromUrl]);

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: LayoutDashboard },
    { id: 'feedback' as const, label: 'Feedback', icon: MessageSquare },
    { id: 'locations' as const, label: 'Locations', icon: MapPin },
    { id: 'opt-ins' as const, label: 'Opt-Ins', icon: Gift },
    { id: 'billing' as const, label: 'Billing', icon: CreditCard },
    { id: 'help' as const, label: 'Help', icon: HelpCircle },
  ];

  return (
    <div className="space-y-6">
      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && <DashboardOverview />}
        {activeTab === 'feedback' && <FeedbackList />}
        {activeTab === 'locations' && <LocationsManager />}
        {activeTab === 'opt-ins' && <OptInsList />}
        {activeTab === 'billing' && <BillingPanel />}
        {activeTab === 'help' && <HelpPanel />}
      </div>
    </div>
  );
}