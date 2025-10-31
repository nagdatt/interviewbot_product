# Interview Bot Platform - Design Guidelines

## Design Approach

**System Selection**: Material Design 3 (Material UI v5 foundation)
**Rationale**: This is a utility-focused productivity platform requiring clarity, efficiency, and professional presentation. Material Design's emphasis on hierarchy, data density, and interaction patterns aligns perfectly with an interview practice tool.

**Design Influences**: Linear (clean typography, data organization), Notion (information architecture), VS Code (code editor integration)

---

## Core Design Principles

1. **Professional Clarity**: Clean, distraction-free interface that maintains focus during practice sessions
2. **Information Hierarchy**: Clear visual weight distinguishing primary actions from secondary content
3. **Responsive Fluidity**: Seamless experience across desktop (primary), tablet, and mobile devices
4. **Glassmorphism Accents**: Subtle frosted glass effects on key cards without compromising readability

---

## Color Palette

### Light Mode
- **Primary**: 220 85% 55% (professional blue - interviews, CTAs)
- **Surface**: 0 0% 100% (pure white backgrounds)
- **Surface Variant**: 220 15% 96% (subtle cards, input backgrounds)
- **On Surface**: 220 15% 20% (primary text)
- **On Surface Variant**: 220 10% 45% (secondary text)
- **Border**: 220 15% 88% (dividers, card outlines)
- **Success**: 142 71% 45% (positive feedback, correct answers)
- **Error**: 0 72% 51% (validation errors, incorrect responses)
- **Warning**: 38 92% 50% (alerts, time warnings)

### Dark Mode
- **Primary**: 220 85% 65% (brighter for contrast)
- **Surface**: 220 18% 12% (dark charcoal base)
- **Surface Variant**: 220 15% 18% (elevated cards)
- **On Surface**: 220 15% 95% (primary text)
- **On Surface Variant**: 220 10% 70% (secondary text)
- **Border**: 220 15% 25% (subtle dividers)

### Glassmorphism Effects
- **Glass Background**: Surface color at 70% opacity
- **Backdrop Blur**: 12px for prominent cards (Camera, Voice Input)
- **Border**: 1px solid with Surface color at 20% opacity
- **Use Cases**: Camera feed card, voice input card, floating action buttons

---

## Typography

### Font Family
- **Primary**: 'Inter', sans-serif (body text, UI elements)
- **Monospace**: 'JetBrains Mono', monospace (code editor, technical content)

### Type Scale
- **Hero Heading**: 48px/56px, weight 700 (Welcome messages)
- **Section Heading**: 32px/40px, weight 600 (Page titles)
- **Card Title**: 20px/28px, weight 600 (Component headers)
- **Body Large**: 16px/24px, weight 400 (Primary content)
- **Body**: 14px/20px, weight 400 (Standard text)
- **Caption**: 12px/16px, weight 400 (Metadata, hints)
- **Code**: 14px/20px, weight 400 (Editor content)

### Font Weight Distribution
- Bold (600-700): Headings, CTAs, active navigation
- Regular (400): Body text, labels, descriptions
- Light (300): Never used - maintain readability

---

## Layout System

### Spacing Scale
Primary units: **4, 8, 16, 24, 32, 48** (Tailwind equivalents: 1, 2, 4, 6, 8, 12)

### Container Widths
- **Max Content Width**: 1440px (main application container)
- **Interview Room Grid**: Two-column layout (40% left sidebar / 60% right content on desktop)
- **Form Max Width**: 480px (login, setup forms)
- **Card Spacing**: 24px gaps between cards

### Responsive Breakpoints
- **Mobile**: < 640px (single column, stacked cards)
- **Tablet**: 640px - 1024px (adjusted sidebar ratios)
- **Desktop**: > 1024px (full two-column layouts)

---

## Component Library

### Navigation (AppBar)
- **Height**: 64px fixed
- **Background**: Surface with 1px bottom border
- **Logo**: Left-aligned, 32px height
- **Navigation Items**: Right-aligned with 16px horizontal spacing
- **Mobile**: Hamburger menu icon, slide-in drawer
- **Avatar**: 40px circular, right-most position

### Cards
- **Default**: Rounded corners 12px, 1px border, 8px padding
- **Elevated**: Same as default + shadow (0 2px 8px rgba(0,0,0,0.08))
- **Glass Cards**: 70% opacity background, 12px backdrop blur, subtle border
- **Camera/Voice Cards**: Glass treatment with 24px padding

### Buttons
- **Primary**: Solid primary color background, white text, 10px rounded corners, 12px vertical padding, 24px horizontal padding
- **Secondary**: Border 2px primary color, primary text, same padding/rounding
- **Text**: No background, primary text, minimal padding
- **Icon Buttons**: 40px circular, primary color on hover background (10% opacity)
- **Large CTA**: 48px height for "Start Interview", "End Interview"

### Form Inputs
- **Text Fields**: Material UI outlined variant, 56px height, 8px border radius
- **Dropdowns**: Same styling as text fields with dropdown icon
- **Multi-Select**: Chip display for selected items, 32px chip height
- **File Upload**: Dashed border card with upload icon, 120px height

### Tables/Lists
- **Row Height**: 56px for data rows, 48px for headers
- **Striping**: Alternate rows with Surface Variant (5% opacity difference)
- **Hover State**: Surface Variant background on row hover
- **Pagination**: Bottom-aligned, 40px height controls

### Code Editor (Monaco Integration)
- **Background**: Surface Variant
- **Line Numbers**: 48px gutter width, On Surface Variant color
- **Theme**: Material Dark/Light matching app theme
- **Font**: JetBrains Mono 14px
- **Borders**: 1px all sides, 8px border radius

### Charts (Recharts)
- **Bar Charts**: Primary color bars, 8px border radius on bars
- **Line Charts**: Primary color line, 2px stroke width, dots on data points
- **Grid**: On Surface Variant at 10% opacity
- **Labels**: Body font, On Surface Variant color

### Tabs
- **Height**: 48px tab buttons
- **Indicator**: 3px bottom border, primary color
- **Active**: Primary color text, weight 600
- **Inactive**: On Surface Variant text, weight 400

### Camera Feed
- **Aspect Ratio**: 16:9 maintained
- **Border Radius**: 12px
- **Background**: Black when inactive
- **Overlay Controls**: Glass background, 8px rounded buttons

---

## Page-Specific Layouts

### Login/Signup Page
- Centered card: 480px max width
- 48px padding inside card
- Brand logo/title: 32px top margin
- Form spacing: 24px between fields
- Toggle link: 16px bottom margin

### Home Page
- Centered content: max-width 640px
- Welcome heading: 48px size, 24px bottom margin
- Start Interview CTA: Large button style, centered

### Interview Setup Page
- Form card: 600px max width, centered
- Section spacing: 32px between input groups
- Multi-select chips: 8px gap, wrapping layout
- Submit button: Full width of form

### Interview Room
- **Left Sidebar (40%)**:
  - Camera card: Full width, 24px bottom margin
  - Voice input card: Full width, auto height
  - Spacing between cards: 24px

- **Right Content (60%)**:
  - Tabs: Full width top
  - Question list: Scrollable, 16px padding items
  - Code editor: Full width when coding tab active
  - End Interview: Fixed bottom-right, 48px from edges

### Analysis Page
- Metric cards grid: 4 columns desktop, 2 tablet, 1 mobile
- Card size: Equal height, 160px minimum
- Chart section: Full width, 400px height
- Spacing: 24px gaps

### Interview History
- Table/card layout: Full width container
- Search bar: Top-aligned, 480px max width
- Row actions: Right-aligned icon buttons
- Pagination: 16px top margin

### Personal Details
- Two-column layout desktop (60% form / 40% preview)
- Resume upload: Prominent card, 200px height
- Text areas: Minimum 120px height
- Profile picture: 120px circular, top of preview column

---

## Animations & Transitions

**Philosophy**: Minimal, purposeful motion. No distracting effects during interview sessions.

### Allowed Animations
- Page transitions: 200ms fade-in opacity
- Modal/drawer entrances: 300ms slide + fade
- Button interactions: 150ms scale (0.98) on press
- Loading states: Circular progress spinners (primary color)
- Tab switching: 200ms content fade

### Prohibited
- Background animations during interview
- Hover effects on question lists (too distracting)
- Scrolling parallax effects
- Confetti or celebration animations

---

## Accessibility

- **Focus Indicators**: 2px primary color outline, 2px offset
- **Minimum Touch Targets**: 44px height for all interactive elements
- **Color Contrast**: WCAG AAA compliance for all text (7:1 minimum)
- **Dark Mode**: Automatic browser preference detection, manual toggle in navbar
- **Form Labels**: Always visible, never placeholder-only
- **Error Messages**: Icon + text, positioned below inputs

---

## Images

**Usage**: Limited - this is a data/function-focused application

### Required Images
1. **Brand Logo**: 32px height SVG, navbar left position
2. **Empty States**: Illustrations for no interview history (240px height, centered)
3. **Placeholder Avatar**: Default user icon when no profile picture uploaded

### No Hero Images
This application does not use large hero section imagery. The Home page leads with text-based welcome and immediate action (Start Interview).

---

## Key Differentiators

- **No Gradients**: Solid colors only, maintaining professional clarity
- **Glassmorphism for Depth**: Subtle blur effects exclusively on camera/voice cards
- **Data-First Layout**: Interview Room prioritizes question content and code editor space
- **Monospace Integration**: Code-specific typography seamlessly integrated
- **Consistent Spacing**: Strict adherence to 8px base unit system throughout