export function loc(obj: Record<string, unknown>, field: string, locale: string): string {
  const key = locale === 'en' ? `${field}En` : `${field}Es`;
  return (obj[key] as string) ?? (obj[`${field}Es`] as string) ?? '';
}
