export const validateCarConfiguration = (selectedOptions) => {
  // No specific validation rules needed for roof types
  // Add any validation rules as needed

  return { isValid: true }
}

export const getValidationMessage = (selectedOptions) => {
  const validation = validateCarConfiguration(selectedOptions)
  return validation.error || ''
}