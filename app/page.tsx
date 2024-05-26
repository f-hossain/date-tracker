import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { Database } from "@/database.types";
import Collection from "./components/collection";

async function getLists() {
  const supabase = createServerComponentClient<Database>({ cookies })
  const { data: { user } } = await supabase.auth.getUser()

  let { data: lists, error } = await supabase
    .from("lists")
    .select("id, title, description")
    .eq("user_id", user?.id)

  return lists
}

export default async function Home() {

  const lists = await getLists()
  // const lists : any = []

  return (
    <Collection lists={lists} />
  );
}