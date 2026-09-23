# ERP MVP — Responsive Desktop & Mobile Architecture

## 1. Goal
Build one responsive Next.js/React application that automatically transforms the supplied laptop dashboard into the supplied mobile dashboard as screen width changes. Do not create separate desktop/mobile applications or separate business logic.

**Same:** routes, React components, API contracts, PostgreSQL data, calculations, authentication, search, filters and state.

**Changes:** layout, navigation, card arrangement, tables, filters, chart dimensions, typography, spacing and interaction patterns.

## 2. Breakpoints
| Width | Layout |
|---|---|
| <640px | Small mobile |
| 640–767px | Mobile |
| 768–1023px | Tablet |
| 1024–1279px | Laptop |
| 1280–1535px | Desktop |
| ≥1536px | Large desktop |

Primary QA sizes: 360, 390, 414, 768, 820, 1024, 1280, 1366, 1440, 1536 and 1920px.

## 3. Application Shell

### Desktop
`Header + 240–280px sidebar + main content`

### Tablet
`Compact header + 72–88px collapsed sidebar + main content`

### Mobile
`Compact top header + main content + fixed bottom navigation`; the full sidebar becomes a slide-out drawer.

Do not make separate dashboard routes. Use one `/dashboard` route.

## 4. Dashboard Transformation

### Desktop
Banner → KPI row → two-column charts/widgets → store performance → activity.

### Mobile
Banner → KPI grid/carousel → full-width charts → inventory → store performance → activity.

All widgets use the same API data. CSS controls their layout.

## 5. Banner
Use the single supplied store image everywhere:

`/public/images/banners/store-banner.webp`

Recommended:
- Desktop: 220–300px high
- Tablet: 200–240px
- Mobile: 150–190px
- `object-fit: cover`
- Responsive Next.js `<Image>`
- Adjust `object-position` only if the crop hides important content.

Do not create separate desktop/mobile banner assets unless the crop proves unusable.

## 6. Navigation
Desktop: full sidebar with logo, store image, labels and navigation.

Tablet: collapsed icon sidebar.

Mobile: top-left menu opens drawer; bottom navigation contains the highest-use sections.

Suggested mobile bottom navigation:
`Home | Inventory | Stores | Reports | More`

## 7. Header
Desktop: title, search, notifications, store selector, avatar.

Tablet: reduced search and spacing.

Mobile: menu button, title, notification, avatar. Search becomes an expandable/search-row component instead of squeezing the desktop search bar.

## 8. KPI Cards
Desktop: 4-column row.
Tablet: 2–4 columns.
Mobile: 2-column grid or horizontal scroll for very narrow screens.

Same component and API; only CSS dimensions change.

## 9. Tables
Desktop: full table.

Mobile: transform each row into a card.

Use shared data definitions:
```text
rows[]
columns[]
actions[]
```

Recommended components:
`DataTable` and `MobileDataCard`.

Do not duplicate business calculations.

## 10. Filters
Desktop: inline search/filter controls.

Mobile: search row + Filter + Sort buttons. Filter opens a bottom sheet containing the same filter fields.

Important filters can be synchronized into URL parameters, e.g.:
`/inventory?store=store-01&status=low-stock`

## 11. Charts
Use Recharts `ResponsiveContainer`.

Desktop: charts can sit side-by-side.
Mobile: charts become full width and use shorter heights.

Reduce mobile axis labels, legends and spacing. Never convert charts into static images.

## 12. Forms and Modals
Desktop forms may use two columns.

Mobile forms become one column.

Desktop modal: centered, approximately 420–700px.

Mobile modal: bottom sheet or nearly full-screen, maximum height around 90vh.

## 13. Section-by-Section Transformation

### Inventory
Desktop: KPI cards + filter bar + inventory table.
Mobile: KPI grid + search/filter + product cards.

### Stores
Desktop: store cards/table + map + metrics.
Mobile: stacked store cards + metrics + responsive map.

### Partners & Customers
Desktop: tabs + filters + table.
Mobile: horizontally scrollable tabs + filters + cards.

### Ledger
Desktop: account summary + date filters + transaction table.
Mobile: account summary + filters + transaction cards.

### Reports
Desktop: report categories + filters + charts + tables + export.
Mobile: report selector + filters + chart + summary + scrollable data + export menu.

### Settings
Desktop: settings sidebar + content.
Mobile: settings categories → selected setting screen.

## 14. Frontend Component Architecture
```text
frontend/src/
├── app/
│   ├── dashboard/
│   ├── inventory/
│   ├── stores/
│   ├── partners/
│   ├── ledger/
│   ├── reports/
│   └── settings/
├── components/
│   ├── layout/
│   │   ├── AppShell
│   │   ├── DesktopSidebar
│   │   ├── MobileHeader
│   │   ├── MobileDrawer
│   │   └── MobileBottomNav
│   ├── common/
│   │   ├── SearchBar
│   │   ├── FilterBar
│   │   ├── FilterSheet
│   │   ├── KpiCard
│   │   ├── DataTable
│   │   ├── MobileDataCard
│   │   ├── EmptyState
│   │   └── LoadingSkeleton
│   └── dashboard/
│       ├── DashboardBanner
│       ├── DashboardKpis
│       ├── SalesChart
│       ├── InventorySummary
│       └── RecentActivity
├── hooks/
│   ├── useMediaQuery
│   ├── useResponsive
│   └── useSidebar
├── lib/
│   ├── api
│   ├── breakpoints
│   └── responsive
└── styles/
    ├── globals.css
    └── tokens.css
```

## 15. CSS-First Responsiveness
Prefer Tailwind responsive classes, CSS Grid, Flexbox and container queries.

Avoid making every component depend on:
`window.innerWidth`.

Use JavaScript only where behavior actually differs, such as opening a mobile drawer instead of displaying a persistent sidebar.

## 16. Backend/API
Do not create desktop and mobile APIs.

Use the same endpoints, for example:
`GET /api/dashboard/overview`
`GET /api/inventory/overview`

Backend remains responsible for:
- database queries
- business calculations
- authorization
- search
- filtering
- sorting
- pagination
- report calculations
- inventory/financial calculations

Frontend remains responsible for:
- layout
- responsive presentation
- UI interaction
- loading/error/empty states

## 17. State Synchronization
When resizing from laptop to mobile, retain:
- selected store
- search
- filters
- date range
- sort
- pagination where appropriate
- user/session
- notification state

Use shared React/TanStack Query state and URL parameters for important filters.

Example:
`Desktop → resize → Mobile`
must still show the same selected store and active filters.

## 18. Image Handling
Use Next.js Image with responsive `sizes`.

Example:
```tsx
<Image
  src="/images/banners/store-banner.webp"
  fill
  sizes="(max-width: 767px) 100vw, (max-width: 1279px) 90vw, 1600px"
  className="object-cover"
/>
```

Use WebP/AVIF where practical and lazy-load below-the-fold images.

## 19. Typography
Shared design tokens; do not hard-code sizes independently in each component.

Suggested:
- Font: Inter
- Desktop page title: 28–32px
- Mobile page title: 20–24px
- Section title: 18–24px
- Body: 14–16px
- Caption: 12–13px

## 20. Spacing
Use a 4/8px system:
`4, 8, 12, 16, 20, 24, 32, 40, 48px`

Desktop cards: 20–24px padding.
Mobile cards: 14–16px padding.

## 21. Touch and Accessibility
Minimum interactive target: 44×44px.

Preserve:
- keyboard navigation
- visible focus
- semantic HTML
- accessible dialogs
- screen-reader labels
- sufficient contrast
- touch-friendly controls

## 22. Performance
- Next.js Image optimization
- lazy loading
- code splitting
- dynamic loading for heavy charts
- server-side filtering/pagination
- debounced search
- lightweight icon library
- no unnecessary desktop-only asset downloads on mobile

## 23. Responsive Matrix
| Component | Desktop | Tablet | Mobile |
|---|---|---|---|
| Sidebar | Full | Collapsed | Drawer |
| Bottom nav | No | No | Yes |
| Header | Full | Compact | Compact |
| Search | Inline | Smaller | Separate |
| KPI | 4 columns | 2–4 | 2 columns |
| Tables | Full | Condensed | Cards |
| Filters | Inline | Wrapped | Bottom sheet |
| Charts | 2 columns | 1–2 | 1 column |
| Banner | 220–300px | 200–240px | 150–190px |
| Modal | Centered | Centered | Bottom sheet |
| Forms | 2 columns | 2 columns | 1 column |

## 24. Implementation Order
1. Create design tokens.
2. Build AppShell.
3. Build desktop sidebar.
4. Build tablet collapsed sidebar.
5. Build mobile header/drawer/bottom navigation.
6. Build responsive dashboard.
7. Convert tables to responsive table/card components.
8. Convert filters to desktop/mobile variants.
9. Make charts responsive.
10. Apply the same system to Inventory, Stores, Partners, Ledger, Reports and Settings.
11. Add URL-backed filters.
12. Run responsive QA.

## 25. Acceptance Criteria
- Desktop matches the supplied laptop reference closely.
- Mobile matches the supplied mobile reference closely.
- Browser resizing automatically transforms the layout.
- No horizontal overflow at mobile widths.
- No separate mobile application/routes.
- Same backend/API/data model.
- Sidebar correctly transforms to drawer/bottom navigation.
- Tables correctly transform to cards.
- Filters correctly transform to mobile sheets.
- Charts resize without breaking.
- Banner crop remains usable.
- Forms become single-column.
- Important state remains synchronized during resizing.
- Loading, error and empty states work at every breakpoint.

## 26. Final Architecture
```text
             ONE RESPONSIVE WEB APP
                       |
          ┌────────────┴────────────┐
          |                         |
       Desktop                    Mobile
          |                         |
     CSS/Layout                 CSS/Layout
          └────────────┬────────────┘
                       |
                SAME COMPONENTS
                       |
                 SAME API
                       |
              SAME BUSINESS LOGIC
                       |
                SAME DATABASE
```

**Key rule:** reproduce the behavior of the two supplied screenshots through a responsive design system, not by maintaining two separate versions of the website.
