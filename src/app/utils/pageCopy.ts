/**
 * Helper to get custom page copy with fallback to defaults.
 * Replaces {name} with the location name when present.
 */

export type PageCopySection = 'feedback' | 'suggestions' | 'rewards';

const DEFAULTS: Record<PageCopySection, Record<string, string>> = {
  feedback: {
    page_title: 'How was your experience at {name}?',
    rating_prompt: 'Please rate your experience:',
    comment_placeholder: 'Share more about your experience... (optional)',
    comment_helper: 'This helps us understand your experience better',
    suggestion_link: 'Have a suggestion instead?',
  },
  suggestions: {
    page_title: 'Share your ideas',
    page_subtitle: "We'd love to hear your suggestions for {name}",
    suggestion_placeholder: 'I think it would be great if...',
    submit_button: 'Submit suggestion',
    privacy_note: 'Your suggestion will be reviewed by the {name} team',
    back_link: 'Rate your experience',
  },
  rewards: {
    page_title: 'Join Our Newsletter & Rewards Program',
    page_subtitle: 'Get exclusive offers from {name}, early access to new features, and earn rewards for your loyalty!',
    consent_text: 'I agree to receive promotional emails, SMS messages, and exclusive offers. I understand I can unsubscribe at any time.',
    join_button: 'Join Now',
    success_title: "You're all set!",
    success_message: "Thank you for joining our newsletter and rewards program. We'll keep you updated with exclusive offers!",
  },
};

function replaceName(text: string, name: string): string {
  return text.replace(/\{name\}/g, name || '');
}

export function getPageCopy(
  pageCopy: { feedback?: Record<string, string>; suggestions?: Record<string, string>; rewards?: Record<string, string> } | undefined,
  page: PageCopySection,
  field: string,
  locationName: string = ''
): string {
  const custom = pageCopy?.[page]?.[field];
  const fallback = DEFAULTS[page]?.[field] ?? '';
  const value = (custom?.trim() || fallback) as string;
  return replaceName(value, locationName);
}
