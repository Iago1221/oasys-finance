---
page: dashboard
---
The Executive Dashboard Overview page for the Oasys ERP.

**DESIGN SYSTEM (REQUIRED):**
# Design System: Sales & Billing Pipeline
**Project ID:** 3978190227870712132

## 1. Visual Theme & Atmosphere
The interface features a **Clean, Modern, and Data-Dense** atmosphere tailored for financial and operational monitoring. The design approach is highly structured, relying heavily on cards to segment information clearly. In dark mode, it feels sleek and professional, using subtle borders and varying shades of slate to create depth without overwhelming drop shadows. The generous use of whitespace within cards balances the high density of numerical data and status indicators.

## 2. Color Palette & Roles

### Base & Background
* **Light Theme Background:** Soft Off-White (`#f6f7f8`) - Used for the main application canvas in light mode.
* **Dark Theme Background:** Deep Obsidian (`#101022`) - Used for the main application canvas in dark mode.
* **Card Surface (Light):** Pure White or Light Slate (`#f1f5f9` / `bg-slate-100`) - Used to elevate content areas.
* **Card Surface (Dark):** Dark Slate (`#1e293b` / `bg-slate-800`) - Used to elevate content areas against the deep background.
* **Borders & Dividers:** Subtle Slate (`#e2e8f0` / `border-slate-200` in light, `#334155` / `border-slate-700` in dark) - Used for structural separation and defining cards.

### Accents & Typography
* **Primary Brand Accent:** Vibrant Azure (`#0d0df2`) - Used for primary actions, active navigation states, key buttons, and prominent data visualizations (like the largest segment of a donut chart).
* **Primary Text:** High Contrast Slate (`#0f172a` text-slate-900 in light, `#f1f5f9` text-slate-100 in dark) - Used for headings, main data points, and standard text.
* **Secondary Text:** Muted Slate (`#475569` text-slate-600 in light, `#94a3b8` text-slate-400 in dark) - Used for labels, subtitles, and less critical information.

### Status Semantic Colors
* **Success/Positive:** Bright Emerald (`#0bda5b` or `text-green-500`) - Used for positive trends (+X%), incoming transfers, and completed statuses.
* **Warning/Pending:** Amber (`text-yellow-500`) - Used for pending items (often with a low-opacity background like `bg-yellow-500/10`) and mid-level alerts.
* **Danger/Negative:** Vivid Coral/Red (`#fa6238` or `text-red-500`) - Used for negative trends (-X%), overdue items, and debits. Often paired with a low-opacity background (`bg-red-500/10`).

## 3. Typography Rules
* **Font Family:** Inter (`font-display`, `sans-serif`).
* **Headings:** Bold (`font-bold`), typically size `text-lg` or `text-base`, used heavily for section titles and critical numerical values.
* **Body/Labels:** Medium to Bold weight (`font-medium`, `font-bold`), often utilizing smaller sizes (`text-sm`, `text-xs`, `text-[10px]`) for dense data presentation.
* **Status Badges:** Uses `uppercase tracking-tighter` with extra small fonts (`text-[10px]` or `text-xs`) to create compact, pill-like tags.
* **Icons:** Google Material Symbols Outlined (filled and outlined variations depending on the active state).

## 4. Component Stylings
* **Cards/Containers:** Generously rounded corners (`rounded-xl` / 12px). They use a solid background color (Slate 100 or 800) with a subtle 1px border (`border-slate-200` or `700`) to create a defining edge rather than relying on heavy shadows.
* **Primary Buttons:** Pill-shaped or smoothly rounded (`rounded-xl`), filled with the Primary Accent (`bg-primary`), white text, and a noticeable colored shadow (`shadow-lg shadow-primary/20`) to make them pop.
* **Secondary Buttons:** Same shape (`rounded-xl`), but filled with the card surface color (`bg-slate-200` or `800`) with primary text color.
* **Status Badges & Icons Containers:** Fully rounded (`rounded-full`), typically using a 10% opacity version of the semantic color for the background with the full-strength color for the text/icon inside.
* **Alert Items (Pending/Overdue):** Presented as list items within cards, featuring a thick left border (e.g., `border-l-4 border-red-500`) to immediately draw the eye to critical issues.

**Page Structure:**
Convert the layout of `Executive_Dashboard_Overview.html` into a reusable React component structure utilizing Tailwind CSS. Ensure Dark mode works seamlessly according to the design system.
