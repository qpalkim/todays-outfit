import { updateSession } from "@/lib/supabase/proxy";
import { type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - icon, apple-icon, opengraph-image (next/og로 생성되는 확장자 없는 공개 메타데이터 라우트 — 비로그인 크롤러·브라우저 탭도 접근해야 함)
     * - robots.txt (검색엔진 크롤러가 로그인 없이 접근해야 하는 공개 라우트)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|icon$|apple-icon$|opengraph-image$|robots.txt$|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
