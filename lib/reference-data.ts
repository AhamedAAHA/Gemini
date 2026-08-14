import type { BillItem } from "./types";

export type ReferenceEntry = {
  code: string;
  description: string;
  allowable: number;
  category: BillItem["category"];
  severity?: number;
};

export const REFERENCE_PRICES: Record<string, ReferenceEntry> = {
  "99211": { code: "99211", description: "Office visit, established patient, minimal (5 min)", allowable: 22, category: "professional", severity: 1 },
  "99212": { code: "99212", description: "Office visit, established patient, level 2", allowable: 45, category: "professional", severity: 2 },
  "99213": { code: "99213", description: "Office visit, established patient, level 3", allowable: 74, category: "professional", severity: 3 },
  "99214": { code: "99214", description: "Office visit, established patient, level 4", allowable: 109, category: "professional", severity: 4 },
  "99215": { code: "99215", description: "Office visit, established patient, level 5", allowable: 148, category: "professional", severity: 5 },
  "99202": { code: "99202", description: "Office visit, new patient, level 2", allowable: 70, category: "professional", severity: 2 },
  "99203": { code: "99203", description: "Office visit, new patient, level 3", allowable: 101, category: "professional", severity: 3 },
  "99204": { code: "99204", description: "Office visit, new patient, level 4", allowable: 155, category: "professional", severity: 4 },
  "99205": { code: "99205", description: "Office visit, new patient, level 5", allowable: 211, category: "professional", severity: 5 },
  "99281": { code: "99281", description: "Emergency department visit, level 1", allowable: 54, category: "facility", severity: 1 },
  "99282": { code: "99282", description: "Emergency department visit, level 2", allowable: 92, category: "facility", severity: 2 },
  "99283": { code: "99283", description: "Emergency department visit, level 3", allowable: 146, category: "facility", severity: 3 },
  "99284": { code: "99284", description: "Emergency department visit, level 4", allowable: 259, category: "facility", severity: 4 },
  "99285": { code: "99285", description: "Emergency department visit, level 5", allowable: 462, category: "facility", severity: 5 },
  "99221": { code: "99221", description: "Inpatient visit, level 1", allowable: 100, category: "facility", severity: 1 },
  "99222": { code: "99222", description: "Inpatient visit, level 2", allowable: 145, category: "facility", severity: 2 },
  "99223": { code: "99223", description: "Inpatient visit, level 3", allowable: 195, category: "facility", severity: 3 },
  "99238": { code: "99238", description: "Hospital discharge day management", allowable: 92, category: "facility", severity: 1 },
  "99244": { code: "99244", description: "Office/outpatient consultation, level 4", allowable: 175, category: "professional", severity: 4 },
  "93000": { code: "93000", description: "Electrocardiogram (ECG/EKG) complete", allowable: 29, category: "other" },
  "93005": { code: "93005", description: "ECG tracing only", allowable: 18, category: "other" },
  "71046": { code: "71046", description: "Chest x-ray, 2 views", allowable: 39, category: "imaging" },
  "73630": { code: "73630", description: "Ankle x-ray, 3 views", allowable: 55, category: "imaging" },
  "73130": { code: "73130", description: "Hand x-ray, 3 views", allowable: 55, category: "imaging" },
  "72040": { code: "72040", description: "Cervical spine x-ray, 3 views", allowable: 57, category: "imaging" },
  "70450": { code: "70450", description: "CT head without contrast", allowable: 225, category: "imaging" },
  "74177": { code: "74177", description: "CT abdomen/pelvis with contrast", allowable: 340, category: "imaging" },
  "73718": { code: "73718", description: "MRI lower extremity without contrast", allowable: 480, category: "imaging" },
  "73721": { code: "73721", description: "MRI knee joint without contrast", allowable: 497, category: "imaging" },
  "72148": { code: "72148", description: "MRI lumbar spine without contrast", allowable: 510, category: "imaging" },
  "93306": { code: "93306", description: "Echocardiogram complete, transthoracic", allowable: 228, category: "imaging" },
};
