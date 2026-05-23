const ISO_DATETIME =
  /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2}))?(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})?)?$/;
const BR_DATE = /^(\d{2})\/(\d{2})\/(\d{4})$/;
const SLASH_DATE = /^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/;

function pad2(n: string | number): string {
  return String(n).padStart(2, '0');
}

/** Converte data/hora da API para exibição pt-BR (dd/MM/yyyy e HH:mm). */
export function formatDateBr(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return trimmed;

  const iso = trimmed.match(ISO_DATETIME);
  if (iso) {
    const [, year, month, day, hour, minute] = iso;
    const date = `${day}/${month}/${year}`;
    if (hour != null && minute != null) {
      return `${date} ${pad2(hour)}:${pad2(minute)}`;
    }
    return date;
  }

  const brOnly = trimmed.match(BR_DATE);
  if (brOnly) {
    return trimmed;
  }

  const slash = trimmed.match(SLASH_DATE);
  if (slash) {
    const [, a, b, year, hour, minute] = slash;
    const first = Number(a);
    const second = Number(b);
    let day: string;
    let month: string;
    if (first > 12) {
      day = pad2(a);
      month = pad2(b);
    } else if (second > 12) {
      month = pad2(a);
      day = pad2(b);
    } else {
      month = pad2(a);
      day = pad2(b);
    }
    const date = `${day}/${month}/${year}`;
    if (hour != null && minute != null) {
      return `${date} ${pad2(hour)}:${pad2(minute)}`;
    }
    return date;
  }

  const parsed = new Date(trimmed);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: parsed.getHours() || parsed.getMinutes() ? '2-digit' : undefined,
      minute: parsed.getMinutes() ? '2-digit' : undefined,
    });
  }

  return trimmed;
}

export function formatDateTimeBr(raw: string): { date: string; time: string } {
  const formatted = formatDateBr(raw);
  const match = formatted.match(/^(\d{2}\/\d{2}\/\d{4})(?:\s+(\d{2}:\d{2}))?$/);
  if (match) {
    return { date: match[1], time: match[2] ?? '' };
  }
  const parts = formatted.split(/\s+/);
  if (parts.length >= 2) {
    return { date: parts[0], time: parts.slice(1).join(' ') };
  }
  return { date: formatted, time: '' };
}

/** Interpreta data da API para comparações (vencimento, etc.). */
export function parseApiDate(raw: string): Date | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const iso = trimmed.match(ISO_DATETIME);
  if (iso) {
    const [, year, month, day, hour = '12', minute = '00'] = iso;
    return new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute));
  }

  const br = trimmed.match(BR_DATE);
  if (br) {
    const [, day, month, year] = br;
    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  const slash = trimmed.match(SLASH_DATE);
  if (slash) {
    const [, a, b, year] = slash;
    const first = Number(a);
    const second = Number(b);
    let day: number;
    let month: number;
    if (first > 12) {
      day = first;
      month = second;
    } else if (second > 12) {
      month = first;
      day = second;
    } else {
      month = first;
      day = second;
    }
    return new Date(Number(year), month - 1, day);
  }

  const parsed = new Date(trimmed);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}
