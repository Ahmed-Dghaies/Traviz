export interface PasswordRequirements {
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasDigit: boolean;
  hasSpecial: boolean;
  isValid: boolean;
}
const doesPasswordFitRequirements = (value: string): PasswordRequirements => {
  const hasUpperCase = /[A-Z]/.test(value);
  const hasLowerCase = /[a-z]/.test(value);
  const hasDigit = /[0-9]/.test(value);
  const hasSpecial = /[^A-Za-z0-9]/.test(value);
  const isValid = [hasUpperCase, hasLowerCase, hasDigit, hasSpecial].filter(Boolean).length >= 3;

  return {
    hasUpperCase,
    hasLowerCase,
    hasDigit,
    hasSpecial,
    isValid,
  };
};

export { doesPasswordFitRequirements };
