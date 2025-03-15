# Notion Style Resume Editor

A Notion-style resume editor built with Next.js, React, TipTap, and styled with Tailwind CSS.

## Features

- Interactive resume editing with block-based components
- Rich text editing capabilities using TipTap
- Different block types (headings, paragraphs)
- Layout options (horizontal, vertical)
- Modern UI with hover interactions and animations
- Fully responsive design

## Getting Started

Follow these steps to run the project locally:

1. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

2. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Technologies Used

- Next.js
- React
- TipTap Rich Text Editor
- Radix UI
- Framer Motion
- Tailwind CSS

## Project Structure

- `src/app` - Next.js app router files
- `src/components/editor` - Resume editor components
  - `ResumeEditor.js` - Main editor component with state management
  - `ResumeBlock.js` - Individual editable block component

## License

MIT
