// ============================================
// FILE: app/page.tsx
// ============================================
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Swal from "sweetalert2";
import { scenarioTemplates } from '../lib/scenarios';
import { Send, FileText, Check, X, Key } from 'lucide-react';

const scenarios = [
  { id: "SN001", name: "Sale of Standard Rate Goods to Registered Buyers" },
  { id: "SN002", name: "Sale of Standard Rate Goods to Unregistered Buyers" },
  { id: "SN003", name: "Sale of Steel (Melted and Re-Rolled)" },
  { id: "SN004", name: "Sale of Steel Scrap by Ship Breakers" },
  { id: "SN005", name: "Sales of Reduced Rate Goods (Eighth Schedule)" },
  { id: "SN006", name: "Sale of Exempt Goods (Sixth Schedule)" },
  { id: "SN007", name: "Sale Of Zero-Rated Goods (Fifth Schedule)" },
  { id: "SN008", name: "Sale of 3rd Schedule Goods" },
  { id: "SN009", name: "Purchase From Registered Cotton Ginners" },
  { id: "SN010", name: "Sale Of Telecom Services by Mobile Operators" },
  { id: "SN011", name: "Sale of Steel through Toll Manufacturing" },
  { id: "SN012", name: "Sale Of Petroleum Products" },
  { id: "SN013", name: "Sale Of Electricity to Retailers" },
  { id: "SN014", name: "Sale of Gas to CNG Stations" },
  { id: "SN015", name: "Sale of Mobile Phones" },
  { id: "SN016", name: "Processing / Conversion of Goods" },
  { id: "SN017", name: "Sale of Goods Where FED Is Charged in ST Mode" },
  { id: "SN018", name: "Sale Of Services Where FED Is Charged in ST Mode" },
  { id: "SN019", name: "Sale of Services (as per ICT Ordinance)" },
  { id: "SN020", name: "Sale of Electric Vehicles" },
  { id: "SN021", name: "Sale of Cement /Concrete Block" },
  { id: "SN022", name: "Sale of Potassium Chlorate" },
  { id: "SN023", name: "Sale of CNG" },
  { id: "SN024", name: "Sale Of Goods Listed in SRO 297(1)/2023" },
  { id: "SN025", name: "Drugs Sold at Fixed ST Rate" },
  { id: "SN026", name: "Sale Of Goods at Standard Rate to End Consumers by Retailers" },
  { id: "SN027", name: "Sale Of 3rd Schedule Goods to End Consumers by Retailers" },
  { id: "SN028", name: "Sale of Goods at Reduced Rate to End Consumers by Retailers" },
];

// Default seller information
const DEFAULT_SELLER = {
  sellerNTNCNIC: "4641094",
  sellerBusinessName: "ABC Trading Company",
  sellerProvince: "Punjab",
  sellerAddress: "123 Main Street, Lahore",
  customToken: "", // Empty by default - will use env token
};

export default function Home() {
  const [seller, setSeller] = useState(DEFAULT_SELLER);
  const [useDefaultSeller, setUseDefaultSeller] = useState(true);
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("sellerData");
    if (saved) {
      const parsed = JSON.parse(saved);
      setUseDefaultSeller(parsed.useDefaultSeller ?? true);
      setSeller({ ...DEFAULT_SELLER, ...parsed });
    }
  }, []);

    const saveSeller = (data: any, useDefault = false) => {
    localStorage.setItem(
      'sellerData',
      JSON.stringify({ ...data, useDefaultSeller: useDefault })
    );
  };

   const updateSeller = (key: string, value: string) => {
    if (useDefaultSeller) setUseDefaultSeller(false);
    const updated = { ...seller, [key]: value };
    setSeller(updated);
    saveSeller(updated, false);
  };

  const sendInvoice = async (id: string) => {
    const template = scenarioTemplates[id];
    if (!template) {
      Swal.fire({
        icon: "warning",
        title: "Template Not Found",
        text: `Scenario ${id} is not configured yet.`,
        confirmButtonColor: "#3b82f6"
      });
      return;
    }
    if (!seller.sellerNTNCNIC || !seller.sellerBusinessName) {
      Swal.fire({
        icon: "warning",
        title: "Missing Seller Info",
        text: "Please fill in seller details first.",
        confirmButtonColor: "#3b82f6"
      });
      return;
    }
    const payload = {
      invoiceType: template.invoiceType,
      invoiceDate: template.invoiceDate,
      invoiceRefNo: template.invoiceRefNo,
      buyerNTNCNIC: template.buyerNTNCNIC,
      buyerBusinessName: template.buyerBusinessName,
      buyerProvince: template.buyerProvince,
      buyerAddress: template.buyerAddress,
      buyerRegistrationType: template.buyerRegistrationType,
      scenarioId: id,
      sellerNTNCNIC: seller.sellerNTNCNIC,
      sellerBusinessName: seller.sellerBusinessName,
      sellerProvince: seller.sellerProvince,
      sellerAddress: seller.sellerAddress,
      items: template.items,
      customToken: seller.customToken || undefined, // Only send if provided
    };
    setLoading(id);
    try {
      const res = await fetch("/api/send-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      const isSuccess = data?.validationResponse?.statusCode === "00";
      Swal.fire({
        icon: isSuccess ? "success" : "error",
        title: isSuccess ? "✅ Invoice Approved!" : "❌ Invoice Rejected",
        html: `
          <div style="text-align:left; padding:20px; background:#f8fafc; border-radius:12px; margin:15px 0;">
            <div style="display:flex; align-items:center; gap:12px; margin-bottom:15px;">
              <div style="width:40px; height:40px; border-radius:50%; background:${isSuccess ? '#10b981' : '#ef4444'}; display:flex; align-items:center; justify-content:center; color:white; font-weight:bold;">
                ${isSuccess ? '✓' : '✗'}
              </div>
              <div>
                <p style="margin:0; font-weight:bold; color:#1e293b; font-size:16px;">${id}</p>
                <p style="margin:0; color:#64748b; font-size:14px;">${data?.validationResponse?.status || "Unknown"}</p>
              </div>
            </div>
            ${data?.invoiceNumber ? `<p style="margin:8px 0; color:#1e293b;"><strong>Invoice Number:</strong> <code style="background:#e2e8f0; padding:4px 8px; border-radius:6px; font-size:13px;">${data.invoiceNumber}</code></p>` : ''}
            ${data?.dated ? `<p style="margin:8px 0; color:#64748b;"><strong>Date:</strong> ${data.dated}</p>` : ''}
            ${data?.tokenUsed ? `<p style="margin:8px 0; color:#64748b;"><strong>Token Used:</strong> ${data.tokenUsed}</p>` : ''}
            ${!isSuccess ? `<p style="margin:12px 0; padding:12px; background:#fee2e2; border-left:4px solid #ef4444; border-radius:8px; color:#991b1b;"><strong>Error:</strong> ${data?.validationResponse?.error || "Unknown error"}</p>` : ''}
          </div>
          <details style="margin-top:20px; cursor:pointer;">
            <summary style="padding:12px; background:#e2e8f0; border-radius:8px; font-weight:600; color:#475569;">📋 View Full Response</summary>
            <pre style="text-align:left; max-height:300px; overflow:auto; background:#1e293b; color:#e2e8f0; padding:16px; border-radius:8px; margin-top:12px; font-size:12px;">${JSON.stringify(data, null, 2)}</pre>
          </details>
        `,
        width: 700,
        confirmButtonText: "OK",
        confirmButtonColor: isSuccess ? "#10b981" : "#ef4444"
      });
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Network Error",
        text: "Failed to send invoice. Please check your connection.",
        footer: `<small style="color:#64748b;">${err.message}</small>`,
        confirmButtonColor: "#3b82f6"
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6 md:p-10">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 px-5 py-2 bg-indigo-100 border border-indigo-200 rounded-full mb-6 shadow-md">
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-indigo-700">FBR Sandbox Environment</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-4 tracking-tight">
            Invoice Testing Portal
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Test all 28 FBR scenarios instantly. Configure seller info once, send unlimited test invoices.
          </p>
        </div>
        {/* Seller Info Card */}
        <div className="bg-white border-2 border-gray-200 rounded-2xl shadow-xl p-8 mb-12 max-w-4xl mx-auto transition-all hover:shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Seller Information</h2>
              <p className="text-sm text-gray-600">This will be used for all test invoices</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {Object.entries(seller)
              .filter(([key]) => key !== 'customToken')
              .map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
                  </label>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => updateSeller(key, e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white transition text-gray-900 shadow-sm"
                    placeholder={`Enter ${key.replace(/([A-Z])/g, " $1").toLowerCase()}`}
                  />
                </div>
              ))}
          </div>

          {/* Custom Token Field - Full Width */}
          <div className="mt-6 p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <Key className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-900 mb-1">
                  Custom FBR Token (Optional)
                </label>
                <p className="text-xs text-gray-600 mb-3">
                  Leave empty to use the default environment token. Add your own token here if you want to test with a custom FBR API token.
                </p>
                <input
                  type="password"
                  value={seller.customToken}
                  onChange={(e) => updateSeller('customToken', e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-amber-200 rounded-xl focus:outline-none focus:border-amber-500 transition text-gray-900 shadow-sm font-mono text-sm"
                  placeholder="Enter your custom FBR token (optional)"
                />
                {seller.customToken && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-green-700">
                    <Check className="w-4 h-4" />
                    <span>Custom token will be used for all invoices</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Scenarios Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Scenarios</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {scenarios.map((s) => (
              <div
                key={s.id}
                className="group bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-indigo-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-bold">
                    {s.id}
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${scenarioTemplates[s.id] ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                    {scenarioTemplates[s.id] ?
                      <Check className="w-4 h-4 text-green-600" /> :
                      <X className="w-4 h-4 text-gray-400" />
                    }
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4 line-clamp-2 min-h-[40px]">
                  {s.name}
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => sendInvoice(s.id)}
                    disabled={loading === s.id || !scenarioTemplates[s.id]}
                    className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 shadow-md"
                  >
                    {loading === s.id ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send
                      </>
                    )}
                  </button>
                  <Link href={`/scenario/${s.id}`}>
                    <button className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg text-sm font-semibold transition shadow-md">
                      Details
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Footer Stats */}
        <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto mt-12">
          <div className="text-center p-6 bg-white border-2 border-gray-200 rounded-xl shadow-md transition hover:shadow-lg">
            <div className="text-3xl font-bold text-gray-900">28</div>
            <div className="text-sm text-gray-600 mt-1">Total Scenarios</div>
          </div>
          <div className="text-center p-6 bg-white border-2 border-gray-200 rounded-xl shadow-md transition hover:shadow-lg">
            <div className="text-3xl font-bold text-green-600">
              {Object.keys(scenarioTemplates).length}
            </div>
            <div className="text-sm text-gray-600 mt-1">Configured</div>
          </div>
          <div className="text-center p-6 bg-white border-2 border-gray-200 rounded-xl shadow-md transition hover:shadow-lg">
            <div className="text-3xl font-bold text-indigo-600">100%</div>
            <div className="text-sm text-gray-600 mt-1">Success Rate</div>
          </div>
        </div>
      </div>
    </main>
  );
}