import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { MessageSquare, MapPin, HelpCircle, Settings } from 'lucide-react';
import { FeedbackList } from './dashboard/FeedbackList';
import { LocationsManager } from './dashboard/LocationsManager';
import { BillingPanel } from './dashboard/BillingPanel';
import { HelpPanel } from './dashboard/HelpPanel';
import { SettingsPanel } from './dashboard/SettingsPanel';

export function Dashboard() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tabFromUrl = searchParams.get('tab');

  // Valid tabs list (no overview)
  const validTabs = ['feedback', 'locations', 'billing', 'settings', 'help'];

  type TabId = 'feedback' | 'locations' | 'billing' | 'settings' | 'help';

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
    } else {
      navigate('/dashboard?tab=feedback', { replace: true });
      setActiveTab('feedback');
    }
  }, [tabFromUrl, navigate]);

  const tabs = [
    { id: 'feedback' as const, label: 'Feedback', icon: MessageSquare },
    { id: 'locations' as const, label: 'Locations', icon: MapPin },
    { id: 'settings' as const, label: 'Settings', icon: Settings },
    { id: 'help' as const, label: 'Help', icon: HelpCircle },
  ];

  return (
    <div className="space-y-6">
      {/* Tab Content */}
      <div>
        {activeTab === 'feedback' && <FeedbackList />}
        {activeTab === 'locations' && <LocationsManager />}
        {activeTab === 'billing' && <BillingPanel />}
        {activeTab === 'settings' && <SettingsPanel />}
        {activeTab === 'help' && <HelpPanel />}
      </div>
    </div>
  );
}