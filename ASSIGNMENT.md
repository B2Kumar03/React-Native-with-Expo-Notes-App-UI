# MindFlow — Mobile Notes & Productivity App

**Assignment / project report**  
**Stack:** Expo (React Native) · TypeScript · Expo Router · Async Storage  

This document describes **MindFlow**, a cross-platform note-taking app with categories, tags, starring, search, and light/dark themes. Screenshots below are hosted from the project image repository.

---

## Screenshots

### 1. Note editor (categories, tags, rich context)

![MindFlow — note editor with category, tags, and quote preview](https://github.com/B2Kumar03/project_Image/blob/main/dsfghuijkopl%5B;'.jpeg?raw=true)

### 2. Notes home — dark theme

![MindFlow — main notes list with search and toggles (dark)](https://github.com/B2Kumar03/project_Image/blob/main/WhatsApp%20Image%202026-05-12%20at%2011.04.12%20PM.jpeg?raw=true)

### 3. Starred notes

![MindFlow — starred notes screen](https://github.com/B2Kumar03/project_Image/blob/main/aszdxfctgyhuijokpl%5B.jpeg?raw=true)

### 4. Tags management

![MindFlow — tags screen with add and list](https://github.com/B2Kumar03/project_Image/blob/main/dfcgvbhjnkml.jpeg?raw=true)

### 5. Notes home — light theme

![MindFlow — main notes list (light / cream theme)](https://github.com/B2Kumar03/project_Image/blob/main/hjhjhj.jpeg?raw=true)

---

## 1. Introduction

MindFlow is a **universal mobile application** built with **Expo** and **React Native**, aimed at capturing ideas quickly and organizing them with **categories**, **custom tags**, and **starred** favorites. The interface supports **dark and light** appearances, optional **system theme** following, and a **bottom tab bar** for Notes, Starred, Tags, and Settings.

Data is persisted on-device (for example via **Async Storage**), so notes remain available between sessions without requiring a separate backend for the core assignment scope.

---

## 2. Objectives

| Objective | Description |
|-----------|-------------|
| Cross-platform UI | One codebase targeting Android and iOS (and optional web via Expo). |
| Information architecture | Notes with metadata: category, tags, dates, starred state. |
| Discoverability | Search and tag-based filtering. |
| Personalization | Theme controls (system / manual dark / light). |
| Polished UX | Card-based layout, haptic-friendly tabs, clear navigation. |

---

## 3. Features Implemented

- **Notes listing** with search, preview text, date, category pill, and left accent color per note.
- **Note detail / editor** with title and body, category chips, tag chips, add-tag flow, and actions (e.g. star, save).
- **Starred** tab showing only favorited notes with count summary.
- **Tags** tab: create tags, see note counts per tag, tap to filter, long-press to delete (as indicated in UI).
- **Settings** (on main flow): toggles such as **Follow system theme**, **Dark mode (manual)**, **Focus featured note**.
- **Floating action button** to create new notes.
- **Theming** with orange accent, muted surfaces, and category-driven color accents (work, health, personal, ideas, etc.).

---

## 4. Technology Stack

| Layer | Technology |
|-------|--------------|
| Runtime / toolchain | **Expo SDK ~54**, **TypeScript** |
| UI framework | **React Native 0.81**, **React 19** |
| Navigation | **Expo Router** (file-based routes), **React Navigation** tabs |
| Storage | **@react-native-async-storage/async-storage** |
| Icons / polish | **@expo/vector-icons**, **expo-haptics**, **expo-system-ui** |
| Linting | **ESLint** (`eslint-config-expo`) |

---

## 5. Project Structure (high level)

- `app/` — Expo Router screens: tabs (`index`, `starred`, `tags`, `settings`), dynamic `note/[id]`.
- `components/mindflow/` — Feature UI: listing, editor, cards, settings, tags, starred.
- `context/mindflow-context.tsx` — Global state: notes, tags, theme, persistence hooks.
- `lib/` — Types, storage, seed data, formatting, navigation helpers.
- `constants/mindflow-theme.ts` — Design tokens for light/dark surfaces and accents.

---

## 6. Installation and Run

Prerequisites: **Node.js** (LTS recommended), **npm**, and for devices either **Expo Go** or a dev client / emulator.

```bash
cd my-app
npm install
npx expo start
```

From the Expo CLI output you can open the app in:

- [Development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go)

To reset the starter template layout (optional, from upstream Expo template):

```bash
npm run reset-project
```

---

## 7. Screen-by-Screen Summary (aligned with screenshots)

1. **Editor** — Breadcrumb-style context, category row, tag row with “Add tag”, main content area with formatted quote blocks, bottom formatting hints and word count, header actions (back, star, delete, share, save).
2. **Notes (dark)** — Branded header, search field, inline settings toggles, stacked **NoteCard** list with stars and category tags, FAB for new note, tab bar with **Notes** active.
3. **Starred** — Title and “saved” count, condensed list of starred cards only, **Starred** tab active.
4. **Tags** — Subtitle, “New tag name” field with **Add**, list rows with note counts and affordances (tap / long-press), **Tags** tab active.
5. **Notes (light)** — Same information hierarchy as dark home with cream background and adjusted contrast; demonstrates theme switching.

---

## 8. Future Enhancements (optional)

- Cloud sync and multi-device conflict resolution  
- Rich text or Markdown rendering with full toolbar actions  
- Export (PDF / Markdown) and share extensions  
- Widgets and quick-capture from OS shortcuts  

---

## 9. Conclusion

MindFlow delivers a **cohesive, offline-first note experience** on React Native with clear navigation, tagging, and theming. The screenshots above document the implemented UI across **editor**, **home**, **starred**, **tags**, and **light theme** variants, matching the behavior described in this report.

---


