Markdown

# Modern Responsive Calculator App

A mobile-responsive calculator application built with **React**, **Next.js** (App Router), **TypeScript**, and **Tailwind CSS**, accompanied by comprehensive unit tests using **Vitest**.

**Live Demo:** [https://syvra-calculator.vercel.app](https://syvra-calculator.vercel.app)

---

## Features

- **Smartphone-Inspired UI:** Mobile-first, responsive interface built with Tailwind CSS that adapts seamlessly across phone, tablet, and desktop viewports.
- **Dual Calculation Modes:**
  - **Standard Mode:** Core arithmetic operations (`+`, `-`, `×`, `÷`), sign toggling (`±`), percentages (`%`), backspace (`⌫`), and clear (`AC`/`C`).
  - **Scientific Mode:** Quick-toggle panel unlocking square root (`√`), exponents (`x²`), trigonometric functions (`sin`, `cos`), and `π`.
- **Calculation History:** Collapsible log drawer tracking past evaluations and expressions.
- **Keyboard Accessibility:** Direct desktop keyboard integration (`0-9`, `.`, `+`, `-`, `*`, `/`, `Enter`, `Backspace`, `Escape`, `%`).
- **Robust Edge-Case Logic:**
  - Protection against division by zero (`Error` output state).
  - Floating-point precision formatting (prevents standard JavaScript decimal rounding glitches like `0.1 + 0.2 = 0.30000000000000004`).
  - Strict validation preventing duplicate decimal point entries.

---

## Tech Stack

- **Framework:** Next.js 15+ (App Router, React 19)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Testing:** Vitest & React Testing Library (`jsdom`)
- **Deployment:** Vercel

---

## Running Unit Tests

All state management and arithmetic calculation logic are isolated inside a dedicated custom hook (`useCalculator.ts`), enabling reliable unit testing without UI rendering overhead.

To execute the test suite locally:

```bash
npm test
```

The suite includes 13 unit test cases covering digit concatenation, operator chaining, decimal handling, backspace, clear functions, floating-point precision rounding, and history logging.

## Local Setup Instructions

1. Clone the repository:

```bash
git clone https://github.com/JadenMayoff/syvra-calculator.git

cd syvra-calculator
```

2. Install dependencies:

```bash
npm install --legacy-peer-deps
```

3. Run the development server:

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Sources & Attributions

In accordance with the technical evaluation instructions:

- AI Collaboration: Developed with assistance from Gemini AI for architectural design, custom hook state isolation, Vitest/Vite testing suite configuration, and floating-point edge-case validation.

- Design & UX: Modeled after native smartphone calculator layout standards and interaction patterns.

- Core Dependencies: Next.js, React, Tailwind CSS, Vitest, and React Testing Library.
