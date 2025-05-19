# AmigosHangouts Project Structure

## Core Rules
- NO modifications to existing layout or structure
- NO "optimization" or "improvements" without explicit request
- Preserve ALL original styling and measurements
- Keep ALL Firebase/Firestore connections intact
- Maintain exact card layouts and designs

## File Structure
```
/src
  /components
    /common
      - FallingAEffect.jsx
      - PostDetailModal.jsx
    /pages
      - LandingPage.jsx
      - HomePage.jsx
      - AmigosPage.jsx
      - GruposPage.jsx
      - ProfilePage.jsx
  /assets
    - amigoshangouts1.png
    - amigoshangouts4.png
  /firebase.js
  /context
  /utils
```

## Design Constants
```css
/* Colors */
Primary: #FF6B6B
Hover: #e15555
Background: transparent
Card Background: white

/* Shadows */
Card Shadow: 0 5px 15px rgba(0,0,0,0.3)
Nav Shadow: 0 5px 15px rgba(0,0,0,0.1)

/* Fonts */
Font Family: Comfortaa, sans-serif

/* Animations */
Logo Animation: pulse-a 1.75s infinite

/* Border Radius */
Cards: 1.5rem
Buttons: 30px
Inputs: 0.5em
```

## Original Code

### LandingPage.jsx
```jsx
[Previous LandingPage.jsx code here - exact copy]
```

### HomePage.jsx
```jsx
[Will add HomePage code]
```

### AmigosPage.jsx
```jsx
[Will add AmigosPage code]
```

## Component Rules
1. LandingPage:
- Main card: max-width 500px, 90% width
- Login card: 14em width, absolute positioning
- Logo height: 20em
- Preserve all Firebase auth logic

2. HomePage:
- Feed card: max-width 800px, 90% width
- Post layout preserved exactly
- All Firebase/Firestore queries maintained

3. AmigosPage:
- Card navigation system preserved
- All user connections maintained
- Exact spacing between elements

4. Common Elements:
- Navigation bar styling consistent
- Card shadows and borders match
- Button styles uniform
- Form input styling preserved

## Firebase Integration
- Auth maintained in LandingPage
- User data structure preserved
- Collection names unchanged
- Security rules intact

## Mobile Responsiveness
- Breakpoint at 640px
- Login card repositioning
- Preserved spacing on mobile
- No layout structure changes

## DO NOT:
- Change any measurements
- Modify layout structure
- "Optimize" code
- Remove or combine styles
- Change Firebase logic
- Alter navigation flow

## Original Code References
[Include specific file contents here when needed] 