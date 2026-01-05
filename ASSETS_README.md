# Asset Requirements

This app requires the following assets to be placed in the `assets/` folder:

## Required Assets

1. **icon.png**
   - Size: 1024x1024 px
   - Format: PNG
   - Purpose: App icon
   - Suggestion: Use a simple icon with the app's color scheme (slate-900 background with a zap/lightning bolt in white or indigo)

2. **splash.png**
   - Size: 1242x2436 px (iPhone 11 Pro Max)
   - Format: PNG
   - Purpose: Splash screen
   - Suggestion: White background with "Crave Count" text and tagline

3. **adaptive-icon.png**
   - Size: 1024x1024 px
   - Format: PNG
   - Purpose: Android adaptive icon (foreground)
   - Suggestion: Same as icon.png but with transparency

4. **favicon.png**
   - Size: 48x48 px
   - Format: PNG
   - Purpose: Web favicon
   - Suggestion: Simplified version of the app icon

## Quick Setup Options

### Option 1: Use Expo's Default Assets
Run this command to copy Expo's default assets:
```bash
npx expo prebuild --clean
```

### Option 2: Create Simple Placeholders
You can use any image editor or online tool to create simple colored squares:
- Background color: #0f172a (slate-900)
- Add white text "CC" in the center

### Option 3: Use Figma/Canva
1. Create a 1024x1024 canvas
2. Add a dark blue/slate background
3. Add a lightning bolt icon (⚡) or the letters "CC"
4. Export at required sizes

### Option 4: Command Line Placeholders (ImageMagick)
If you have ImageMagick installed:
```bash
# Create icon.png
convert -size 1024x1024 xc:#0f172a -gravity center -pointsize 400 -fill white -annotate +0+0 "CC" assets/icon.png

# Create splash.png
convert -size 1242x2436 xc:#ffffff -gravity center -pointsize 100 -fill #0f172a -annotate +0+0 "Crave Count" assets/splash.png

# Create adaptive-icon.png (same as icon)
cp assets/icon.png assets/adaptive-icon.png

# Create favicon.png
convert assets/icon.png -resize 48x48 assets/favicon.png
```

## Note

The app will run without these assets, but you'll see warnings. For development purposes, any placeholder images will work fine.
