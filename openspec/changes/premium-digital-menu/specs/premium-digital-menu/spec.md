# Premium Digital Menu Specification

## Purpose

Define a mobile-first, bilingual, independent Tauras menu app that sells the premium dining experience, supports a lightweight local cart, and hands off order intent through WhatsApp.

## Requirements

### Requirement: Independent runtime isolation

The system MUST run independently from Reservas Tauras and MUST NOT require the Reservas production runtime, port, containers, or deploy path.

#### Scenario: Preview starts separately
- GIVEN Reservas is running on port `3330`
- WHEN the menu preview is started
- THEN it uses a different port, target `3331`
- AND Reservas remains unaffected

### Requirement: Per-location menu discovery

The system MUST let guests choose or open a specific sede menu and MUST show only menu content, availability, and WhatsApp destination for that sede.

#### Scenario: Guest opens a sede menu
- GIVEN a guest opens the menu for a valid sede
- WHEN the menu loads
- THEN categories, items, featured content, and WhatsApp contact match that sede

### Requirement: Always-visible bilingual switching

The system MUST provide an always-visible English/Spanish switch and SHOULD fall back gracefully when a translation is missing.

#### Scenario: Guest switches language
- GIVEN the menu is visible in English or Spanish
- WHEN the guest changes language
- THEN visible labels, item text, cart text, and WhatsApp summary use the selected language

### Requirement: Premium featured presentation

The system MUST highlight premium meats, cocktails, and recommended items with appetizing, eye-catching presentation without overwhelming the page.

#### Scenario: Featured sections appear
- GIVEN featured items exist for the selected sede
- WHEN the guest opens the menu
- THEN premium meats, cocktails, and recommendations are emphasized before or near the main listing

### Requirement: Mobile responsiveness and overflow safety

The system MUST be fully responsive on Android and iPhone viewport widths and MUST NOT create horizontal overflow, clipped controls, or broken sticky/cart layout.

#### Scenario: Small mobile viewport
- GIVEN a guest uses a narrow mobile viewport
- WHEN the menu, category navigation, language switch, item cards, and cart are displayed
- THEN all content remains readable and usable without horizontal scrolling

### Requirement: Item card readability

The system MUST present each menu item with clear name, description, price, availability, and relevant badges/options in a readable hierarchy.

#### Scenario: Guest scans item details
- GIVEN an available item has bilingual text, price, and badges
- WHEN the item card is shown
- THEN the guest can identify what it is, why it is appealing, and how much it costs

### Requirement: Lightweight local cart

The system MUST allow guests to add, remove, and adjust quantities locally without payments, accounts, or kitchen order submission.

#### Scenario: Guest edits cart
- GIVEN a guest adds available items to the cart
- WHEN quantities are changed or an item is removed
- THEN totals and selected items update locally and remain scoped to the selected sede

### Requirement: WhatsApp handoff

The system MUST compose a readable WhatsApp message for the selected sede with item names, quantities, notes when present, and estimated total when prices are available.

#### Scenario: Guest sends cart to WhatsApp
- GIVEN the cart contains one or more items
- WHEN the guest chooses WhatsApp handoff
- THEN WhatsApp opens for the selected sede with a human-readable order summary

### Requirement: Performance and image loading

The system SHOULD keep the initial mobile menu fast and MUST avoid layout shifts caused by menu imagery.

#### Scenario: Image-heavy menu loads
- GIVEN the menu contains featured and item images
- WHEN the page loads on mobile
- THEN key content is usable promptly and images load with stable dimensions

### Requirement: Unavailable and empty states

The system MUST clearly communicate unavailable items, empty categories, closed/unavailable sede states, and cart actions that cannot proceed.

#### Scenario: Unavailable item cannot be ordered
- GIVEN an item is marked unavailable
- WHEN the guest views or interacts with it
- THEN the item is visibly unavailable and cannot be added to the cart
