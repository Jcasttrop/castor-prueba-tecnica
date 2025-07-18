import { supabaseServerClient } from "@/utils/supabase/server";
import LogoutButton from "@/components/LogoutButton";
import LoginButton from "@/components/LoginWithGoogleButton";
import { redirect } from "next/navigation";
import type { UserResponse } from "@supabase/supabase-js";

export default async function Home() {
  const supabase = await supabaseServerClient();
  const { data } = (await supabase.auth.getUser()) as UserResponse;
  const user = data?.user;

  if (user) {
    redirect("/");
  }

  console.log(user)

  return (
    <>
      <h1>Hello {user ? (user as any).id : "Guest"}</h1>

      {user ? <LogoutButton /> : <LoginButton />}
    </>
  );
}