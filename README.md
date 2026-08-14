# BillScope

**Upload a medical bill. Find the money you don't owe.**

BillScope is a taste for adversarial medical-billing tech: it reads your hospital
bill / Explanation of Benefits line by line, flags the errors and inflated charges
with evidence, shows you what's recoverable — and drafts the dispute letter for you.

Built for the **H0: Hack the Zero Stack (Vercel v0 + AWS Databases)** hackathon.

---

## The problem (quantified)

- ~1 in 10 hospital bills contains a billing error; average overcharge ≈ **$2,000+**
- Patients literally cannot decipher line items (`CPT 99284`, `REV 270`, `ADJ 35`)
- The system is designed to make you not read the bill — that's the moat

## What it does

1. **Upload** a bill — a photo, PDF, pasted EOB, or one of 3 sample bills
2. **Audit** — a deterministic rules engine flags:
   - duplicate line items
   - arithmetic errors (line sums ≠ total, qty × unit ≠ total)
   - inflated prices (billed vs CMS fair-market reference, 2×+ threshold)
   - upcoding (description/severity vs billed code)
   - bundling violations (e.g. venipuncture billed separately from the visit)
   - non-covered / balance-billed charges ($0 allowed, $0 paid)
3. **See the money** — plain-English findings with evidence + a realistic
   *recoverable* estimate (no double counting, capped at the bill)
4. **Dispute** — a mail-ready appeal letter, a phone call script, and the deadline
5. **Fin** — an AI concierge (Amazon Bedrock Converse, Nova→Claude cost-aware
   routing with tool calls) that explains the bill and drafts the dispute

## Architecture

```
flowchart LR
  UI["Next.js 16 · Vercel (v0)"] -->|analyze/agent| API["Next API Routes"]
  API -->|parse + rules| RULES["Rules engine (deterministic)"]
  API -->|vision parse (optional)| BR["Amazon Bedrock vision"]
  API -->|persist| DDB[("Amazon DynamoDB")]
  API -->|semantic pass (optional)| CL["Claude"]
  API -->|chat + tools| AGENT["Bedrock Converse · Nova→Claude"]
```

- **Frontend:** Next.js 16 / React 19 / Tailwind v4 on Vercel. Degrades gracefully
  to bundled sample data if the API is unreachable.
- **Data plane:** DynamoDB (on-demand, PITR). Tables: `users`, `bills`,
  `billItems`, `reference`, `flags`, `letters`, `audits`, `config` — defined in
  `terraform/dynamodb.tf`.
- **Compute:** the API ships as Next.js API routes (Vercel) or a containerized
  App Runner service (see `Dockerfile`, `terraform/compute.tf`) behind CloudFront.
- **AI layer:** Amazon Bedrock Converse — cheap **Nova** by default, escalates to
  **Claude** for agentic turns (appeal letters, code lookups) via tool use.
  Optional semantic audit pass (`lib/semantic.ts`).
- **Cost guardrails:** CloudWatch alarm on Bedrock spend → SNS → breaker Lambda
  flips a DynamoDB feature flag and the app fails open to the free rules engine
  (`terraform/guardrails.tf`).

## Getting started

```bash
npm install
cp .env.example .env.local   # optional AWS keys enable Bedrock/DynamoDB
npm run dev                  # http://localhost:3000
```

Open `http://localhost:3000/analyze`, pick a sample bill, and watch the audit.

Without AWS credentials everything runs locally: the regex parser, the rules
engine, the local Fin replies, and in-memory persistence.

### With AWS (production mode)

```bash
# 1. Deploy infrastructure
cd terraform && terraform apply

# 2. Seed the reference price table
BILLSCOPE_REFERENCE_TABLE=billscope_reference npx tsx scripts/seed-reference.mjs

# 3. Set env (see .env.example): BILLSCOPE_ANALYSES_TABLE, AWS_ACCESS_KEY_ID, ...
#    Then photo/PDF uploads route through Bedrock vision and Fin uses Converse.
```

## Testing the engine (CLI)

```bash
npx tsx -e "
import { parseBillText } from './lib/parser';
import { runRulesEngine, computeRecoverable } from './lib/rules-engine';
import { getSample } from './lib/samples';
const s = getSample('sample-mri');
const bill = parseBillText(s.text, s.name);
const flags = runRulesEngine(bill);
console.log(flags.map(f => f.title + ' -> \$' + f.overcharge));
console.log('recoverable:', computeRecoverable(bill, flags));
"
```

## Honesty note (for judges)

- Demo bills are public sample data with planted errors; **no PHI is stored**.
- Reference prices are a curated CMS Medicare-fee-schedule subset (~45 codes);
  production uses the full fee schedule / commercial benchmarks (FAIR Health).
- The app is a coordination layer, not legal/financial advice: it identifies
  disputed amounts and generates correspondence; it does not pay or negotiate on
  your behalf, and a human should verify before sending.
- Fin and the semantic audit pass call Bedrock only when AWS credentials are set.

## The 60-second demo script

1. **Hook (10s):** "My grandmother paid a $3,900 hospital bill that should have
   been $1,100. 1 in 10 bills has an error. Let's check one."
2. **Upload (10s):** click a sample bill → audit animation → structured bill card.
3. **Money shot (20s):** "6 issues. **$5,818 recoverable** on a $6,512 bill — you
   shouldn't pay 89% of this." Expand a duplicate and an inflated charge; point
   at the evidence.
4. **Negotiate (15s):** "Dispute it" → appeal letter + call script + deadline.
5. **Fin (15s):** "why is this so high?" → answers citing the actual line items.
6. **Close (10s):** architecture slide (DynamoDB access patterns, Nova→Claude
   routing, cost breaker) + honesty note.

## Project layout

```
app/            pages + API routes
  api/analyze   POST — parse → rules → (semantic) → persist
  api/agent     POST — Fin (Bedrock Converse or local)
  api/samples   GET  — sample bill metadata
  components/   Uploader, SavingsSummary, BillCard, FlagCard, LetterGenerator, AgentChat, Analyzer
lib/
  types.ts      domain model
  parser.ts     regex EOB parser (vision path when AWS configured)
  rules-engine.ts  the deterministic audit + recoverable math
  reference-data.ts CMS fair-market prices + bundling rules
  letters.ts    appeal letter / call script / deadline / checklist
  analyze.ts    orchestration (async + sync)
  agent.ts      Fin — Bedrock or local fallback
  bedrock.ts    Converse + tool use (Nova→Claude routing)
  semantic.ts   optional Claude semantic audit pass
  dynamodb.ts   persistence (DynamoDB or in-memory fallback)
  samples.ts    3 demo bills with planted errors
terraform/      DynamoDB, S3, App Runner + CloudFront, cost circuit-breaker
```

## Built with

vercel · next.js 16 · react 19 · tailwindcss v4 · typescript · amazon-dynamodb ·
aws-app-runner · amazon-cloudfront · amazon-s3 · amazon-bedrock · amazon-nova ·
anthropic-claude · terraform
