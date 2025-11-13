export const SELECT_VALUE_OPTIONS = [
  'Group 1, option 1',
  'Group 1, option 2',
  'Group 2, option 1',
  'Group 2, option 2',
  'A root option',
  'Another root option',
] as const;
export type SelectValueOption = (typeof SELECT_VALUE_OPTIONS)[number];

export const SELECT_ONE_OPTIONS = [
  'Dr.',
  'Mr.',
  'Mrs.',
  'Ms.',
  'Prof.',
  'Other',
] as const;
export type SelectOneOption = (typeof SELECT_ONE_OPTIONS)[number];

export const OLD_SELECT_MENU_OPTIONS = [
  'Red',
  'Blue',
  'Green',
  'Yellow',
  'Purple',
  'Black',
  'White',
  'Voilet',
  'Indigo',
  'Magenta',
  'Aqua',
] as const;
export type OldSelectMenuOption = (typeof OLD_SELECT_MENU_OPTIONS)[number];

export const MULTI_DROPDOWN_OPTIONS = [
  'Green',
  'Blue',
  'Black',
  'Red',
] as const;
export type MultiselectDropdownOption = (typeof MULTI_DROPDOWN_OPTIONS)[number];

export const MULTI_STANDARD_OPTIONS = [
  'Volvo',
  'Saab',
  'Opel',
  'Audi',
] as const;
export type MultiselectStandardOption = (typeof MULTI_STANDARD_OPTIONS)[number];
