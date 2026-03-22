# BridgeBase - Community Resource Hub

BridgeBase is a modern community resource hub designed for the TSA Webmaster competition. It helps users quickly discover trusted local community resources including food assistance, housing support, healthcare, tutoring, jobs, transportation, counseling, youth programs, and emergency help.

## Features

- **Resource Directory** - Browse 26+ community resources with powerful search and filtering
- **Category Navigation** - 9 essential categories to quickly find relevant support
- **Featured Resources** - Spotlight on key community organizations
- **Advanced Filtering** - Filter by cost, format, audience, location, and more
- **Resource Details** - Comprehensive information including hours, services, eligibility, and accessibility
- **Community Submissions** - Submit new resources to help expand the directory
- **Dark Mode** - Fully themed light and dark mode support
- **Responsive Design** - Optimized for desktop, tablet, and mobile

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Theme**: next-themes

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd bridgebase
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
bridgebase/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout with fonts and providers
│   ├── page.tsx            # Main page component
│   ├── providers.tsx       # Theme provider
│   └── globals.css         # Global styles and CSS variables
├── components/
│   ├── layout/             # Navbar, Footer
│   ├── sections/           # Page sections (Hero, Featured, etc.)
│   ├── resources/          # Resource-specific components
│   └── ui/                 # Reusable UI components
├── data/
│   └── resources.ts        # Mock resource data (26+ entries)
└── lib/
    ├── types.ts            # TypeScript interfaces
    └── utils.ts            # Utility functions
```

## Resource Categories

1. Food Assistance
2. Housing
3. Healthcare
4. Mental Health
5. Education
6. Jobs
7. Transportation
8. Youth Programs
9. Emergency Help

## Design Philosophy

BridgeBase was designed to feel:
- **Welcoming** - Warm colors and approachable UI
- **Trustworthy** - Professional design with clear information
- **Accessible** - Good contrast, keyboard navigation, responsive
- **Modern** - Clean typography, subtle animations, polished interactions

## Color Palette

### Light Mode
- Primary: Deep Navy (#1e3a5f)
- Accent: Muted Teal (#2d9596)
- Background: Off-white (#fafafa)
- Success: Green (#059669)

### Dark Mode
- Background: Rich Slate (#0f172a)
- Surface: Elevated Slate (#1e293b)
- Accent: Teal (#2dd4bf)

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## License

This project was created for the TSA Webmaster competition.
