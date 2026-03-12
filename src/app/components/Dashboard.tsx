import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { MessageSquare, MapPin, CreditCard, Gift, HelpCircle, Settings, Lightbulb } from 'lucide-react';
import { FeedbackList } from './dashboard/FeedbackList';
import { LocationsManager } from './dashboard/LocationsManager';
import { BillingPanel } from './dashboard/BillingPanel';
import { OptInsList } from './dashboard/OptInsList';
import { HelpPanel } from './dashboard/HelpPanel';
import { SettingsPanel } from './dashboard/SettingsPanel';
import { SuggestionsList } from './dashboard/SuggestionsList';

export function Dashboard() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tabFromUrl = searchParams.get('tab');

  // Valid tabs list (no overview)
  const validTabs = ['feedback', 'suggestions', 'locations', 'opt-ins', 'billing', 'settings', 'help'];

  type TabId = 'feedback' | 'suggestions' | 'locations' | 'opt-ins' | 'billing' | 'settings' | 'help';

  // Default to feedback if tab is invalid or missing
  const [activeTab, setActiveTab] = useState<TabId>(() => {
    if (tabFromUrl && validTabs.includes(tabFromUrl)) {
      return tabFromUrl as TabId;
    }
    return 'feedback';
  });

  useEffect(() => {
    if (tabFromUrl && validTabs.includes(tabFromUrl)) {
      setActiveTab(tabFromUrl as TabId);
    } else if (!tabFromUrl || tabFromUrl === 'overview') {
      navigate('/dashboard?tab=feedback', { replace: true });
      setActiveTab('feedback');
    }
  }, [tabFromUrl, navigate]);

  const tabs = [
    { id: 'feedback' as const, label: 'Feedback', icon: MessageSquare },
    { id: 'suggestions' as const, label: 'Suggestions', icon: Lightbulb },
    { id: 'locations' as const, label: 'Locations', icon: MapPin },
    { id: 'opt-ins' as const, label: 'Opt-Ins', icon: Gift },
    { id: 'billing' as const, label: 'Billing', icon: CreditCard },
    { id: 'settings' as const, label: 'Settings', icon: Settings },
    { id: 'help' as const, label: 'Help', icon: HelpCircle },
  ];

  return (
    <div className="space-y-6">
      {/* Tab Content */}
      <div>
        {activeTab === 'feedback' && <FeedbackList />}
        {activeTab === 'suggestions' && <SuggestionsList />}
        {activeTab === 'locations' && <LocationsManager />}
        {activeTab === 'opt-ins' && <OptInsList />}
        {activeTab === 'billing' && <BillingPanel />}
        {activeTab === 'settings' && <SettingsPanel />}
        {activeTab === 'help' && <HelpPanel />}
      </div>
    </div>
  );
}