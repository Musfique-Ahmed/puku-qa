# Puku QA

QA artifacts for `https://web.dev.puku.sh/`.

## Layout

```
Puku Editor QA/
├── README.md                              ← this file
├── scenarios/
│   └── sanity-scenarios.csv               ← source scenarios (S001–S016)
├── test-cases/                            ← test-case-writer output
│   ├── README.md                          ← index + status summary
│   └── TC-001-… .md … TC-016-… .md
└── runs/
    ├── REPORT.md                          ← flow-runner aggregate report
    └── TC-001/ … TC-016/                  ← per-TC artifacts (result.md + scripts)
```

## Flow

1. **`scenario-mapper`** turns briefs into `scenarios/sanity-scenarios.csv` (S001–S016).
2. **`test-case-writer`** turns each scenario into a structured `test-cases/TC-NNN-…md`.
3. **`flow-runner`** runs each TC against the live target and writes a `runs/TC-NNN/result.md`.
4. **`e2e-codegen`** (optional, post-run) promotes green TCs into permanent Playwright tests.

## Run report

- [`runs/REPORT.md`](runs/REPORT.md) — aggregate of the 2026-10-19 run
- 14 / 16 PASS, 1 FAIL (TC-016, homepage ↔ changelog mismatch), 0 skipped
- TC-004 ran end-to-end with mail.tm (disposable inbox). See [TC-004 follow-up notes](runs/TC-004/result.md).

## Disposable inbox for TC-004

TC-004 needs a real mailbox to receive the magic-link email. We use
**[mail.tm](https://docs.mail.tm)**, a free public REST-API disposable inbox.

- API base: `https://api.mail.tm`
- Active public domain (2026-10-19): `maxxspace.com`
- Auth: `POST /accounts` → `POST /token` → `Bearer <token>` for subsequent calls
- Quirk: `/domains` and `/messages` return plain JSON lists, not Hydra
  collections; `msg["html"]` is a list of HTML strings, not a single string
- Orchestrator: `runs/TC-004/run-magic-link.py`

The runner does not need any persistent credentials — accounts are created and
deleted (DELETE /accounts/{id} → 204) within each run.