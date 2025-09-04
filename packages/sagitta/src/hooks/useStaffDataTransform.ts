import type { Staff } from '@bmb-inc/types';
import type { ComboboxData } from '@mantine/core';

export function useStaffDataTransform() {
  const transformStaffToOptions = (staffArray: Staff[] | undefined): ComboboxData => {
    return Array.isArray(staffArray) 
      ? staffArray.map((staff) => ({
          value: staff.STAFFCODE || '',
          label: `${staff.STAFFNAME || 'Unknown'} - ${staff.STAFFCODE || 'No Code'}`,
        }))
      : [];
  };

  const combineStaffOptions = (searchResults: ComboboxData, selectedStaff: Staff | undefined): ComboboxData => {
    if (!selectedStaff) return searchResults;
    
    const selectedOption = {
      value: selectedStaff.STAFFCODE || '',
      label: `${selectedStaff.STAFFNAME || 'Unknown'} - ${selectedStaff.STAFFCODE || 'No Code'}`
    };
    
    // Check if selected staff is already in search results
    const isIncluded = searchResults.some(opt => 
      typeof opt === 'object' && 'value' in opt && opt.value === selectedOption.value
    );
    
    return isIncluded ? searchResults : [selectedOption, ...searchResults];
  };

  return { transformStaffToOptions, combineStaffOptions };
}
