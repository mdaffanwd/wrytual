// app/api/logs/[id]/route.ts

import connectToDatabase from '@/lib/db';
import { Entry } from '@/models/Entry';
import { NextResponse } from 'next/server';

export async function GET(_: Request, { params }: { params: { id: string } }) {
    await connectToDatabase();
    const entry = await Entry.findById(params.id).populate('user');
    return NextResponse.json(entry);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    await connectToDatabase();
    const data = await req.json();
    const updated = await Entry.findByIdAndUpdate(params.id, data, { new: true });
    return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
    await connectToDatabase();
    await Entry.findByIdAndDelete(params.id);
    return NextResponse.json({ message: 'Deleted successfully' });
}
