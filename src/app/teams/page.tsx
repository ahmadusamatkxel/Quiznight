import { redirect } from "next/navigation";

// Teams merged into the combined hub; keep the old path working.
export default function TeamsRedirect() {
  redirect("/team?tab=all");
}
