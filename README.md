# PlateGuy Clone — Next.js + Tailwind CSS

A professional clone of [plateguy.co.uk](https://plateguy.co.uk) built with Next.js 15 (App Router) and Tailwind CSS.

## Features

- **Full Next.js 14 App Router** setup with TypeScript
- **Custom Tailwind theme** — brand colours (yellow/black), custom fonts, animations
- **Responsive** — mobile, tablet, and desktop layouts
- **Professional dark theme** UI matching PlateGuy's branding
- **Interactive Plate Builder** — live preview with customisation options
- **All key static pages** ready for your content

## Pages Included

| Route | Description |
|---|---|
| `/` | Homepage with hero, plate styles grid, comparison section, reviews |
| `/plate-builder` | Interactive plate builder with live preview |
| `/plate-styles` | All plate styles listing with filters |
| `/help` | Help centre hub |
| `/help/contact` | Contact form + info |
| `/help/faqs` | Accordion FAQ with category filter |
| `/help/about` | About page with stats and team info |
| `/help/documents` | Required documents guide |

## Components

- `AnnouncementBar` — scrolling banner with close button
- `Navbar` — sticky header with dropdown menus + mobile menu
- `Footer` — full footer with links, contact info, legal
- `PlateCard` — reusable card for plate style listings
- `TrustBadges` — trust indicators section

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# If you want the default Next.js dev runner:
npm run dev:next

# Build for production
npm run build
```

Visit [http://localhost:3000](http://localhost:3000)

### Windows note: `spawn EPERM`
If `npm run dev:next` fails with `Error: spawn EPERM`, it’s usually a Windows security/policy restriction (often with projects under OneDrive/“Documents”). This repo’s default `npm run dev` uses an in-process dev runner (`scripts/next-dev-no-fork.js`) to avoid `child_process.fork`.

## Customisation

### Colours
Edit `tailwind.config.ts` — the brand palette is defined under `theme.extend.colors.brand`.

### Fonts
Fonts are loaded from Google Fonts in `globals.css`. Currently using:
- **Bebas Neue** — headings
- **DM Sans** — body text
- **JetBrains Mono** — monospace/plates

### Adding New Pages
Create new folders in `src/app/` following Next.js App Router conventions.

### Connecting to a Backend
The plate builder and contact form are currently static. To connect:
- Plate builder → connect to your cart/checkout API
- Contact form → connect to email service (e.g. Resend, EmailJS)
- Plate styles → fetch from your CMS/database

### Stripe card checkout (PaymentIntent)
This project includes a simple **non-session** Stripe checkout flow:
- Plate Builder → **ADD TO BASKET** saves the order locally and navigates to `/checkout`
- `/checkout` collects delivery/contact details and takes **card payment** with Stripe Elements (PaymentIntent)

- Copy `.env.example` → `.env.local`
- Set `STRIPE_SECRET_KEY` (required, server)
- Set `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (required, client)

### Security note (Next.js)
If Vercel reports a vulnerable Next.js version (CVE alert), update `next` + `eslint-config-next` in `package.json` and redeploy.

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Lucide React (icons)

## Notes

- Images are loaded from the original plateguy.co.uk CDN. Replace with your own hosted assets.
- The plate builder is a working UI prototype — wire it up to your checkout system.
- All text content can be edited directly in the component files or extracted to a CMS.
