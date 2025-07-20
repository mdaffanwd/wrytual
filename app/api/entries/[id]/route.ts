import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import connectToDatabase from "@/lib/db";
import { Entry } from "@/models/Entry";



export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        await connectToDatabase()
        const entry = await Entry.findOne({
            _id: params.id,
        }).populate("user")
        console.log("Incoming DELETE request for ID:", params.id)


        console.log(entry)
        if (!entry) {
            console.log("Entry not found for ID:", params.id)
            return NextResponse.json({ error: "Entry not found" }, { status: 404 })
        }

        // Auth check: Only allow deleting your own entry
        if (entry.user.email !== session.user.email) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 })
        }

        await entry.deleteOne()
        return NextResponse.json({ message: 'Deleted successfully' })
    } catch (error) {
        console.error('Error deleting entry:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const { title, description, tags } = await req.json()
        await connectToDatabase()

        const entry = await Entry.findOneAndUpdate(
            { _id: params.id, userId: session.user.id },
            {
                title,
                description,
                tags,
            },
            { new: true }
        )

        if (!entry) return NextResponse.json({ error: 'Not found' }, { status: 404 })

        return NextResponse.json(entry)
    } catch (error: any) {
        console.error('PATCH error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', details: error.message },
            { status: 500 }
        );
    }

}