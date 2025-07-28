# Transformation XPLR

## AI Assistant Markdown Support

The AI Assistant now supports rich markdown formatting for enhanced readability and better information presentation:

### Supported Markdown Features:

- **Headers** (H1-H6) for content organization
- **Bold** and _italic_ text emphasis
- **Lists** (bulleted and numbered) for structured information
- **Code blocks** with syntax highlighting and copy functionality
- **Tables** for data presentation
- **Blockquotes** for important notes and tips
- **Links** for references and resources

### Copy Code Feature:

Code blocks now include a copy button in the top-right corner for easy copying to clipboard.

### Quick Access:

Use the "Markdown Demo" quick action in the AI Assistant to see examples of all formatting capabilities.

---

This project was generated with Wallah - AI-powered application generator.

## 🚀 Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📦 What's Included

This application comes with a complete, production-ready setup:

### 🎨 UI Components

- **Shadcn/UI Library**: Complete set of accessible, customizable components
- **Button, Card, Input, Label, Badge**: Essential UI building blocks
- **Toast System**: User notifications with useToast hook
- **Responsive Design**: Mobile-first, works on all devices

### 🛠️ Development Tools

- **TypeScript**: Strict typing for better development experience
- **Tailwind CSS**: Utility-first CSS framework with full configuration
- **ESLint**: Code quality and consistency
- **PostCSS & Autoprefixer**: CSS processing and browser compatibility

### 📚 Available Libraries

- **Animations**: Motion for React (React 19 compatible) for smooth transitions
- **Charts**: Recharts for data visualization
- **Forms**: React Hook Form with Zod validation
- **Dates**: date-fns for date manipulation
- **Icons**: Lucide React icon library
- **Routing**: React Router DOM (if needed)
- **State Management**: Built-in React hooks + Context API

### 🧩 Complete UI Component Library

This project includes a comprehensive set of production-ready UI components:

**📝 Form Components:**

- Button (variants, sizes, loading states)
- Input (text, email, password, etc.)
- Textarea (resizable, auto-grow)
- Label (accessible form labels)
- Checkbox (checked, indeterminate states)
- Switch (toggle on/off controls)
- RadioGroup (single selection from options)
- Select (dropdown with search and groups)
- Slider (range input for numeric values)

**📦 Layout & Display:**

- Card (header, content, footer sections)
- Avatar (image, fallback, status indicators)
- Badge (colored labels and status indicators)
- Separator (horizontal/vertical dividers)
- Progress (loading bars and completion status)
- Skeleton (loading state placeholders)

**💬 Feedback & Interaction:**

- Alert (info, warning, error, success)
- Toast (notifications with actions)
- Dialog (modals, confirmations, forms)
- Tabs (organize content in sections)
- Accordion (collapsible content sections)

**✨ All components include:**

- Full TypeScript support with proper interfaces
- Dark/light mode compatibility
- Accessibility (WCAG 2.1 AA compliant)
- Responsive design (mobile-first)
- Consistent styling with Tailwind CSS
- Radix UI primitives for robust functionality

### 🔧 Features

- **Dark/Light Theme Support**: Next Themes integration
- **Accessibility**: WCAG compliant components
- **Performance**: Optimized for Core Web Vitals
- **TypeScript**: Full type safety throughout
- **Responsive**: Mobile-first responsive design

## ⚛️ React 19 Compatibility

This project is fully compatible with React 19 and includes:

- **Latest React Features**: Uses React 19 with Next.js 15.1.4
- **Updated Dependencies**: All major dependencies updated for React 19 compatibility:
  - Motion for React 12.x (replaces Framer Motion)
  - react-day-picker 9.x (latest version)
  - All Radix UI components with React 19 support
  - Recharts with react-is override for compatibility
- **Zero Configuration**: Everything works out of the box with `npm install`

### 🔄 Animation Migration Note

If you're familiar with Framer Motion, the API is almost identical:

```javascript
// Old: import { motion } from "framer-motion"
import { motion } from "motion/react";

// The component API remains the same
<motion.div animate={{ opacity: 1 }} />;
```

## 🏗️ Project Structure

```
transformationxplr/
├── app/                  # Next.js app directory
│   ├── page.tsx         # Main application page
│   ├── layout.tsx       # Root layout with fonts
│   └── globals.css      # Global styles
├── components/ui/        # Reusable UI components
│   ├── button.tsx       # Button component
│   ├── card.tsx         # Card component
│   ├── input.tsx        # Input component
│   ├── label.tsx        # Label component
│   ├── badge.tsx        # Badge component
│   └── toast.tsx        # Toast notifications
├── hooks/               # Custom React hooks
│   └── use-toast.ts     # Toast functionality
├── lib/                 # Utility functions
│   └── utils.ts         # Class name utilities (cn)
├── package.json         # Dependencies and scripts
├── tailwind.config.js   # Tailwind configuration
├── tsconfig.json        # TypeScript configuration
└── next.config.js       # Next.js configuration
```

## 🎯 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🎨 Styling

This project uses **Tailwind CSS** with a complete design system:

- **Colors**: Professional palette with light theme optimization
- **Typography**: Inter font for UI, JetBrains Mono for code
- **Components**: Shadcn/UI for consistent, accessible components
- **Animations**: Smooth transitions with Tailwind CSS Animate

## 📱 Responsive Design

The application is built mobile-first and includes:

- Responsive breakpoints (sm, md, lg, xl)
- Touch-friendly interactions
- Optimized layouts for all screen sizes

## 🔧 Customization

All components are fully customizable:

- Modify `tailwind.config.js` for design tokens
- Edit component files in `components/ui/`
- Add new variants using `class-variance-authority`
- Extend with additional Radix UI components

## 📖 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Shadcn/UI](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Framer Motion](https://www.framer.com/motion/)

## 🤝 Support

Generated with ❤️ by Wallah AI Application Generator

---

**Note**: This is a complete, production-ready application with enterprise-grade components and features. All dependencies are included and configured for immediate development.
