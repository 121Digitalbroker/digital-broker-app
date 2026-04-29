import { redirect } from "next/navigation";

export default function LegacyListPropertyRedirect() {
  redirect("/dashboard/create");
}
