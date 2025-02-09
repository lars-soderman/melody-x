# Melodikryss - Interactive Crossword Grid Editor

> 🤖 **Note:** Nearly every line of code here is written by [Cursor](https://cursor.sh/)

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
│   ├── useGrid.ts       # Grid state management
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

## Adding New Fonts

1. Import the font in `src/app/layout.tsx`:

```typescript
import { NewFont } from 'next/font/google';
const newFont = NewFont({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-new-font',
});
```

### 2. Add the CSS variable in `src/app/globals.css`:

```css
:root {
  --font-new-font: var(--font-new-font);
}
```

### 3. Add the font to the body class in `layout.tsx`:

```typescript
<body className={`${geistMono.variable} ${creepster.variable} ${newFont.variable} ...`}>
```

### 4. Add the font option to `FontSelector.tsx`:

```typescript
<select>
  <option value="var(--font-default)">Default</option>
  <option value="var(--font-creepster)">Creepster</option>
  <option value="var(--font-new-font)">New Font</option>
</select>
```

### Local Fonts

For local fonts, use `next/font/local` instead:

```typescript
import localFont from 'next/font/local';

const localNewFont = localFont({
  src: './fonts/NewFont.woff2',
  variable: '--font-new-font',
});
```

All fonts are automatically optimized and self-hosted by Next.js for optimal performance.

## Roadmap

Current features:

- [x] Create and manage multiple projects
- [x] Link boxes together
- [x] Edit box contents
- [x] Local storage persistence
- [x] Dark mode

Planned features:

- [ ] Project sharing
  - First iteration: URL-based sharing with compression
    - Remove empty boxes when generating share URL
    - Base64 encode the compressed data
    - Read-only view for shared projects
  - Future considerations:
    - Backend storage for larger projects
    - Collaborative editing
- [ ] Export to different formats
- [ ] Keyboard shortcuts
- [ ] Mobile-friendly UI
- [ ] Undo/redo
- [ ] Different box sizes
- [ ] Custom colors
- [ ] Multiple box selection
- [ ] Drag to create links
- [ ] Import from text

## 🏗 Architecture

### State Management

The application uses a custom state management pattern built on React's useReducer, with clear separation of concerns:

#### 1. Reducer (Pure State Updates)

- Lives in `src/reducers/gridReducer.ts`
- Handles pure state transitions
- Contains no side effects or external dependencies
- Easy to test and predict

```typescript
// Example of pure state update in reducer
case 'ADD_HINT': {
return {
...state,
hints: [...state.hints, {
id: action.id,
boxId: action.boxId,
direction: action.direction,
length: action.length,
number: action.number,
text: '',
}],
boxes: state.boxes.map(box =>
getId(box) === action.boxId
? { ...box, hint: action.number }
: box
)
};
}
```

#### 2. Hook (Logic & Side Effects)

- Lives in `src/hooks/useGrid.ts`
- Orchestrates complex state interactions
- Handles side effects (API, localStorage)
- Provides the public API for components
- Manages external store synchronization

````typescript
// Example of logic orchestration in hook
const onToggleHint = useCallback((id: string) => {
const box = state.boxes.find(box => getId(box) === id);
if (!box) return;
if (box.hint) {
dispatch({ type: 'REMOVE_HINT', id });
} else {
const direction = calculateHintDirection(state.boxes, box);
const length = calculateHintLength(state.boxes, box, direction);
const nextNumber = getNextHintNumber();
dispatch({
type: 'ADD_HINT',
id: uuidv4(),
boxId: id,
direction,
length,
number: nextNumber,
});
}
}, [state.boxes, getNextHintNumber]);```

#### 3. Components (UI & User Interaction)
- Live in `src/app/components/`
- Handle user interactions
- Render UI based on state
- Call hook methods to update state

### External Store Synchronization

State changes are synchronized with external stores (database/localStorage) using effects at the hook level:

```typescript
useEffect(() => {
  if (!project || project.id !== prevProjectIdRef.current) return;

  const hasStateChanged = checkStateChanges(state, prevStateRef.current);
  if (hasStateChanged) {
    prevStateRef.current = state;
    debouncedSave(state);
  }
}, [state, project]);
````

### Key Principles

1. **Single Source of Truth**: All state manipulation logic lives in the reducer
2. **Predictable Updates**: Reducers are pure functions with no side effects
3. **Clear Boundaries**: Separation between state transitions, business logic, and UI
4. **Side Effects**: Handled in the hook layer using useEffect
5. **External Sync**: Database/localStorage synchronization managed through effects

This architecture provides:

- 🧪 Better testability
- 🔍 Easier debugging
- 📦 Modular code organization
- 🔄 Predictable state updates
- 🎯 Clear separation of concerns

## Component Organization

### Shared Components (`src/components/`)

- Components used across multiple routes or other components
- Generic UI components
- Feature-specific reusable components

### Route Components (`src/app/components/`)

- Components specific to a single route
- Components only used by one other component

## 🔧 Technical Debt & Improvements

1. **Component Organization**

   - Move shared components to appropriate locations
   - Standardize component imports
   - Document component dependencies

2. **State Management**

   - Split grid reducer into smaller modules
   - Move action types to separate file

3. **Performance**

   - Virtualize grid for large puzzles
   - Optimize re-renders
   - Memoize expensive calculations

4. **Type Safety**
   - Stricter action types
   - Branded types for IDs
   - Better grid-cols TypeScript support

### Code Cleanup

- Clean up commented code
- Remove console.logs
- Standardize prop patterns
