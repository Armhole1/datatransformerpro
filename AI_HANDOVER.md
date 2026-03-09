# Data Transformer Pro - AI Handover Document

**Welcome to the next AI Studio Build session!** 
This file is designed to get you up to speed instantly so we can maximize our 1-hour session.

## 🎯 Project Goal
A modular application that extracts structured data from unstructured documents (PDFs, Images) using Gemini 3 Flash, and exports the data to standardized formats (CSV, Excel).

## 🛠 Tech Stack
- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS v4 + Lucide React (Icons)
- **Data Processing:** `papaparse` (CSV), `xlsx` (Excel)
- **AI Integration:** `@google/genai` (Gemini 3 Flash)

## 🏗 Architecture & Modularity
To save tokens and time, the app is highly modular:
1. **Generic AI Engine (`src/lib/gemini.ts`):** Contains `extractDocumentData(base64, mimeType, prompt, schema)`. **Do not rewrite this for new modules.** Just reuse it.
2. **Schemas (`src/lib/schemas.ts`):** Contains the prompts and JSON schemas for Gemini. Add new schemas here.
3. **Modules (`src/components/`):** Each module (e.g., `InvoiceExtractor.tsx`) handles its own UI, file dropzone, and export mapping, but calls the generic AI engine.
4. **Sidebar (`src/App.tsx`):** Where new modules are registered and toggled.

## 🚀 How to Add a New Module (in 3 Steps)
1. **Define Schema:** Add `NEW_MODULE_PROMPT` and `NEW_MODULE_SCHEMA` to `src/lib/schemas.ts`.
2. **Create Component:** Duplicate/adapt `InvoiceExtractor.tsx` into `NewModuleExtractor.tsx`. Update the export mapping logic to match the new schema.
3. **Register:** Import it into `App.tsx` and add a new button in the sidebar.

## 📋 Current Modules
- **Invoice Extractor:** Extracts Invoice #, Date, Vendor, Totals, and Line Items from PDFs.

## 🔜 Roadmap / Next Steps
*(User will specify what to build next in the chat, but common requests might include Receipt Scanning, Bank Statement Parsing, or a Custom Schema Builder).*

---
**AI Instruction:** When the user links this GitHub repo in a new session, read this file first. Acknowledge you understand the architecture, and ask the user what module they want to build next!
