import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'edge';
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

        //Send request to FBR API
        const res = await fetch(FBR_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${FBR_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        });

        // FBR  response convert in JSON
        const data = await res.json();

        // Status code (00 = Success)
        const statusCode = data?.validationResponse?.statusCode;

        // Invoice success 
        if (statusCode === '00') {
            return NextResponse.json({
                success: true,
                message: 'Invoice submitted successfully',
                mode: FBR_MODE,
                ...data
            }, { status: 200 });
        }

        // if invoice rejected from FBR
        return NextResponse.json({
            success: false,
            message: 'Invoice validation failed',
            mode: FBR_MODE,
            ...data
        }, { status: 422 });

    } catch (error: any) {
        //  For error
        return NextResponse.json({
            success: false,
            error: error.message,
            mode: FBR_MODE,
            dated: new Date().toISOString().replace('T', ' ').substring(0, 19),
            validationResponse: {
                statusCode: "01",
                status: "Invalid",
                error: "Failed to connect to FBR server",
                invoiceStatuses: null
            }
        }, { status: 502 });
    }
}

export async function GET() {
    // Health check endpoint
    return NextResponse.json({
        service: 'FBR Invoice API',
        mode: FBR_MODE,
        status: 'ready',
        endpoint: FBR_URL
    });
}