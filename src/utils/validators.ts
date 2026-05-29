/*
  Regex checks:
  at least 8 characters
  at least 1 upper case letter
  at least 1 symbol
*/
export const testPassword = (input: string): boolean => {
  const passwordRegex = /^(?=.*[A-Z])(?=.*[^\w\s]).{8,}$/;
  return passwordRegex.test(input);
};

export const passwordValidator = testPassword;

export const matchedPasswordValidator: (
  password1: string,
  password2: string,
) => boolean = (password1: string, password2: string): boolean => {
  return password1 === password2;
};
