import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { Database } from "@/database.types";
import Collection from "./components/collection";
import LoadingOverlay from "./components/loading-overlay";

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

  let loading = true;

  const lists = await getLists().then( val => {
    loading = false;
    return val
  })

  return (
    <div>
      { loading ? <LoadingOverlay /> : <Collection lists={lists} /> }
    </div>
  );
}