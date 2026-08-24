import { SignUpForm } from "@/components/sign-up-form";
import { AuthBrandHeader } from "@/components/auth-brand-header";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <AuthBrandHeader />
        <SignUpForm />
      </div>
    </div>
  );
}
