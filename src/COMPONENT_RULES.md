# AmigosHangouts Component Rules

## Structure Preservation
- All JSX structure must be preserved exactly as written
- No optimization or restructuring without explicit request
- Line count must match original files
- All comments must be preserved

## Style Rules
- Tailwind conversions must preserve all original styling
- No merging or simplifying of style classes
- Keep all spacing, padding, and layout exactly as designed
- Preserve all animations and transitions

## Firebase Integration
- All Firebase/Firestore connections must be preserved
- No changes to data structure or queries
- Preserve all security rules and indexes
- Keep all storage rules intact

## Component Guidelines
- Card-based layouts must stay intact
- Navigation structure cannot be modified
- Modal and portal setup must be preserved
- All state management must follow existing patterns

## How to Use These Rules
1. Copy relevant sections into component files as comments
2. Use // ⛔️ NO_MODIFY markers for critical sections
3. Reference this file in PR descriptions
4. Use these rules for all new components 