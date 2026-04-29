import { redirect } from "next/navigation";

export default function LegacyMyListingsRedirect() {
  redirect("/dashboard/my-properties");
}
