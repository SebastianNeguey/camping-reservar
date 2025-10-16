export const validateRut = (rut: string) => {
  return /^[0-9]+-[0-9kK]$/.test(rut);
};
