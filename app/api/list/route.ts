import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { Database } from "@/database.types";
import { NextResponse } from "next/server";


// GET ALL LISTS FOR A USER
export async function GET(request: Request, context: any) {
    const supabase = createServerComponentClient<Database>({ cookies })
    
    const { data: { user } } = await supabase.auth.getUser()

    let { data: lists, error } = await supabase
        .from("lists")
        .select("id, title, description")
        .eq("user_id", user?.id)
    
    if (error) {
        return NextResponse.json(error, { status: 500 })
    }
    
    return NextResponse.json(lists, { status: 200 })
}

// INSERT NEW LIST FOR A USER
export async function POST(request: Request, context: any) {
    const body = await request.json()

    const supabase = createServerComponentClient<Database>({ cookies })
    const { data: { user } } = await supabase.auth.getUser()

    let { data: list, error } = await supabase
        .from("lists")
        .insert([
        { title: body.title, description: body.description, user_id: user?.id}
        ])
        .select()
  
    if (error) {
        return NextResponse.json(error, { status: 500 })
    }
    
    return NextResponse.json(list, { status: 200 })
}

// DELETE LIST FOR A USER
export async function DELETE(request: Request, context: any) {
    const listId = await request.json()

    console.log('deleting...')
    console.log(listId)

    const supabase = createServerComponentClient<Database>({ cookies })

    let { data: lists, error } = await supabase
        .from("lists")
        .delete()
        .eq("id", listId)
  
    if (error) {
        return NextResponse.json(error, { status: 500 })
    }
    
    return NextResponse.json({id: listId}, { status: 200 })
}

