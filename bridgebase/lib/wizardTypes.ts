export interface WizardState {
  category: string;
  urgency: 'today' | 'this_week' | 'exploring' | '';
  freeOnly: boolean;
  walkInsOnly: boolean;
  language: string;
  transport: 'car' | 'transit' | 'nearby' | '';
  eligibilityTags: string[];
}

export const defaultWizardState: WizardState = {
  category: '',
  urgency: '',
  freeOnly: false,
  walkInsOnly: false,
  language: '',
  transport: '',
  eligibilityTags: [],
};

export const WIZARD_CATEGORIES = [
  { id: 'food', label: 'Food', description: 'Food banks, meal programs, SNAP assistance', icon: 'Utensils' },
  { id: 'housing', label: 'Housing', description: 'Shelters, rent help, housing programs', icon: 'Home' },
  { id: 'healthcare', label: 'Healthcare', description: 'Clinics, hospitals, medical assistance', icon: 'Heart' },
  { id: 'mental-health', label: 'Mental Health', description: 'Counseling, therapy, crisis support', icon: 'Brain' },
  { id: 'jobs', label: 'Jobs', description: 'Employment, training, career services', icon: 'Briefcase' },
  { id: 'legal', label: 'Legal Help', description: 'Legal aid, court assistance, rights', icon: 'Scale' },
  { id: 'transportation', label: 'Transportation', description: 'Bus passes, ride programs, transit help', icon: 'Bus' },
  { id: 'family', label: 'Family & Youth', description: 'Childcare, youth programs, family support', icon: 'Users' },
];

export const WIZARD_URGENCY = [
  { id: 'today', label: 'Today', description: 'I need help right now', color: 'error' },
  { id: 'this_week', label: 'This Week', description: 'Within the next few days', color: 'warning' },
  { id: 'exploring', label: 'Just Exploring', description: 'Planning ahead', color: 'success' },
];

export const WIZARD_LANGUAGES = [
  { id: 'english', label: 'English' },
  { id: 'spanish', label: 'Spanish / Español' },
  { id: 'chinese', label: 'Chinese / 中文' },
  { id: 'vietnamese', label: 'Vietnamese / Tiếng Việt' },
  { id: 'other', label: 'Other language' },
];

export const WIZARD_TRANSPORT = [
  { id: 'car', label: 'I have a car', description: 'Can drive anywhere', icon: 'Car' },
  { id: 'transit', label: 'Bus or Light Rail', description: 'Using CATS transit', icon: 'Bus' },
  { id: 'nearby', label: 'Walking only', description: 'Need somewhere close', icon: 'Footprints' },
];

export const WIZARD_ELIGIBILITY = [
  { id: 'individual', label: 'Individual' },
  { id: 'family', label: 'Family with children' },
  { id: 'senior', label: 'Senior (65+)' },
  { id: 'veteran', label: 'Veteran' },
  { id: 'youth', label: 'Youth (under 18)' },
  { id: 'homeless', label: 'Currently homeless' },
  { id: 'low-income', label: 'Low income' },
  { id: 'uninsured', label: 'No health insurance' },
];

export function buildSearchQuery(state: WizardState): string {
  const parts: string[] = [];
  
  if (state.category) {
    const categoryMap: Record<string, string> = {
      'food': 'food assistance food bank',
      'housing': 'housing shelter rent assistance',
      'healthcare': 'healthcare clinic doctor',
      'mental-health': 'mental health counseling therapy',
      'jobs': 'jobs employment career',
      'legal': 'legal aid attorney help',
      'transportation': 'transportation bus transit',
      'family': 'family youth programs childcare',
    };
    parts.push(categoryMap[state.category] || state.category);
  }
  
  if (state.freeOnly) parts.push('free');
  if (state.walkInsOnly) parts.push('walk-in');
  if (state.urgency === 'today') parts.push('emergency');
  
  return parts.join(' ') || 'community resources';
}

export function encodeWizardState(state: WizardState): string {
  return btoa(JSON.stringify(state));
}

export function decodeWizardState(encoded: string): WizardState | null {
  try {
    return JSON.parse(atob(encoded));
  } catch {
    return null;
  }
}
