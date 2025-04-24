
# ComplianceCore Design System

This document outlines the design system and color palette used throughout the ComplianceCore platform.

## Color Palette

### Primary Colors
- **Primary Blue**: Used for primary actions, links, and focus states
- **Accent Purple**: Used for highlighting important information and secondary actions
- **Success Green**: Used for success states, completion indicators
- **Warning Yellow**: Used for warning states, pending actions
- **Error Red**: Used for error states, destructive actions
- **Info Blue**: Used for informational states (same as primary)

### Neutral Colors
- **Background**: Light blue-gray for the main background
- **Card**: White for card backgrounds
- **Foreground**: Deep blue-gray for text
- **Border**: Light gray for borders
- **Muted**: Light gray for muted UI elements

## Typography

- **Sans-serif**: Inter font for body text and general UI
- **Display**: Satoshi font for headings and emphasized text
- **Monospace**: JetBrains Mono for code and technical content

## Component Usage

### Buttons
- **Primary Button**: Use for primary actions (Save, Submit, Continue)
- **Secondary Button**: Use for secondary actions (Cancel, Back)
- **Accent Button**: Use for special actions that need attention
- **Destructive Button**: Use for potentially destructive actions (Delete, Remove)
- **Success Button**: Use for positive actions (Approve, Complete)
- **Ghost Button**: Use for subtle actions in already busy interfaces
- **Link Button**: Use for navigation-like actions

### Status Indicators
- **Success**: Use for completed, approved, or verified states
- **Warning**: Use for pending, in progress, or awaiting states
- **Danger**: Use for error, rejected, or critical states
- **Info**: Use for informational or notification states
- **Neutral**: Use for neutral or default states

### Cards
- Standard cards with subtle shadows and border
- Hover effects to indicate interactivity
- Active state with accent border and glow

### Glassmorphism Effects
- `.glass` class for frosted glass effect backgrounds
- `.glass-card` class for semi-transparent card backgrounds

## Accessibility

- All color combinations meet WCAG 2.1 AA contrast requirements
- Dark mode support with carefully adjusted colors for proper contrast
- Focus states are clearly visible and accessible

## Light and Dark Mode

The design system supports both light and dark modes:
- Light mode uses a clean, bright palette with subtle shadows
- Dark mode uses deeper colors with adjusted brightness and contrast

## Animation and Motion

- Subtle animations for hover and active states
- Transition effects for smoother user experience
- Loading states and progress indicators

## Usage Guidelines

1. Use color purposefully to guide user attention
2. Maintain consistent spacing and sizing
3. Follow accessibility guidelines
4. Use appropriate status indicators
5. Combine colors and icons for clearer communication

## Implementation

The design system is implemented using Tailwind CSS with custom properties for easy theming and consistency.
