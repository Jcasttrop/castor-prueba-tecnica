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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-100">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md flex flex-col items-center gap-6">
        <div className="w-full text-center">
          <h1 className="text-2xl font-bold mb-2">Welcome to Castor</h1>
          <p className="text-gray-500 mb-6">Sign in to access your dashboard</p>
        </div>
        <LoginButton />
      </div>
    </div>
  );
}