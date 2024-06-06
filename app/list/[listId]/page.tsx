import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { Database } from "@/database.types";
import ActivityView from "@/app/components/activity-view";
import Header from "@/app/components/header";
import LoadingOverlay from "@/app/components/loading-overlay";

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

export default async function DataPage( { params } : { params: { listId: string }}) {

  let loading = true;

  const maybeListTitle = await getListTitle(params.listId)
  const listTitle = maybeListTitle.data? maybeListTitle.data.title : 'List'
  const activities = await getActivities(params.listId).then( val => {
    loading = false
    return val
  })

  // const activities : any = []

  return(
    <div>
      
      { loading? <LoadingOverlay /> : 
        <div>
          <Header />
          <ActivityView listId={params.listId} title={listTitle} rows={activities} isOwner={true}/>
        </div>
      }
      

    </div>
  )
}