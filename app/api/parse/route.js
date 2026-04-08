import { NextResponse } from 'next/server';
import { parseGoogleForm } from '@/lib/googleFormParser';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
        return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    try {
        const formData = await parseGoogleForm(url);
        return NextResponse.json(formData);
    } catch (error) {
        console.error('Parser error:', error);
        return NextResponse.json({ error: 'Failed to parse form. Ensure it is a valid public Google Form.' }, { status: 500 });
    }
}
