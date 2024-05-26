import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { Database } from "@/database.types";
import { NextResponse } from "next/server";

// GET ALL ACTIVITIES FOR A GIVEN LIST
export async function GET(request: Request, context: any) {
    const supabase = createServerComponentClient<Database>({ cookies })
    const listId = context.params.id

    let { data: activities, error } = await supabase
        .from("activities")
        .select("id, title, description")
        .eq("list_id", listId)
    
    if (error) {
        return NextResponse.json(error, { status: 500 })
    }
    
    return NextResponse.json(activities, { status: 200 })
}

// INSERT NEW ACTIVITY FOR A GIVEN LIST
export async function POST(request: Request, context: any) {
    const body = await request.json()
    const listId = context.params.id

    const supabase = createServerComponentClient<Database>({ cookies })

    let { data: activity, error } = await supabase
        .from("activities")
        .insert([{ 
            title: body.title, 
            description: body.description, 
            price: body.price,
            list_id: listId,
            tags_array: typeof body.tags === 'string' ? body.tags.split(',') : body.tags
        }])
        .select()

    if (error) {
        return NextResponse.json(error, { status: 500 })
    }

    return NextResponse.json(activity, { status: 200 })
}

// DELETE ACTIVITY FOR A GIVEN LIST
export async function DELETE(request: Request, context: any) {
    const rowId = context.params.id

    console.log('deleting...')
    console.log(rowId)

    const supabase = createServerComponentClient<Database>({ cookies })

    let { data: activity, error } = await supabase
        .from("activities")
        .delete()
        .eq("id", rowId)
  
    if (error) {
        return NextResponse.json(error, { status: 500 })
    }
    
    return NextResponse.json({id: rowId}, { status: 200 })
}

// UPDATE ACTIVITY FOR A GIVEN LIST
export async function PUT(request: Request, context: any) {
    const body = await request.json()
    const rowId = context.params.id

    const updateData = (typeof body.completed !== 'undefined') ? { completed: body.completed } : {
        title: body.title, 
        description: body.description, 
        price: body.price,
        // tags_array: [body.tags]
        tags_array: typeof body.tags === 'string' ? body.tags.split(',') : body.tags
    }

    console.log(updateData)

    const supabase = createServerComponentClient<Database>({ cookies })

    let { data: activity, error } = await supabase
        .from("activities")
        .update(updateData)
        .eq("id", rowId)
        .select()
    
    if (error) {
        return NextResponse.json(error, { status: 500 })
    }

    return NextResponse.json(activity, { status: 200 })
    // return NextResponse.json({ status: 200 })
}

