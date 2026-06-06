import { HeaderWithAuth } from "@/components/marketlab/header";
import { LoginForm } from "@/components/marketlab/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <HeaderWithAuth />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <LoginForm />
      </main>
    </div>
  );
}
