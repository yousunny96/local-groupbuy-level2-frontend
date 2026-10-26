export const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export class ApiError extends Error {
  errors: Record<string, string>;
  constructor(message: string, errors: Record<string, string> = {}) {
    super(message);
    this.errors = errors;
  }
}

export async function api<T>(path: string, init?: { method?: string; body?: unknown }): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API}${path}`, {
      method: init?.method ?? "GET",
      headers: init?.body ? { "content-type": "application/json" } : undefined,
      body: init?.body ? JSON.stringify(init.body) : undefined,
      cache: "no-store",
    });
  } catch {
    throw new ApiError("서버에 연결할 수 없어요. 잠시 뒤에 다시 시도해 주세요.");
  }
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new ApiError(data?.message ?? "문제가 생겼어요. 잠시 뒤에 다시 시도해 주세요.", data?.errors ?? {});
  }
  return data as T;
}

export interface GroupBuy {
  id: number;
  title: string;
  category: string;
  origin: string;
  pricePerBox: number;
  totalBoxes: number;
  maxPerPerson: number;
  deadline: string;
  orderedBoxes: number;
  remainingBoxes: number;
  applicants: number;
  status: "진행중" | "마감";
  soldOut: boolean;
}

export interface Order {
  id: number;
  orderCode: string;
  groupBuyId: number;
  groupBuyTitle: string;
  name: string;
  phone: string;
  boxes: number;
  status: "신청" | "취소";
  createdAt: string;
  cancelledAt: string | null;
}

export interface Stats {
  openGroupBuys: number;
  orderedBoxes: number;
  applicants: number;
}
