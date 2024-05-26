import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { Database } from "@/database.types";
import ActivityView from "@/app/components/activity-view";
import Header from "@/app/components/header";

async function getListTitle(listId : any) {
  const supabase = createServerComponentClient<Database>({ cookies })

  let list = await supabase
    .from("lists")
    .select("title")
    .eq("id", listId)
    .single()
    
  return list
}

async function getActivities(listId : any) {
  const supabase = createServerComponentClient<Database>({ cookies })

  let { data: activities, error } = await supabase
    .from("activities")
    .select("id, title, completed, description, price, tags_array")
    .eq("list_id", listId)
    
  return activities
}

export default async function SharedDataPage( { params } : { params: { listId: string }}) {

  const maybeListTitle = await getListTitle(params.listId)
  const listTitle = maybeListTitle.data? maybeListTitle.data.title : 'List'
  const activities = await getActivities(params.listId)

  // const activities : any = []

  return(
    
    // <div className="bg-rose-100">
    <div>
      <Header />
      < ActivityView listId={params.listId} title={listTitle} rows={activities} isOwner={false}/>
    </div>
  )
}