import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const hasEnvVars =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** 간단한 이메일 형식 검증(폼 버튼 활성화 판단용 — 서버측 검증을 대체하지 않음) */
export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}
