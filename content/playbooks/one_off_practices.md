# One-Off Pay Practices Playbook

## Overview

| Attribute | Value |
|-----------|-------|
| **Slug** | `one_off_practices` |
| **Name** | One-Off Pay Practices |
| **Category** | `one_off_detection` |
| **Status** | ✅ Fully Implemented |
| **ROC Segmentation** | No |
| **Required Tables** | `payroll` |
| **Required Columns** | `pay_code`, `market` |
| **Pay Code Patterns** | — |

## Description

Detection of low-volume, local-only, undocumented, or CBA-backed pay practices. Flags pay codes used in fewer than 3 markets, low-volume local practices, undocumented local codes, and known unused pay codes from the engagement baseline (107 known unused pay codes).

## Check Families

- `valid_value_compliance`
- `one_off_detection`
- `concentration_analysis`

## Checks

### `pay_codes_in_fewer_than_3_markets`
Identifies pay codes with limited market spread. Flags any pay code used in fewer than **3 markets**, indicating a local-only practice that may lack central oversight.

**Variables:** `pay_code`, `market_count`, `markets_used`

**Threshold:** Used in fewer than 3 markets → warning/medium

**Example Finding:**
> "Pay code LOC-BON-01 is used in only 1 market (St. Vincent) with 47.5 hours across 3 employees, indicating a local-only practice."

**Discussion Questions:**
- Are the local-only pay codes documented in a facility-specific policy or addendum?
- Do these codes duplicate functionality available through standard system pay codes?

---

### `low_volume_local_practices`
Detects low-volume practices that may be local exceptions or coding artifacts. Flags pay codes with fewer than **100 total hours** or fewer than **5 employees** in a rolling 12-month period.

**Variables:** `pay_code`, `hours`, `employee_count`, `pay_period_count`

**Threshold Logic:**
- Hours < 100 in 12 months → warning/low
- Employee count < 5 in 12 months → warning/low
- Both conditions met → warning/medium

**Example Finding:**
> "Pay code MISC-PD-12 recorded only 32.0 hours across 2 employees in the past 12 months, meeting both low-volume criteria."

**Discussion Questions:**
- Are low-volume codes still needed, or can they be retired to simplify the pay code taxonomy?
- Do low-volume codes correlate with specific departments or managers?

---

### `undocumented_local_codes`
Flags pay codes not referenced in any extracted policy rule or CBA document. Undocumented codes carry elevated compliance risk because their business purpose cannot be verified.

**Variables:** `pay_code`, `extracted_rules`, `policy_references`, `cba_references`

**Status Mapping:**
- No policy or CBA reference found → warning/high
- Referenced in policy or CBA → pass/info

**Example Finding:**
> "Pay code ADJ-OV-03 has 215.0 hours across 8 employees but is not referenced in any extracted policy rule or CBA clause."

**Discussion Questions:**
- Is the code a legacy artifact from a prior system conversion or acquisition?
- What is the financial exposure if undocumented codes are challenged in a wage and hour audit?

---

### `cba_backed_local_practices`
Identifies local practices that are explicitly backed by CBA provisions. CBA-backed practices should be preserved and clearly mapped to avoid false positives in one-off detection.

**Variables:** `pay_code`, `cba_references`, `cba_name`, `hours`

**Status Mapping:**
- CBA-backed and properly mapped → pass/info
- Claimed CBA-backed but no reference found → warning/high
- Not CBA-backed → info (no action)

**Example Finding:**
> "Pay code CBA-FLT-07 (189.5h) is backed by MRMC RN CBA Article 14, Section 3 and is properly mapped in the rule catalog."

**Discussion Questions:**
- Are all CBA-backed local codes reflected in the central rule extraction output?
- Which CBAs contain the highest number of local-only pay code provisions?

---

### `benefit_and_leave_code_exclusions`
Ensures non-wage pay codes — including benefit accruals, leave payouts, and PTO conversions — are excluded from one-off pay practice analysis. Flags when excluded code types appear in the active analysis set.

**Variables:** `excluded_pay_codes_in_analysis`, `excluded_code_types`, `total_excluded_hours`

**Threshold:** Any excluded code type present in analysis → warning/medium

**Example Finding:**
> "3 benefit accrual codes (PTO-CONV, SICK-ACCR, BEREAV-LV) totaling 1,240.0 hours were found in the one-off analysis set and should be excluded."

**Discussion Questions:**
- Is the exclusion list comprehensive across all 11 CBAs and central policy?
- Are new benefit or leave codes being introduced that need to be added to the exclusion list?

---

### `known_unused_pay_codes`
Checks active payroll data against the engagement baseline of **107 known unused pay codes**. Any hours recorded against these codes indicate either a data error or a newly activated practice that requires documentation.

**Variables:** `pay_code`, `unused_pay_code_baseline`, `hours`, `employee_count`

**Status Mapping:**
- Any hours on known unused code → fail/high
- No hours on known unused codes → pass/info

**Example Finding:**
> "Known unused pay code RETRO-99 recorded 18.0 hours across 1 employee, indicating either a coding error or an undocumented reactivation."

**Discussion Questions:**
- Were the 18 hours a one-time correction or the start of a recurring pattern?
- Should the unused pay code baseline be updated to remove codes that are now legitimately in use?

## Scenarios

None defined.

## Key Variables

| Variable | Description |
|----------|-------------|
| `pay_code` | Pay code being analyzed |
| `market` | Market where pay code is used |
| `market_count` | Number of markets where pay code appears |
| `markets_used` | List of markets using the pay code |
| `hours` | Total hours for the pay code |
| `employee_count` | Count of employees using the pay code |
| `pay_period_count` | Number of pay periods with activity |
| `extracted_rules` | Rules extracted from policy documents |
| `policy_references` | Central policy document references |
| `cba_references` | CBA clauses referencing the pay code |
| `cba_name` | Name of applicable CBA |
| `excluded_pay_codes_in_analysis` | Pay codes that should be excluded but appear in analysis |
| `excluded_code_types` | Categories of codes to exclude (benefit, leave, accrual) |
| `total_excluded_hours` | Sum of hours for excluded code types found in analysis |
| `unused_pay_code_baseline` | List of 107 known unused pay codes |

## Thresholds Summary

| Threshold | Value | Severity |
|-----------|-------|----------|
| Market spread minimum | < 3 markets | medium |
| Low-volume hours | < 100 hours in 12 months | low |
| Low-volume employees | < 5 employees in 12 months | low |
| Both low-volume conditions | Both met | medium |
| Undocumented local codes | No policy or CBA reference | high |
| CBA-backed but unverified | Claimed but no reference found | high |
| Excluded codes in analysis | Any present | medium |
| Known unused pay codes | Any hours recorded | high |

## Known BSMH Context

- **107 known unused pay codes** exist as an engagement baseline.
- One-off practices may be legitimate local variations or coding errors.
- CBA-backed local practices should be preserved; undocumented ones require investigation.
