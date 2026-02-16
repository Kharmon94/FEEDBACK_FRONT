import { useState } from 'react';
import { HelpCircle, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router';

interface FAQItem {
  question: string;
  answer: string;
  links?: { text: string; url: string }[];
}

export function HelpPanel() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const navigate = useNavigate();

  const reviewPlatformGuides: FAQItem[] = [
    {
      question: 'How to find my Google Review link',
      answer: 'To get your Google Review link, you need to have a Google Business Profile. Here\'s how to find it:',
      links: [
        { text: '1. Go to Google Business Profile', url: 'https://business.google.com/' },
        { text: '2. Select your business location', url: '' },
        { text: '3. Click "Get more reviews" and copy the link', url: '' },
      ]
    },
    {
      question: 'How to find my Yelp review link',
      answer: 'Your Yelp review link follows this format: https://www.yelp.com/writeareview/biz/YOUR-BUSINESS-ID',
      links: [
        { text: 'Go to your Yelp Business page', url: 'https://biz.yelp.com/' },
        { text: 'Look for "Get More Reviews" option', url: '' },
      ]
    },
    {
      question: 'How to find my Facebook review link',
      answer: 'For Facebook, navigate to your business page and look for the Reviews section.',
      links: [
        { text: '1. Go to your Facebook Business Page', url: 'https://www.facebook.com/' },
        { text: '2. Click on "Reviews" tab', url: '' },
        { text: '3. Copy the page URL - this is your review link', url: '' },
      ]
    },
    {
      question: 'How to find my TripAdvisor review link',
      answer: 'TripAdvisor provides a direct review link for your business listing.',
      links: [
        { text: '1. Go to TripAdvisor Management Center', url: 'https://www.tripadvisor.com/Owners' },
        { text: '2. Select your business', url: '' },
        { text: '3. Find "Review Express" or copy your business URL', url: '' },
      ]
    },
    {
      question: 'How to find my Trustpilot review link',
      answer: 'Trustpilot allows you to create a review invitation link from your business dashboard.',
      links: [
        { text: '1. Log in to Trustpilot Business', url: 'https://businessapp.b2b.trustpilot.com/' },
        { text: '2. Go to "Get Reviews" section', url: '' },
        { text: '3. Copy your review invitation link', url: '' },
      ]
    },
  ];

  const generalFAQs: FAQItem[] = [
    {
      question: 'How do I add review platform links to my settings?',
      answer: 'Navigate to the Settings tab in your dashboard, scroll to the "Review Platform Links" section, and paste the URLs you\'ve collected from each platform. Make sure to save your changes.'
    },
    {
      question: 'What happens when a customer gives a 4-5 star rating?',
      answer: 'Customers who rate their experience 4 or 5 stars are directed to a thank you page that displays links to your selected review platforms. They can choose which platform to leave a public review on.'
    },
    {
      question: 'What happens when a customer gives a 1-3 star rating?',
      answer: 'Customers who rate their experience 1-3 stars are directed to a private feedback form where they can share details about their experience. This feedback is sent directly to your dashboard and is never made public.'
    },
    {
      question: 'Can I customize the feedback form?',
      answer: 'Yes! In the Settings panel, you can customize your business name, logo, and which review platforms to display. You can also enable auto-reply messages for customers who submit feedback.'
    },
    {
      question: 'How do I export my feedback data?',
      answer: 'In the Feedback tab, click the "Export CSV" button to download all your feedback submissions in a spreadsheet format. This includes ratings, comments, customer info, and timestamps.'
    },
  ];

  const toggleExpanded = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h2 className="text-2xl text-slate-900 mb-2 text-center">Help Center</h2>
        <p className="text-slate-600 text-center">
          Find answers to common questions and learn how to get the most out of Feedback Page
        </p>
      </div>

      {/* Review Platform Guides */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <ExternalLink className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-slate-900">
            Finding Your Review Platform Links
          </h3>
        </div>
        
        <div className="space-y-3">
          {reviewPlatformGuides.map((item, index) => (
            <div key={index} className="border border-slate-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleExpanded(index)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
              >
                <span className="font-medium text-slate-900">{item.question}</span>
                {expandedIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-slate-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                )}
              </button>
              
              {expandedIndex === index && (
                <div className="px-4 pb-4 pt-2 bg-slate-50">
                  <p className="text-slate-700 mb-3">{item.answer}</p>
                  {item.links && (
                    <div className="space-y-2">
                      {item.links.map((link, linkIndex) => (
                        <div key={linkIndex} className="flex items-start gap-2">
                          <span className="text-slate-600 text-sm">{link.text}</span>
                          {link.url && (
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-700 text-sm inline-flex items-center gap-1"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* General FAQs */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-slate-900">
            Frequently Asked Questions
          </h3>
        </div>
        
        <div className="space-y-3">
          {generalFAQs.map((item, index) => {
            const adjustedIndex = index + reviewPlatformGuides.length;
            return (
              <div key={index} className="border border-slate-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleExpanded(adjustedIndex)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="font-medium text-slate-900">{item.question}</span>
                  {expandedIndex === adjustedIndex ? (
                    <ChevronUp className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  )}
                </button>
                
                {expandedIndex === adjustedIndex && (
                  <div className="px-4 pb-4 pt-2 bg-slate-50">
                    <p className="text-slate-700">{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Contact Support */}
      <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Still need help?</h3>
        <p className="text-slate-700 mb-4">
          Can't find what you're looking for? Our support team is here to help.
        </p>
        <button 
          onClick={() => navigate('/dashboard/contact-support')}
          className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium"
        >
          Contact Support
        </button>
      </div>
    </div>
  );
}