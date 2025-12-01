# NU PAL Frontend - Project Structure Documentation

This document provides a comprehensive overview of the project structure to help maintain consistency across team development.

## 📁 Root Directory Structure

```
NUPAL-Frontend/
├── src/                    # Source code directory
├── public/                 # Static assets (images, icons, etc.)
├── node_modules/           # Dependencies (auto-generated, don't modify)
├── .next/                  # Next.js build output (auto-generated, don't modify)
├── package.json            # Project dependencies and scripts
├── package-lock.json       # Locked dependency versions
├── tsconfig.json           # TypeScript configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── next.config.ts          # Next.js configuration
├── postcss.config.mjs      # PostCSS configuration
├── eslint.config.mjs       # ESLint configuration
├── component.json          # shadcn/ui component configuration
├── next-env.d.ts           # Next.js TypeScript definitions
└── README.md               # Project documentation
```

---

## 📂 Detailed Folder Structure

### `/src` - Source Code Directory

The main source code directory following Next.js App Router conventions.

#### `/src/app` - Next.js App Router Pages

**Purpose**: Contains all route pages and the root layout. Each folder represents a route.

**Structure**:
```
src/app/
├── layout.tsx              # Root layout (wraps all pages)
├── page.tsx                # Home page (/)
├── globals.css             # Global CSS styles and Tailwind imports
├── not-found.tsx           # 404 error page
├── about/
│   └── page.tsx           # About page (/about)
├── contact/
│   └── page.tsx           # Contact page (/contact)
├── login/
│   └── page.tsx           # Login page (/login)
└── import/
    └── page.tsx           # Student import utility page (/import)
```

**Key Files**:
- `layout.tsx`: Root layout component that includes Navbar and Footer. Wraps all pages.
- `page.tsx`: Home page with Hero, Services, Features, About, and Contact sections.
- `globals.css`: Global styles, Tailwind imports, and custom animations (gradient, scroll, waveFloat).

**Conventions**:
- Each route folder must contain a `page.tsx` file
- Use `'use client'` directive for client-side interactivity
- Pages are server components by default unless marked with `'use client'`

---

#### `/src/components` - React Components

**Purpose**: Reusable UI components organized by feature/domain.

**Structure**:
```
src/components/
├── auth/                   # Authentication components
│   └── LoginForm.tsx       # Login form component
├── home/                   # Home page specific components
│   ├── Hero.tsx            # Hero section with background image
│   ├── ServicesSection.tsx # Services with tabs and accordion
│   ├── AboutIntroSection.tsx # About section with image
│   └── ContactSection.tsx  # Contact form with wave background
├── layout/                 # Layout components (shared across pages)
│   ├── Navbar.tsx          # Navigation bar (sticky header)
│   └── Footer.tsx          # Footer with links and social media
└── ui/                     # Reusable UI components
    └── FeaturesSection.tsx # Features carousel component
```

**Component Organization**:
- **`auth/`**: Authentication-related components
- **`home/`**: Components specific to the home page
- **`layout/`**: Shared layout components (Navbar, Footer)
- **`ui/`**: Reusable UI components that can be used across pages

**Conventions**:
- All components use TypeScript (.tsx)
- Client components use `'use client'` directive
- Components are exported as default exports
- Use `@/` alias for imports (configured in tsconfig.json)

---

#### `/src/data` - Static Data Files

**Purpose**: Centralized data storage for static content.

**Structure**:
```
src/data/
├── features.ts             # Features data (array of Feature objects)
└── services.ts             # Services data (array of Service objects)
```

**Key Files**:
- `features.ts`: Defines `Feature` interface and exports `features` array (8 features)
- `services.ts`: Defines `Service` interface and exports `services` array (4 services)

**Conventions**:
- Export TypeScript interfaces for type safety
- Export arrays/objects as named exports
- Keep data structure consistent and well-typed

---

### `/public` - Static Assets

**Purpose**: Publicly accessible static files (images, icons, etc.).

**Structure**:
```
public/
├── nile 2.jpg             # Hero background image
├── nile4.jpg              # About section image
├── placeholder.svg        # Placeholder image
├── robots.txt             # SEO robots file
└── services/              # Service-related images
    ├── ai-recommendations.jpg
    ├── advisor-connection.jpg
    ├── progress-tracking.jpg
    └── semester-planning.jpg
```

**Conventions**:
- Reference files with `/filename` (e.g., `/nile4.jpg`)
- Keep images organized in subfolders by category
- Use descriptive filenames

---

## 🔧 Configuration Files

### `package.json`
- **Dependencies**: Next.js 16.0.3, React 19.2.0, Tailwind CSS 4
- **Scripts**:
  - `npm run dev`: Start development server
  - `npm run build`: Build for production
  - `npm start`: Start production server
  - `npm run lint`: Run ESLint

### `tsconfig.json`
- TypeScript configuration
- Path alias: `@/*` → `./src/*`
- Target: ES2017
- Module resolution: bundler

### `tailwind.config.ts`
- Tailwind CSS 4 configuration
- Custom animations: `waveFloat`, `gradient`
- Content paths: `./src/**/*.{ts,tsx}`
- Theme extensions for fonts and border radius

### `next.config.ts`
- Next.js configuration
- Currently minimal (no custom config)

### `component.json`
- shadcn/ui component system configuration
- Defines aliases for components, ui, utils
- Style: default, RSC: false

---

## 🎨 Design System & Styling

### Color Palette
- **Primary**: Blue (`blue-400`, `blue-500`, `blue-600`)
- **Secondary**: Indigo, Purple gradients
- **Text**: Slate (`slate-600`, `slate-700`, `slate-900`)
- **Background**: White, gradients

### Typography
- Font: Inter (sans-serif)
- Headings: Bold, large sizes (text-3xl to text-6xl)
- Body: Regular weight, slate colors

### Animations
- `gradient`: Background gradient animation (20s)
- `scroll`: Horizontal scroll for features carousel (30s)
- `waveFloat`: Wave SVG floating animation (6-15s)

---

## 🔄 Routing Structure

### Routes
- `/` - Home page (Hero, Services, Features, About, Contact)
- `/about` - About page (AboutIntroSection, FeaturesSection)
- `/contact` - Contact page (ContactSection)
- `/login` - Login page (LoginForm, no Navbar/Footer)
- `/import` - Student import utility (development tool)

### Navigation
- Navbar handles routing with Next.js `Link` component
- Services link on home page uses hash navigation (`#services`)
- Login page hides Navbar and Footer

---

## 📝 Code Patterns & Conventions

### Component Patterns
1. **Client Components**: Use `'use client'` for interactive components
2. **Server Components**: Default for pages (unless client-side needed)
3. **Imports**: Use `@/` alias (e.g., `@/components/home/Hero`)
4. **Exports**: Default exports for components

### State Management
- Local state with `useState` hook
- No global state management library (consider adding if needed)

### API Integration
- Login form: `http://localhost:5009/api/students/login`
- Import page: `http://localhost:5009/api/students/import`
- Backend API runs on port 5009

### Styling Patterns
- Tailwind CSS utility classes
- Custom animations in `globals.css`
- Responsive design with Tailwind breakpoints (sm, lg, etc.)

---

## 🚫 What NOT to Change

### Structure
- **DO NOT** change folder structure without team discussion
- **DO NOT** move files between `/src/app`, `/src/components`, `/src/data` without coordination
- **DO NOT** modify auto-generated files (`.next/`, `node_modules/`)

### Conventions
- **DO NOT** remove `'use client'` from components that use hooks
- **DO NOT** change import aliases (`@/`) without updating tsconfig.json
- **DO NOT** modify `layout.tsx` structure (affects all pages)

### Configuration
- **DO NOT** change `tsconfig.json` paths without team approval
- **DO NOT** modify `tailwind.config.ts` content paths
- **DO NOT** change `component.json` aliases

---

## ✅ Best Practices

### Adding New Pages
1. Create folder in `/src/app/[route-name]/`
2. Add `page.tsx` file
3. Use `'use client'` if needed for interactivity
4. Import components from `/src/components`

### Adding New Components
1. Place in appropriate folder (`/src/components/[category]/`)
2. Use TypeScript with proper types
3. Add `'use client'` if using hooks or browser APIs
4. Export as default export

### Adding New Data
1. Add to `/src/data/[name].ts`
2. Define TypeScript interface
3. Export as named export
4. Import in components using `@/data/[name]`

### Adding New Assets
1. Place in `/public/` or `/public/[category]/`
2. Reference with `/filename` path
3. Use descriptive filenames

---

## 🔍 Key Dependencies

- **Next.js 16.0.3**: React framework with App Router
- **React 19.2.0**: UI library
- **TypeScript 5**: Type safety
- **Tailwind CSS 4**: Utility-first CSS framework
- **ESLint**: Code linting

---

## 📞 Team Coordination Notes

1. **Before making structural changes**: Discuss with team
2. **Component location**: Follow existing folder organization
3. **Naming conventions**: Use PascalCase for components, kebab-case for routes
4. **API endpoints**: Backend runs on `localhost:5009`
5. **Styling**: Stick to Tailwind utility classes, avoid custom CSS when possible

---

## 🎯 Quick Reference

### Import Paths
- Components: `@/components/[category]/[Component]`
- Data: `@/data/[file]`
- Pages: Relative imports within `/src/app`

### Common Patterns
- Client component: `'use client'` + hooks
- Server component: Default, no directive needed
- Page route: `/src/app/[route]/page.tsx`
- Layout: `/src/app/layout.tsx` (root layout)

---

**Last Updated**: 2025
**Maintained By**: NU PAL Development Team

