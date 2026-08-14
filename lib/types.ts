export type CodeType = "cpt" | "hcpcs" | "revenue" | "unknown";

export type BillItem = {
  line: number;
  date?: string;
  description: string;
  code?: string;
  codeType: CodeType;
  quantity: number;
  unitPrice?: number;
  amount: number;
  allowed?: number;
  paid?: number;
  patient?: number;
  category?: "facility" | "professional" | "pharmacy" | "lab" | "imaging" | "other";
};

export type FlagType =
  | "duplicate"
  | "arithmetic"
  | "inflated"
  | "upcode"
  | "bundled"
  | "balance-bill"
  | "semantic";

export type Severity = "low" | "medium" | "high";

export type Flag = {
  id: string;
  type: FlagType;
  severity: Severity;
  title: string;
  explanation: string;
  evidence: string[];
  overcharge: number;
  itemLines: number[];
  heuristic?: boolean;
};

export type Bill = {
  id: string;
  fileName: string;
  source: "upload" | "sample";
  type: "EOB" | "hospital" | "dental" | "ambulance" | "unknown";
  providerName?: string;
  patientName?: string;
  memberId?: string;
  serviceDate?: string;
  statementDate?: string;
  totalBilled: number;
  totalAllowed?: number;
  totalPaid?: number;
  patientDue?: number;
  items: BillItem[];
};

export type AnalysisResult = {
  bill: Bill;
  flags: Flag[];
  totalRecoverable: number;
  score: "clean" | "minor" | "major";
  parsedBy: "vision" | "regex" | "sample";
  analyzedBy: "rules" | "rules+semantic";
  generatedAt: string;
};

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type AgentContext = {
  bill: Bill;
  flags: Flag[];
  totalRecoverable: number;
};
