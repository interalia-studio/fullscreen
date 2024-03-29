# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.0]

### Added

- Tauri configuration for building Fullscreen as a native app [#28](https://github.com/interalia-studio/fullscreen/pull/28)
- Custom toolbar with Fullscreen tools [#56](https://github.com/interalia-studio/fullscreen/pull/56)
- Use stitches for CSS-in-JS [#56](https://github.com/interalia-studio/fullscreen/pull/56)
- Self-hosted Urbanist web font [#59](https://github.com/interalia-studio/fullscreen/pull/59)
- More tools for the new toolbar [#61](https://github.com/interalia-studio/fullscreen/pull/61)
- Onboarding dialogue when joining a board on the web [#66](https://github.com/interalia-studio/fullscreen/pull/66)
- Create a new board when navigating to board/ [#68](https://github.com/interalia-studio/fullscreen/pull/68)
- Board-not-found dialogue [#69](https://github.com/interalia-studio/fullscreen/pull/69)
- Menu bar for web app [#71](https://github.com/interalia-studio/fullscreen/pull/71)
- Offline mode using IndexedDB [#72](https://github.com/interalia-studio/fullscreen/pull/72)
- Native app icon [#86](https://github.com/interalia-studio/fullscreen/pull/86)
- Add menu items [#84](https://github.com/interalia-studio/fullscreen/pull/84)
- License Fullscreen under AGPLv3 [#93](https://github.com/interalia-studio/fullscreen/pull/93)
- Show dialogue when opening board in the native app [#94](https://github.com/interalia-studio/fullscreen/pull/94)


### Changed

- Removed experimental Windows and Linux builds [#65](https://github.com/interalia-studio/fullscreen/pull/65)
- Refactor integration of Y.js and TLDraw to separate concerns [#67](https://github.com/interalia-studio/fullscreen/pull/67)

### Fixed

- Fixed release action running on every push to `main` branch [#56](https://github.com/interalia-studio/fullscreen/pull/56)
- Fixed redirect to correct document URL in file load [#32](https://github.com/interalia-studio/fullscreen/pull/32)
- Refuse loading document without a board id [#37](https://github.com/interalia-studio/fullscreen/pull/37)
- Throttle presence updates [#35](https://github.com/interalia-studio/fullscreen/pull/35)
- Fix CI cache [#60](https://github.com/interalia-studio/fullscreen/pull/60)
- Fixed landing page rendering [#59](https://github.com/interalia-studio/fullscreen/pull/59)
- Always broadcast presence when board creator [#74](https://github.com/interalia-studio/fullscreen/pull/74)
- Fix URL schema for sharing link [no PR](https://github.com/interalia-studio/fullscreen/commit/f1789adfa733ff6ab3cd8820f8b8fa191c14de87)

### Bits and bobs

- Added a changelog [#33](https://github.com/interalia-studio/fullscreen/pull/33)
- Typescript config [#64](https://github.com/interalia-studio/fullscreen/pull/64)
- Refactored Y.js adapter hook [#73](https://github.com/interalia-studio/fullscreen/pull/73)
- Added new landing page [#63](https://github.com/interalia-studio/fullscreen/pull/63)

## [0.1.0]

### Added

- Add sync and presence using Y.js [#25](https://github.com/interalia-studio/fullscreen/pull/25)
- Configure Tauri to build Fullscreen as a native app [#28](https://github.com/interalia-studio/fullscreen/pull/28)

[unreleased]: https://github.com/interalia-studio/fullscreen/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/interalia-studio/fullscreen/releases/tag/v0.2.0
[0.1.0]: https://github.com/interalia-studio/fullscreen/releases/tag/v0.1.0