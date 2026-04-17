const BASE = process.env.NEXT_PUBLIC_API_URL;

if (!BASE) {
  throw new Error('NEXT_PUBLIC_API_URL is not set');
}

type HttpOptions = RequestInit & {
  timeoutMs?: number;
  returnRaw?: boolean;
};

type ErrorWithMessage = {
  message: string;
};

const hasMessage = (value: unknown): value is ErrorWithMessage => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'message' in value &&
    typeof (value as { message: unknown }).message === 'string'
  );
};

const getAdminToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('adminToken');
};

export async function http(
  path: string,
  opts: HttpOptions & { returnRaw: true }
): Promise<Response>;
export async function http<T>(path: string, opts?: HttpOptions): Promise<T>;
export async function http<T>(
  path: string,
  opts: HttpOptions = {}
): Promise<T | Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), opts.timeoutMs ?? 15000);

  try {
    const isFormData =
      typeof FormData !== 'undefined' && opts.body instanceof FormData;

    const headers = new Headers(opts.headers);
    const token = getAdminToken();

    if (!isFormData && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    if (token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const res = await fetch(`${BASE}${path}`, {
      ...opts,
      headers,
      credentials: 'include',
      signal: controller.signal
    });

    if (opts.returnRaw) return res;

    const isJson = res.headers.get('content-type')?.includes('application/json');

    if (!res.ok) {
      const body: unknown = isJson
        ? await res.json().catch(() => ({}))
        : await res.text();

      if (hasMessage(body)) {
        throw new Error(body.message);
      }

      if (typeof body === 'string' && body.trim()) {
        throw new Error(body);
      }

      throw new Error(`HTTP ${res.status}`);
    }

    if (isJson) {
      return await res.json() as T;
    }

    return await res.text() as T;
  } finally {
    clearTimeout(id);
  }
}