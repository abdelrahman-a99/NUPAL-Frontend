# NU PAL - Academic Advising Platform

A modern, responsive web application for academic advising built with Next.js, React, and Tailwind CSS.

## 🚀 Features

- **Home Page**: Hero section, Services with interactive tabs, Platform Features carousel, About section, and Contact form
- **About Page**: University information with professional image effects and features carousel
- **Contact Page**: Student inquiry form with wave background
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Smooth Animations**: CSS transitions and keyframe animations
- **Interactive Components**: Tab navigation, accordion, auto-scrolling carousel

## 📁 Project Structure

```
src/
├── app/                    # Next.js pages
│   ├── page.tsx           # Home page
│   ├── about/page.tsx     # About Us page
│   ├── contact/page.tsx   # Contact Us page
│   └── layout.tsx         # Root layout
├── components/            # React components
│   └── layout/            # Layout components (Navbar, Footer)
└── data/                  # Data files
    ├── services.ts        # Services data
    └── features.ts        # Features data
```

See [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) for detailed structure.

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **React**: 19.2.0

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🎨 Design System

- **Primary Color**: Blue (`blue-600`, `blue-700`)
- **Secondary Colors**: Indigo, Purple
- **Text Colors**: Slate (600, 700, 900)
- **Typography**: Sans-serif, bold headings, regular body text

## 📝 Code Organization

- **Components**: Reusable UI components in `src/components/`
- **Pages**: Route pages in `src/app/`
- **Data**: Static data in `src/data/`
- **Styles**: Global styles in `src/app/globals.css`

## 🔧 Development

The project follows Next.js App Router conventions:
- Pages are defined in `src/app/` directory
- Components are in `src/components/`
- Data is separated into `src/data/` for maintainability

## 📄 License

© 2025 NU PAL. All rights reserved.
