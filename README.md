# Crave Count

A beautiful mobile app for tracking cravings and building resistance. Built with Expo, React Native, and NativeWind (Tailwind CSS).

## Features

- **Willpower Points System**: Earn +10 points for observing cravings, +30 for resisting
- **Category Tracking**: Track different types of cravings (Sugar, Junk Food, Social Media, etc.)
- **Beautiful UI**: Modern design with glass-morphism effects and smooth animations
- **Persistent Storage**: All data saved locally with AsyncStorage
- **Journal**: Full history of your moments with category filtering
- **Planned Joys**: Schedule treats you've earned

## Tech Stack

- **Framework**: Expo (React Native)
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Icons**: lucide-react-native
- **Navigation**: Expo Router (File-based routing)
- **State Management**: Zustand
- **Animations**: react-native-reanimated
- **Storage**: @react-native-async-storage/async-storage

## Setup Instructions

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Create Assets Folder** (if not exists):
   ```bash
   mkdir assets
   ```
   Add placeholder images:
   - `assets/icon.png` (1024x1024)
   - `assets/splash.png` (1242x2436)
   - `assets/adaptive-icon.png` (1024x1024)
   - `assets/favicon.png` (48x48)

3. **Start Development Server**:
   ```bash
   npm start
   ```

4. **Run on Device/Simulator**:
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app for physical device

## Project Structure

```
craveCount/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx      # Tab navigation with floating dock
│   │   ├── index.tsx        # Dashboard (Home)
│   │   ├── events.tsx       # Planned Joys
│   │   ├── add.tsx          # Placeholder for add button
│   │   ├── journal.tsx      # Full history with filters
│   │   └── settings.tsx     # Settings & preferences
│   └── _layout.tsx          # Root layout
├── components/
│   ├── LogCard.tsx          # Individual log entry card
│   ├── LogModal.tsx         # Bottom sheet for logging cravings
│   └── TikTokIcon.tsx       # Custom TikTok SVG icon
├── store/
│   └── useStore.ts          # Zustand store for state management
├── app.json                 # Expo configuration
├── babel.config.js          # Babel configuration with NativeWind
├── metro.config.js          # Metro bundler configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── global.css               # Global Tailwind styles
└── package.json             # Dependencies
```

## Design System

### Colors
- **Primary**: Slate-900 (#0f172a) - Dark backgrounds/buttons
- **Secondary**: Indigo-500 (#6366f1) - Glows/Highlights
- **Awareness**: Amber-500 (#f59e0b) - Observed cravings
- **Resistance**: Emerald-500 (#10b981) - Resisted cravings
- **Surface**: Slate-50 (#f8fafc) - Light backgrounds

### Typography
- **Font**: System default (Inter on iOS, Roboto on Android)
- **Headers**: Bold, tracking-tight
- **Body**: Regular weight
- **Labels**: Semibold, uppercase, tracking-wide

### Spacing & Borders
- **Border Radius**: Large (24px-32px for cards)
- **Touch Targets**: Minimum 44x44px
- **Spacing**: Consistent 6-unit scale (4px base)

## Usage

1. **Log a Craving**: Tap the center `+` button
2. **Choose Category**: Select from Sugar, Junk Food, Instagram, etc.
3. **Add Reflection** (Optional): Write what you're feeling
4. **Choose Action**:
   - **Observed** (+10 pts): You noticed the craving
   - **Resisted** (+30 pts): You successfully resisted!

## Customization

### Add New Categories
Edit `store/useStore.ts`:
```typescript
export type Category = 'Sugar' | 'Junk Food' | 'YourNewCategory';
```

### Change Point Values
Edit the `addLog` function in `store/useStore.ts`:
```typescript
const points = type === 'observed' ? 10 : 30; // Change these values
```

### Modify Colors
Edit `tailwind.config.js` to customize the color palette.

## Known Limitations

- Events/Planned Joys is currently a placeholder screen
- No user authentication (all data stored locally)
- No cloud sync
- No reminder/notification implementation (toggle exists in settings)

## Future Enhancements

- [ ] Firebase integration for cloud sync
- [ ] User authentication
- [ ] Real event scheduling with rewards
- [ ] Push notifications for reminders
- [ ] Statistics and charts
- [ ] Streak tracking
- [ ] Export data feature

## License

MIT

---

Built with ❤️ using Expo and React Native
