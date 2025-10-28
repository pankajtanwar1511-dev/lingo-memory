# Tools Directory

HTML utilities for development and debugging.

## Files

### reset-browser-db.html
**Purpose:** Reset IndexedDB database in browser

**Usage:**
1. Open in browser: `http://localhost:3000/../tools/reset-browser-db.html`
2. Click "Reset Database" button
3. Confirm deletion
4. Reload app

**When to use:**
- After schema changes
- When database is corrupted
- Testing seed data loading
- Clearing all user data

### reset-and-reload.html
**Purpose:** Clear all browser data and reload app

**Usage:**
1. Open in browser: `http://localhost:3000/../tools/reset-and-reload.html`
2. Click "Clear and Reload" button
3. Clears: localStorage, sessionStorage, IndexedDB, cookies
4. Automatically reloads app

**When to use:**
- Complete fresh start needed
- Testing first-run experience
- Debugging cache issues
- Clearing all app state

## Development

These tools are for development only. They should not be accessible in production builds.

## Related

- Database service: `src/services/database.service.ts`
- Seed loader: `src/services/seed-loader.service.ts`
