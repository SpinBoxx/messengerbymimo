import getSession from "@/actions/get-session";
import AuthForm from "@/components/auth-form";
import MimoLogo from "@/components/mimo-logo";
import { Separator } from "@/components/ui/separator";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getSession();
  if (session) redirect("/conversations");

  return (
    <div className="flex min-h-full flex-col justify-center bg-gray-100 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md ">
        <div className="sm:flex sm:items-center sm:justify-center sm:gap-4 sm:pb-5">
          <MimoLogo className="h-20 w-20 fill-black" />
          <span className="text-xl font-bold tracking-tight">Messenger</span>
        </div>
        <Separator />
        <h2 className="mt-6 text-center text-3xl font-semibold tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>
      <AuthForm />
    </div>
  );
}
