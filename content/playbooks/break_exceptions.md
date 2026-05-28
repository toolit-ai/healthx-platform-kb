# Break Exceptions Playbook

## Overview

| Attribute | Value |
|-----------|-------|
| **Slug** | `break_exceptions` |
| **Name** | Break Exceptions |
| **Category** | `threshold_check` |
| **Status** | ✅ Fully Implemented |
| **ROC Segmentation** | No |
| **Required Tables** | `timekeeping` |
| **Required Columns** | `break_duration`, `break_type`, `exception_flag` |
| **Pay Code Patterns** | `BREAK`, `MEAL`, `REST` |

## Description

Analysis of short and long break exception rates, missed meal attestations, break violation hours, and concentration by facility, department, and employee. Includes policy and CBA meal and rest break variation.

## Check Families

- `threshold_check`
- `ratio_check`
- `concentration_analysis`

## Checks

### `short_break_exception_rate`
Short break exceptions occur when an employee takes less than the minimum required break duration. Flags when the short break exception rate exceeds **8%** of all shifts with break-eligible hours.

**Variables:** `short_break_count`, `total_break_eligible_shifts`

**Threshold:** > 8% → warning/high

**Example Finding:**
> "Short break exceptions occur on 11.3% of break-eligible shifts (142 of 1,256), exceeding the 8% threshold."

---

### `long_break_exception_rate`
Long break exceptions occur when an employee exceeds the maximum allowed break duration. Flags when the long break exception rate exceeds **5%** of all shifts with break-eligible hours.

**Variables:** `long_break_count`, `total_break_eligible_shifts`

**Threshold:** > 5% → warning/medium

**Example Finding:**
> "Long break exceptions occur on 6.8% of break-eligible shifts (85 of 1,256), exceeding the 5% threshold."

---

### `missed_meal_attestations`
Missed meal attestations track employees who worked through a required meal period without documented waiver or attestation. Flags when missed meals without attestation exceed **3%** of all shifts.

**Variables:** `missed_meal_no_attestation_count`, `total_shifts`

**Threshold:** > 3% → fail/high

**Example Finding:**
> "47 shifts (3.4%) have missed meal periods without proper attestation, exceeding the 3% compliance threshold."

**Discussion Questions:**
- Are supervisors approving missed meal attestations in a timely manner?
- Which departments show the highest rate of unattested missed meals?

---

### `break_violation_hours`
Total hours associated with break violations, including short breaks, long breaks, and missed meals. Flags when break violation hours exceed **2%** of total productive hours.

**Variables:** `break_violation_hours`, `productive_hours`

**Threshold:** > 2% → warning/medium

**Example Finding:**
> "Break violation hours total 87.5h, representing 2.3% of productive hours (3,780h), exceeding the 2% threshold."

---

### `pre_post_rounding_change_impact`
Flags when a recent pre/post rounding policy change has materially increased break exception rates. A **10%** increase in exceptions following a rounding change indicates a systemic policy impact.

**Variables:** `rounding_change_date`, `pre_change_exception_rate`, `post_change_exception_rate`

**Threshold Logic:**
- Post-change rate increase > 10% → warning/high
- Post-change rate increase > 5% → warning/medium
- Post-change rate increase ≤ 5% → pass/info

**Example Finding:**
> "Break exception rate increased from 6.2% to 9.1% (46.8% relative increase) following the rounding policy change on March 15."

**Discussion Questions:**
- Was the rounding change communicated clearly to timekeeping staff?
- Should the rounding policy be revised to restore prior break compliance levels?

---

### `department_employee_concentration`
Break exception concentration by department and top employee. Flags when a single department accounts for more than **30%** of all break exceptions, or when the top 10 employees account for more than **40%**.

**Variables:** `break_exceptions_by_department`, `top_10_employee_exception_pct`

**Threshold Logic:**
- Top department > 30% of exceptions → warning/medium
- Top 10 employees > 40% of exceptions → warning/high

**Example Finding:**
> "The ED accounts for 34.2% of all break exceptions (98 of 286), and the top 10 employees account for 43.1% of exceptions."

**Discussion Questions:**
- Does the ED staffing model allow adequate coverage for breaks?
- Are the top 10 employees working consistent high-acuity assignments that delay breaks?

---

### `cba_meal_rest_break_variation`
Compares actual break practices against CBA-specific meal and rest break rules. Flags departments where break exceptions exceed the CBA-allowed variance.

**Variables:** `cba_break_rules`, `exceptions_by_cba`, `department_cba_mapping`

**Threshold Logic:**
- Any CBA with exception rate > 5% above the CBA mean → warning/medium
- Any CBA with exception rate > 10% above the CBA mean → warning/high

**Example Finding:**
> "CBA 'MRMC RN' shows a 12.4% break exception rate, which is 8.2 percentage points above the system mean of 4.2%."

## Scenarios

None defined.

## Key Variables

| Variable | Description |
|----------|-------------|
| `short_break_count` | Number of short break exceptions |
| `long_break_count` | Number of long break exceptions |
| `total_break_eligible_shifts` | Shifts eligible for a break |
| `missed_meal_no_attestation_count` | Missed meals without proper attestation |
| `total_shifts` | Total shifts analyzed |
| `break_violation_hours` | Total hours associated with break violations |
| `productive_hours` | Total productive hours worked |
| `rounding_change_date` | Date of rounding policy change |
| `pre_change_exception_rate` | Exception rate before rounding change |
| `post_change_exception_rate` | Exception rate after rounding change |
| `break_exceptions_by_department` | Break exception counts per department |
| `top_10_employee_exception_pct` | Percentage of exceptions from top 10 employees |
| `cba_break_rules` | Break rule definitions per CBA |
| `exceptions_by_cba` | Exception rates per CBA |
| `department_cba_mapping` | Department to CBA mapping |

## Thresholds Summary

| Threshold | Value | Severity |
|-----------|-------|----------|
| Short break exception rate | > 8% | high |
| Long break exception rate | > 5% | medium |
| Missed meal without attestation | > 3% | high |
| Break violation hours | > 2% of productive | medium |
| Rounding change impact | > 10% increase | high |
| Department concentration | > 30% | medium |
| Top-10 employee concentration | > 40% | high |
| CBA variation above mean | > 10 pp | high |

## Known BSMH Context

- Meal and rest break rules vary across the **11 CBAs**.
- Pre/post rounding changes can materially affect break exception rates.
