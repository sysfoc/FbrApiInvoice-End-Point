import { NextRequest } from 'next/server';

const FBR_MODE = process.env.FBR_MODE || 'sandbox';

const FBR_URL = FBR_MODE === 'production'
    ? process.env.FBR_PRODUCTION_URL!
    : process.env.FBR_SANDBOX_URL!;

const FBR_TOKEN = FBR_MODE === 'production'
    ? process.env.FBR_PRODUCTION_TOKEN!
    : process.env.FBR_SANDBOX_TOKEN!;

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const payload = {
            ...body,
        };

        const res = await fetch(FBR_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${FBR_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });
        const data = await res.json();

        return new Response(JSON.stringify(data, null, 2), {
            status: res.status,
            headers: {
                'Content-Type': 'application/json',
            },
        });

    } catch (error: any) {
        const errorResponse = {
            dated: new Date().toISOString().replace('T', ' ').substring(0, 19),
            validationResponse: {
                statusCode: "01",
                status: "Invalid",
                errorCode: "502",
                error: "Failed to connect to FBR server. Please try again.",
                invoiceStatuses: null
            }
        };

        return new Response(JSON.stringify(errorResponse, null, 2), {
            status: 502,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}