import { HeaderWithAuth } from "@/components/marketlab/header";
import { SignUpForm } from "@/components/marketlab/signup-form";

export default function SignUpPage() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <HeaderWithAuth />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <SignUpForm />
      </main>
    </div>
  );
}
