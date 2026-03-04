# Design System: Novo visual
**Project ID:** 12815859909830507584

## 1. Visual Theme & Atmosphere
The interface is a clean, modern, and airy dashboard designed for AI video generation. It feels professional and slightly utilitarian, ensuring that user content (videos and statuses) takes center stage. The use of generous whitespace, subtle shadows, and a light color palette creates a calming and distraction-free environment. Dynamic elements like shimmer effects add a touch of modern interactivity.

## 2. Color Palette & Roles

*   **Indigo Primary** (#6366f1) — Used for primary calls to action, active tab highlights, progress bars, and key icons (like play buttons on hover).
*   **Pure White Background** (#ffffff) — Main background color for interactive cards, sticky headers, and input fields on focus.
*   **Soft Surface Gray** (#f9fafb) — The primary application background color (app canvas) to provide contrast against white cards.
*   **Light Border Gray** (#f3f4f6) — Used for subtle dividers and base card outlines.
*   **Dark Border Gray** (#e5e7eb) — Used for more prominent borders and separators between sections.
*   **Slate Text Dark** (#0f172a) — Primary text color for all headings, titles, and strong emphasis text.
*   **Slate Text Medium** (#64748b) — Secondary text color used for descriptions, metadata, and inactive navigation tabs.
*   **Status Emerald** (#059669) — Used specifically for positive status indicators (e.g., "READY" badges).
*   **Status Crimson** (#ef4444) — Used for dangerous actions, like canceling a processing job.

## 3. Typography Rules
*   **Font Family:** Inter (sans-serif)
*   **Headings:** Employs bold weights (`font-bold`, 700) with tight letter spacing (`tracking-tight`) to create strong, readable anchors.
*   **Body & Metadata:** Uses medium (`font-medium`, 500) and bold weights. Metadata (like format specs "4K • 24 FPS") uses specifically tiny text with uppercase styling and very wide letter spacing (`tracking-widest`, `uppercase`) to look like technical readouts.

## 4. Component Stylings
*   **Buttons:** Generally feature subtly rounded corners (`rounded-lg`) or generously rounded corners (`rounded-xl`). Primary buttons are filled with the Indigo Primary color. Secondary buttons use transparent backgrounds with Slate Text Medium and Light Border Gray outlines.
*   **Cards/Containers:** Content blocks use generously rounded corners (`rounded-xl`), Pure White backgrounds, and Light Border Gray borders. Hover states introduce a subtle border color shift (towards Primary) and soft drop shadows (`shadow-sm`, `shadow-md`) to indicate interactivity.
*   **Inputs/Forms:** The search bar is entirely pill-shaped (`rounded-full`), defaulting to a light gray background with no visible border. Upon focus, it gains a subtle colored ring (`ring-2 ring-primary/20`) and shifts to a white background.

## 5. Layout Principles
*   **Page Structure:** The layout relies on a top sticky header and a centered main content column with a maximum width (`max-w-6xl`). 
*   **Whitespace & Margins:** Uses generous padding on the outer edges (`px-6 lg:px-20`) and distinct vertical spacing (`py-10`) to separate sections.
*   **Alignment:** Utilizes flexbox heavily for horizontal alignment of items (e.g., cards with thumbnails on the left and metadata on the right). Sections are spaced out with large gaps (`gap-10`, `gap-12`) to maintain the airy atmosphere.
