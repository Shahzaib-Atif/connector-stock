export interface PageResult<T> {
  items: T[];
  totalItems: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export function normalizeSearchValue(
  value: string | number | null | undefined,
): string {
  return String(value ?? '')
    .trim()
    .toLowerCase();
}

// Case-insensitive substring check, treating null/undefined as empty string
export function containsInsensitive(
  value: string | number | null | undefined,
  search: string | null | undefined,
): boolean {
  const normalizedSearch = normalizeSearchValue(search);
  if (!normalizedSearch) {
    return true;
  }

  return normalizeSearchValue(value).includes(normalizedSearch);
}

export function paginateItems<T>(
  items: T[],
  page: number,
  pageSize: number,
): PageResult<T> {
  const safePageSize = Math.max(1, pageSize);
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / safePageSize));
  const safePage = clamp(page, 1, totalPages);
  const startIndex = (safePage - 1) * safePageSize;

  return {
    items: items.slice(startIndex, startIndex + safePageSize),
    totalItems,
    page: safePage,
    pageSize: safePageSize,
    totalPages,
  };
}

export function compareNullableValues(
  left: string | number | Date | null | undefined,
  right: string | number | Date | null | undefined,
  direction: 'asc' | 'desc',
): number {
  const leftValue = toComparable(left);
  const rightValue = toComparable(right);

  if (leftValue < rightValue) {
    return direction === 'asc' ? -1 : 1;
  }

  if (leftValue > rightValue) {
    return direction === 'asc' ? 1 : -1;
  }

  return 0;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function toComparable(value: string | number | Date | null | undefined) {
  if (value instanceof Date) {
    return value.getTime();
  }

  if (typeof value === 'number') {
    return value;
  }

  if (value == null) {
    return '';
  }

  return String(value).toLowerCase();
}
