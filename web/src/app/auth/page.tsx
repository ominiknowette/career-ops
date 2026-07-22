import { Suspense } from "react";
import { AutoJobServeAuthPage } from "@/components/autojobserve/auth-page";

export default function AuthPage() {
  return (
    <Suspense>
      <AutoJobServeAuthPage defaultMode="login" />
    </Suspense>
  );
}
