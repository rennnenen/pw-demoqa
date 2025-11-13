import {
  MultiselectDropdownOption,
  MultiselectStandardOption,
  OldSelectMenuOption,
  SelectOneOption,
  SelectValueOption,
} from '@utils/constants/SelectMenuConstants';

export interface SelectMenu {
  selectValue: SelectValueOption;
  selectOne: SelectOneOption;
  oldStyleSelect: OldSelectMenuOption;
  multiSelect: MultiselectDropdownOption[];
  stdMultiSelect: MultiselectStandardOption[];
}
