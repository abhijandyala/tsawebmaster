import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function scrollToSection(id: string) {
  const element = document.getElementById(id);
  if (element) {
    const navbarHeight = 80;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
  }
}

export function isOpenNow(hours: string): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const now = new Date();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDay = days[now.getDay()];
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTime = currentHour * 60 + currentMinute;

  const hoursLower = hours.toLowerCase();

  if (hoursLower.includes('24/7') || hoursLower.includes('24 hours')) {
    return true;
  }

  if (hoursLower.includes('closed')) {
    return false;
  }

  const dayPatterns: Record<string, RegExp> = {
    'Monday': /\bmon(?:day)?\b/i,
    'Tuesday': /\btue(?:sday)?\b/i,
    'Wednesday': /\bwed(?:nesday)?\b/i,
    'Thursday': /\bthu(?:rsday)?\b/i,
    'Friday': /\bfri(?:day)?\b/i,
    'Saturday': /\bsat(?:urday)?\b/i,
    'Sunday': /\bsun(?:day)?\b/i,
  };

  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const isWeekday = weekdays.includes(currentDay);

  const weekdayPattern = /mon(?:day)?\s*[-–]\s*fri(?:day)?/i;
  if (weekdayPattern.test(hours)) {
    if (isWeekday) {
      const timeMatch = hours.match(/(\d{1,2}):?(\d{2})?\s*(am|pm)?\s*[-–]\s*(\d{1,2}):?(\d{2})?\s*(am|pm)?/i);
      if (timeMatch) {
        const openTime = parseTime(timeMatch[1], timeMatch[2], timeMatch[3]);
        const closeTime = parseTime(timeMatch[4], timeMatch[5], timeMatch[6]);
        return currentTime >= openTime && currentTime <= closeTime;
      }
    }
    return false;
  }

  const satSunPattern = /sat(?:urday)?\s*[-–]\s*sun(?:day)?/i;
  if (satSunPattern.test(hours)) {
    if (currentDay === 'Saturday' || currentDay === 'Sunday') {
      const timeMatch = hours.match(/(\d{1,2}):?(\d{2})?\s*(am|pm)?\s*[-–]\s*(\d{1,2}):?(\d{2})?\s*(am|pm)?/i);
      if (timeMatch) {
        const openTime = parseTime(timeMatch[1], timeMatch[2], timeMatch[3]);
        const closeTime = parseTime(timeMatch[4], timeMatch[5], timeMatch[6]);
        return currentTime >= openTime && currentTime <= closeTime;
      }
    }
    return false;
  }

  const currentDayPattern = dayPatterns[currentDay];
  if (currentDayPattern && currentDayPattern.test(hours)) {
    const daySection = hours.split(/,|;/).find((section) => currentDayPattern.test(section));
    if (daySection) {
      const timeMatch = daySection.match(/(\d{1,2}):?(\d{2})?\s*(am|pm)?\s*[-–]\s*(\d{1,2}):?(\d{2})?\s*(am|pm)?/i);
      if (timeMatch) {
        const openTime = parseTime(timeMatch[1], timeMatch[2], timeMatch[3]);
        const closeTime = parseTime(timeMatch[4], timeMatch[5], timeMatch[6]);
        return currentTime >= openTime && currentTime <= closeTime;
      }
    }
  }

  return false;
}

function parseTime(hour: string, minute: string | undefined, period: string | undefined): number {
  let h = parseInt(hour, 10);
  const m = minute ? parseInt(minute, 10) : 0;

  if (period) {
    if (period.toLowerCase() === 'pm' && h !== 12) {
      h += 12;
    } else if (period.toLowerCase() === 'am' && h === 12) {
      h = 0;
    }
  }

  return h * 60 + m;
}

export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10;
}

export function validateUrl(url: string): boolean {
  if (!url) return true;
  try {
    new URL(url.startsWith('http') ? url : `https://${url}`);
    return true;
  } catch {
    return false;
  }
}
