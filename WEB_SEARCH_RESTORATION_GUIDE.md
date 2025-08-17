# Web Search Tab Restoration Guide

## Overview
The Web Search tab has been temporarily hidden from the navigation interface. This guide provides step-by-step instructions on how to restore it to the application.

## Quick Restoration (5 minutes)

### Step 1: Restore Navigation Tabs

#### 1.1 Main Tab Navigation
Edit `src/components/MainTabNavigation.tsx`:

**Find lines 113-118** (around the commented Web Search section):
```tsx
// HIDDEN: Web Search tab - See WEB_SEARCH_RESTORATION_GUIDE.md for re-enabling instructions
// {
//   id: "search" as const,
//   label: "Web Search",
//   icon: <GlobeAltIcon className="h-4-25 w-4-25" />,
//   requiresAuth: false,
// },
```

**Replace with:**
```tsx
{
  id: "search" as const,
  label: "Web Search",
  icon: <GlobeAltIcon className="h-4-25 w-4-25" />,
  requiresAuth: false,
},
```

#### 1.2 Sidebar Navigation
Edit `src/components/SidebarNavigation.tsx`:

**Find lines 190-203** (around the commented Web Search section):
```tsx
// HIDDEN: Web Search tab - See WEB_SEARCH_RESTORATION_GUIDE.md for re-enabling instructions
// {
//   id: "search",
//   label: "Web Search",
//   icon: (
//     <img
//       src="/public/icons/web-search.webp"
//       alt="Web Search"
//       className="w-5 h-5 object-contain transition-all duration-200"
//       style={{ filter: "brightness(0) saturate(100%) invert(100%)" }}
//     />
//   ),
//   requiresAuth: false,
//   group: "planning",
// },
```

**Replace with:**
```tsx
{
  id: "search",
  label: "Web Search",
  icon: (
    <img
      src="/public/icons/web-search.webp"
      alt="Web Search"
      className="w-5 h-5 object-contain transition-all duration-200"
      style={{ filter: "brightness(0) saturate(100%) invert(100%)" }}
    />
  ),
  requiresAuth: false,
  group: "planning",
},
```

### Step 2: Verify Web Search Component

The Web Search functionality should still be intact in the main App.tsx file. Look for:
```tsx
{activeTab === "search" && (
  // Web Search component content
)}
```

## Additional Configuration

### Icon Setup
Ensure the Web Search icon exists at `/public/icons/web-search.webp`. If missing, you can:
1. Use a placeholder icon
2. Replace with a Heroicon component like `<GlobeAltIcon />`

### Feature Verification
After restoration, test the following:
- [ ] Tab appears in both main navigation and sidebar
- [ ] Clicking the tab switches to Web Search view
- [ ] Web Search functionality works as expected
- [ ] No console errors related to Web Search

## Troubleshooting

### Tab Not Appearing
1. Check for syntax errors in the navigation files
2. Verify the `id: "search"` matches throughout the codebase
3. Restart the development server

### Component Not Loading
1. Verify the Web Search component exists in App.tsx
2. Check for missing imports
3. Look for console errors

### Icon Issues
1. Check if the web-search.webp file exists
2. Replace with a Heroicon if needed:
   ```tsx
   icon: <GlobeAltIcon className="w-5 h-5" />
   ```

## Files Modified During Hiding

1. `src/components/MainTabNavigation.tsx` - Main tab navigation
2. `src/components/SidebarNavigation.tsx` - Sidebar navigation

## Related Documentation

- `WEB_SEARCH_RESTORATION_BLUEPRINT.md` - Technical implementation details
- `ENHANCED_WEB_SEARCH_FEATURES.md` - Feature specifications
- `debug-performWebSearch-fix.md` - Debug information

## Notes

- The Web Search functionality remains intact in the backend
- Only the UI navigation elements were hidden
- All Web Search-related components, services, and logic are preserved
- The feature can be restored without data loss

---

**Last Updated:** $(date)
**Restoration Time:** ~5 minutes
**Difficulty:** Beginner
