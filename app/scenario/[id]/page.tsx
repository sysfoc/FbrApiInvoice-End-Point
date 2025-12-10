// ============================================
// FILE 2: app/scenario/[id]/page.tsx
// ============================================
'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { scenarioTemplates } from '../../../lib/scenarios';
import { Copy, CheckCircle, ArrowLeft, User, FileText, X } from 'lucide-react';

export default function ScenarioPage() {
    const { id } = useParams();
    const router = useRouter();
    const template = scenarioTemplates[id as string] || {};
    const [seller, setSeller] = useState({
        sellerNTNCNIC: "",
        sellerBusinessName: "",
        sellerProvince: "",
        sellerAddress: ""
    });
    const [buyer, setBuyer] = useState({
        buyerNTNCNIC: "",
        buyerBusinessName: "",
        buyerProvince: "",
        buyerAddress: ""
    });
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("sellerData");
        if (saved) setSeller(JSON.parse(saved));
    }, []);

    useEffect(() => {
        setBuyer({
            buyerNTNCNIC: template.buyerNTNCNIC || "",
            buyerBusinessName: template.buyerBusinessName || "",
            buyerProvince: template.buyerProvince || "",
            buyerAddress: template.buyerAddress || ""
        });
    }, [id, template]);

    const payload = {
        invoiceType: template.invoiceType,
        invoiceDate: template.invoiceDate,
        invoiceRefNo: template.invoiceRefNo,
        buyerNTNCNIC: buyer.buyerNTNCNIC,
        buyerBusinessName: buyer.buyerBusinessName,
        buyerProvince: buyer.buyerProvince,
        buyerAddress: buyer.buyerAddress,
        buyerRegistrationType: template.buyerRegistrationType,
        scenarioId: id,
        sellerNTNCNIC: seller.sellerNTNCNIC,
        sellerBusinessName: seller.sellerBusinessName,
        sellerProvince: seller.sellerProvince,
        sellerAddress: seller.sellerAddress,
        items: template.items
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!template.invoiceType) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-8">
                <div className="text-center bg-white border-2 border-gray-200 rounded-2xl p-12 max-w-md shadow-xl">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <X className="w-10 h-10 text-red-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">Scenario Not Found</h1>
                    <p className="text-gray-600 mb-8">{id} is not configured yet</p>
                    <button
                        onClick={() => router.push('/')}
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition flex items-center gap-2 mx-auto shadow-md"
                    >
                        <ArrowLeft size={20} />
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6 md:p-10">
            <div className="max-w-[1400px] mx-auto">
                {/* Header */}
                <button
                    onClick={() => router.push('/')}
                    className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-200 hover:border-indigo-500 rounded-xl mb-8 transition font-semibold text-gray-900 shadow-md"
                >
                    <ArrowLeft size={20} />
                    Back to Home
                </button>
                <div className="mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-100 border border-indigo-200 rounded-full mb-4 shadow-sm">
                        <span className="text-sm font-bold text-indigo-700">{id}</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-3 tracking-tight">
                        Live Payload Generator
                    </h1>
                    <p className="text-lg text-gray-600">
                        Configure buyer details and generate payload for testing
                    </p>
                </div>
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Buyer Form */}
                    <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-xl transition hover:shadow-2xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                <User className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Buyer Information</h2>
                                <p className="text-sm text-gray-600">Customize buyer details for this test</p>
                            </div>
                        </div>
                        {Object.entries(buyer).map(([key, value]) => (
                            <div key={key} className="mb-5">
                                <label className="block mb-2 text-sm font-semibold text-gray-700">
                                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}
                                </label>
                                <input
                                    type="text"
                                    value={value}
                                    onChange={e => setBuyer({ ...buyer, [key]: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:bg-white transition text-gray-900 shadow-sm"
                                />
                            </div>
                        ))}
                    </div>
                    {/* Payload Output */}
                    <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-xl transition hover:shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                    <FileText className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">Final Payload</h2>
                                    <p className="text-sm text-gray-600">Ready to send to FBR API</p>
                                </div>
                            </div>
                            <button
                                onClick={copyToClipboard}
                                className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl transition font-semibold shadow-md"
                            >
                                {copied ? (
                                    <>
                                        <CheckCircle size={18} />
                                        Copied!
                                    </>
                                ) : (
                                    <>
                                        <Copy size={18} />
                                        Copy
                                    </>
                                )}
                            </button>
                        </div>
                        <pre className="text-xs bg-gray-900 text-gray-100 p-6 rounded-xl border-2 border-gray-200 overflow-x-auto max-h-[600px] font-mono shadow-inner">
                            {JSON.stringify(payload, null, 2)}
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    );
}