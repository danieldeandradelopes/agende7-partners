export function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

export function formatPhone(value: string): string {
  const digits = onlyDigits(value).slice(0, 11);
  if (digits.length <= 2) return digits;

  const areaCode = digits.slice(0, 2);
  const number = digits.slice(2);

  if (number.length <= 4) return `(${areaCode}) ${number}`;
  if (digits.length <= 10) {
    return `(${areaCode}) ${number.slice(0, 4)}-${number.slice(4, 8)}`;
  }

  return `(${areaCode}) ${number.slice(0, 5)}-${number.slice(5, 9)}`;
}

export function formatBrazilianDocument(value: string): string {
  const digits = onlyDigits(value);

  if (digits.length <= 11) {
    return digits
      .slice(0, 11)
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
  }

  return digits
    .slice(0, 14)
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3/$4")
    .replace(
      /^(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/,
      "$1.$2.$3/$4-$5",
    );
}

export function formatPixKey(value: string, pixKeyType?: string | null): string {
  if (pixKeyType === "cpf" || pixKeyType === "cnpj") {
    return formatBrazilianDocument(value);
  }

  if (pixKeyType === "phone") {
    return formatPhone(value);
  }

  return value;
}

export function normalizePixKey(
  value: string | null | undefined,
  pixKeyType?: string | null,
): string | null {
  if (!value) return null;

  if (pixKeyType === "cpf" || pixKeyType === "cnpj" || pixKeyType === "phone") {
    return onlyDigits(value);
  }

  return value.trim();
}
