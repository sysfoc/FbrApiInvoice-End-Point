# FBR Invoice Testing Portal + Live API (Pakistan)

**Live Demo & API:**  
https://fbr-api-invoice-end-point.vercel.app/api/send-invoice

A **beautiful, production-ready** web app + backend API to test and submit all **28 FBR Digital Invoice Scenarios** instantly — fully working with real FBR Sandbox.

No setup. No credentials. Just open and test.

---

### Features

- **28 pre-configured FBR scenarios** (SN001 to SN028) – all officially tested
- One-click **Send Invoice** → gets real `statusCode: "00"` from FBR
- Live payload generator with editable buyer details
- Seller info saved in browser (persists forever)
- Modern, responsive UI with dark mode-ready design
- Real-time success/error feedback using SweetAlert2
- **Live API backend** included – use it in your own apps!

---

### Live Tools

| Tool                          | URL                                                                 |
|------------------------------|----------------------------------------------------------------------|
| Testing Portal (Frontend)     | https://fbr-api-invoice-end-point.vercel.app                                |
| Send Invoice API (Backend)    | `POST` https://fbr-api-invoice-end-point.vercel.app/api/send-invoice   |

---

### API Usage (Use in Postman, Apps, ERP, etc.)

```http
POST https://fbr-api-invoice-end-point.vercel.app/api/send-invoice
Content-Type: application/json

{
  "invoiceType": "Sale Invoice",
  "invoiceDate": "2025-12-10",
  "sellerNTNCNIC": "8885801-7",
  "sellerBusinessName": "Test Company Pvt Ltd",
  "sellerProvince": "Sindh",
  "sellerAddress": "Karachi",
  "buyerNTNCNIC": "1234567-8",
  "buyerBusinessName": "Customer ABC",
  "buyerProvince": "Punjab",
  "buyerAddress": "Lahore",
  "invoiceRefNo": "TEST-001",
  "buyerRegistrationType": "Unregistered",
  "items": [
    {
      "hsCode": "6109.1000",
      "productDescription": "T-Shirts",
      "quantity": 50,
      "valueSalesExcludingST": 50000,
      "rate": "18%",
      "salesTaxApplicable": 9000,
      "uoM": "Numbers, pieces, units",
      "saleType": "Goods at standard rate (default)"
    }
  ]
}
