# Melodikryss - Interactive Crossword Grid Editor

> 🤖 **Note:** Nearly every line of code here is written by [Cursor](https://cursor.sh/),

A React-based crossword puzzle editor with dynamic grid manipulation and real-time editing capabilities.

## ✨ Features

- 📏 Dynamic grid resizing
- ➕ Add/remove rows and columns
- ⌨️ Keyboard navigation
- ⬛ Black cell toggling
- ➡️ Arrow indicators for clues
- 🔢 Hint number management
- 📄 PDF export
- 💾 Local storage persistence

## 🚀 Getting Started

### Prerequisites

- Node.js
- npm/yarn

### Installation

```bash
npm install
npm run dev
```

Visit `http://localhost:4000`

## 🏗️ Project Structure

### Core Components

```yomama
src/
├── app/
│   ├── components/
│   │   ├── CrosswordGrid.tsx   # Main grid component
│   │   ├── GridCell.tsx        # Individual cell component
│   │   ├── BoxInput.tsx        # Editable cell input
│   │   └── Settings.tsx        # Configuration panel
│   └── page.tsx                # Main page
├── hooks/
│   ├── useGridReducer.ts       # Grid state management
│   └── useGridNavigation.ts    # Keyboard navigation
├── types/
│   └── index.ts               # Type definitions
└── utils/
    └── grid.ts                # Grid utilities
```

## 🔧 Technical Debt & Improvements

1. **State Management**

   - Split grid reducer into smaller modules
   - Move action types to separate file

2. **Performance**

   - Virtualize grid for large puzzles
   - Optimize re-renders
   - Memoize expensive calculations

3. **Type Safety**
   - Stricter action types
   - Branded types for IDs
   - Better grid-cols TypeScript support

### Code Cleanup

- Clean up commented code
- Remove console.logs
- Standardize prop patterns

## 🎯 Future Features

- [ ] Handle multiple melodikryss
- [ ] Undo/Redo functionality
- [ ] Multiple grid templates
- [ ] Clue management system
- [ ] Collaborative editing
- [ ] Grid validation rules
- [ ] Import/Export formats
- [ ] Accessibility improvements
- [ ] Mobile responsiveness

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## 📝 License

...

## 🔗 Contact

...
