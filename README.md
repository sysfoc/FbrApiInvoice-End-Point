# FBR Digital Invoice API (Pakistan)

**Live API URL:**  
https://fbr-api-invoice-end-point.vercel.app/api/send-invoice

A super-fast, production-ready **FBR (Federal Board of Revenue) Digital Invoicing API** built with **Next.js 16 + TypeScript** using the official FBR Sandbox & Production environment.

This API accepts full invoice data from **Postman, frontend apps, or any system** and returns **real-time FBR invoice number** with `statusCode: "00"` (Valid).

---

### Features
- Full dynamic payload from request (you control everything else)
- Clean FBR response — **no wrapper, no extra fields**
- Supports both **Sandbox** and **Production** via `.env`
- Auto-retry & timeout handling

---

### Live Endpoint (Working Right Now)

```http
POST https://fbr-api-invoice-end-point.vercel.app/api/send-invoice
Content-Type: application/json
```
Example Request (Postman)

{
  "invoiceType": "Sale Invoice",
  "invoiceDate": "2025-12-09",
  "sellerBusinessName": "Solutions",
  "sellerProvince": "Earth",
  "sellerNTNCNIC": "1111111",
  "sellerAddress": "Earth",
  "Reason": "Return",
  "buyerNTNCNIC": "1111111",
  "buyerBusinessName": "xyz",
  "buyerProvince": "Earth",
  "buyerAddress": "Earth",
  "invoiceRefNo": "",
  "scenarioId": "SN002",
  "buyerRegistrationType": "Unregistered",
  "items": [
    {
      "hsCode": "8432.3100",
      "productDescription": "Seed-cum-fertilizer",
      "rate": "18%",
      "uoM": "Numbers, pieces, units",
      "quantity": 1,
      "totalValues": 2950,
      "valueSalesExcludingST": 2500,
      "fixedNotifiedValueOrRetailPrice": 2500,
      "salesTaxApplicable": 450,
      "salesTaxWithheldAtSource": 0,
      "extraTax": 0,
      "furtherTax": 0,
      "fedPayable": 0,
      "discount": 0,
      "saleType": "Goods at standard rate (default)",
      "sroItemSerialNo": "",
      "sroScheduleNo": ""
    }
  ]
}
