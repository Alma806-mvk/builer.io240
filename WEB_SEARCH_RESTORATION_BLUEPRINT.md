# Web Search Tab Restoration Blueprint

## What was hidden
The Web Search tab has been commented out in the main navigation but all the underlying functionality remains intact.

## Quick Restoration Steps

### Method 1: Uncomment the Tab (Easiest)
1. Open `App.tsx`
2. Go to around line 6845-6859 (search for "HIDDEN: Web Search Tab")
3. Remove the comment markers (`//`) from the entire block:

```typescript
// FROM (commented out):
// HIDDEN: Web Search Tab (Restore by uncommenting this block)
// {
//   id: "search",
//   label: "Web Search",
//   icon: (
//     <img
//       src="/icons/web-search.webp"
//       alt="Web Search"
//       className="w-6 h-6 object-contain transition-all duration-200"
//       style={{
//         filter: "brightness(0) saturate(100%) invert(1)",
//         userSelect: "none",
//         pointerEvents: "none",
//       }}
//     />
//   ),
// },

// TO (uncommented):
{
  id: "search",
  label: "Web Search",
  icon: (
    <img
      src="/icons/web-search.webp"
      alt="Web Search"
      className="w-6 h-6 object-contain transition-all duration-200"
      style={{
        filter: "brightness(0) saturate(100%) invert(1)",
        userSelect: "none",
        pointerEvents: "none",
      }}
    />
  ),
},
```

4. Save the file - the Web Search tab will immediately reappear

## What Remains Functional
- All Web Search components (`EnhancedWebSearch.tsx`, `WebSearchSection.tsx`)
- All Web Search services and backend functionality
- All Web Search keyboard shortcuts (⌘W)
- All Web Search command palette entries
- All Web Search notification systems

## Files That Reference Web Search
- `App.tsx` - Main tab navigation (THIS IS WHAT WAS MODIFIED)
- `src/components/EnhancedWebSearch.tsx` - Main search component
- `src/components/WebSearchSection.tsx` - Search interface
- `src/components/GlobalCommandPalette.tsx` - Keyboard shortcuts
- `src/components/StudioHubCommandPalette.tsx` - Command palette
- `src/components/GenerationHandlers.tsx` - Search handlers

## Alternative Restoration Methods

### Method 2: Conditional Display
Replace the commented block with:
```typescript
...(process.env.ENABLE_WEB_SEARCH === 'true' ? [{
  id: "search",
  label: "Web Search",
  // ... rest of the config
}] : []),
```

### Method 3: Feature Flag
Add a feature flag system to control tab visibility dynamically.

## Testing After Restoration
1. Click the Web Search tab - should navigate properly
2. Try keyboard shortcut ⌘W - should open Web Search
3. Use command palette to search for "Web Search" - should work
4. Perform a search - all functionality should be intact

**Note**: No code was deleted, only hidden. Full restoration takes less than 1 minute.
