import { Suspense } from "react";
import { AutoJobServeAuthPage } from "@/components/autojobserve/auth-page";

export default function SignupPage() {
  return (
    <Suspense>
      <AutoJobServeAuthPage defaultMode="signup" />
    </Suspense>
  );
}
