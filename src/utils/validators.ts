/*
  Rgex checks:
  at least 8 characters
  at least 1 upper case letter
  at least 1 symbol
  */
export const passwordValidator: (input: string) => boolean = (
  input: string,
): boolean => {
  const passwordRegex = new RegExp(".{8,}.");
  return passwordRegex.test(input);
};

export const matchedPasswordValidator: (
  password1: string,
  password2: string,
) => boolean = (password1: string, password2: string): boolean => {
  return password1 === password2;
};
