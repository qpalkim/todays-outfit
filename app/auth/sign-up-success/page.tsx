import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AuthBrandHeader } from "@/components/auth-brand-header";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <AuthBrandHeader />
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-point">
                가입해주셔서 감사해요!
              </CardTitle>
              <CardDescription>이메일을 확인해주세요</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                회원가입이 완료됐어요. 로그인하기 전에 받은 편지함에서 이메일을
                확인하고 계정을 인증해주세요.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
