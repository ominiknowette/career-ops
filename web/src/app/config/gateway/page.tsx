import { redirect } from "next/navigation";

export default function GatewayPage() {
  redirect("/dashboard#api-keys");
}
