import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import connectToDatabase from "@/lib/db";
import { User } from "@/models/User";
import { Entry } from "@/models/Entry";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.email) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    try {
        await connectToDatabase();
        const body = await req.json()
        const { title, description, tags } = body

        const user = await User.findOne({ email: session.user.email })

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 })
        }
        const newEntry = await Entry.create({
            title,
            description,
            tags,
            user: user._id,
        })

        return NextResponse.json(newEntry, { status: 201 })

    } catch (error) {
        console.error('[ENTRY_POST_ERROR]', error)
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }

}

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session || !session?.user?.id) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        await connectToDatabase()
        const entries = await Entry.find({ user: session.user.id }).sort({ createdAt: -1 })

        return NextResponse.json(entries)
    } catch (error) {
        console.error('[GET_POSTS_ERROR]', error)
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }
}