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
        if (error.message === 'FORM_REQUIRES_SIGNIN') {
            return NextResponse.json({
                error: 'This form requires Google sign-in and cannot be loaded. In the form, go to Settings → Responses and turn off "Restrict to users in [domain]" / "Collect email addresses", then share with "Anyone with the link".'
            }, { status: 403 });
        }
        return NextResponse.json({ error: 'Failed to parse form. Ensure it is a valid public Google Form.' }, { status: 500 });
    }
}
