# Overtime Playbook

## Overview

| Attribute | Value |
|-----------|-------|
| **Slug** | `overtime` |
| **Name** | Overtime |
| **Category** | `threshold_check` |
| **Status** | ✅ Fully Implemented |
| **ROC Segmentation** | Yes |
| **Required Tables** | `timekeeping`, `payroll` |
| **Required Columns** | `hours_worked`, `overtime_hours`, `pay_code` |
| **Pay Code Patterns** | `OT`, `OVTM`, `DBL`, `DOT` |

## Description

Analysis of overtime hours, thresholds, concentration, and compliance with CBAs and FLSA. Covers daily and weekly OT thresholds, double-time triggers, mandatory OT caps, rest between shifts, scheduled vs unscheduled OT, and employee/role concentration.

## Check Families

- `threshold_check`
- `segment_variance`
- `concentration_analysis`
- `ratio_check`
- `sequence_check`

## Checks

### `ot_pct_of_productive_hours`
OT as a percentage of productive hours. Flags when overtime exceeds **15%** of productive hours.

**Variables:** `productive_hours`, `overtime_hours`

**Threshold:** > 15% → warning/high

**Example Finding:**
> "Overtime represents 18.5% of productive hours, exceeding the 15% flag threshold."

---

### `daily_ot_threshold_by_cba`
Daily OT threshold violations by CBA. 4 of 11 CBAs have daily OT; 7 do not. Flags violations where daily hours exceed the CBA-specific threshold.

**Variables:** `daily_ot_violations` (list of dicts with `hours`, `threshold`, `cba_name`)

**Example Finding:**
> "Found 12 daily OT threshold violations across CBA(s): MRMC RN, Allen RN."

---

### `double_time_triggers`
Double-time as a percentage of total OT hours. Flags when double-time exceeds **5%** of total OT.

**Variables:** `double_time_hours`, `total_ot_hours`

**Threshold:** > 5% → warning/medium

**Example Finding:**
> "Double-time hours represent 7.2% of total OT hours (42.0 of 583.3), exceeding the 5% flag threshold."

---

### `vto_vtu_treatment_check`
Flags when VTO/VTU hours appear in the OT base calculation. This is a known issue at St. Vincent that inflates OT exposure.

**Variables:** `vto_in_ot_base` (boolean)

**Status Mapping:**
- `True` → fail/high
- `False` → pass/info

**Discussion Questions:**
- Which pay periods are affected by this VTO/VTU inclusion?
- What is the estimated dollar impact of the inflated OT base?

---

### `ot_base_definition_check`
Flags when the OT base definition excludes fringe benefits. MRMC Security is a known case. Exclusion of fringe from the regular rate may constitute an FLSA compliance violation.

**Variables:** `base_excludes_fringe` (boolean), `cba_name`

**Status Mapping:**
- `True` → warning/high
- `False` → pass/info

**Discussion Questions:**
- Is this exclusion explicitly permitted by a DOL opinion or CBA clause?
- What is the financial exposure if fringe must be included retroactively?

---

### `mandatory_ot_caps`
Employees exceeding mandatory OT cap hours.

**Variables:** `mandatory_ot_hours_by_employee` (dict), `cap_hours`

**Threshold Logic:**
- Any employee exceeding `cap_hours` is flagged
- If > 5% of employees exceed → fail
- If > 10% of employees exceed → severity high

**Example Finding:**
> "23 of 450 employees (5.1%) exceed the mandatory OT cap of 16 hours."

---

### `rest_between_shifts`
Insufficient rest between shifts. Flags when any shift transitions have less than the minimum rest hours.

**Variables:** `short_rest_instances`, `total_shift_transitions`, `min_rest_hours` (default 8.0)

**Status Mapping:**
- Any short rest → fail/high

**Example Finding:**
> "8 of 1,240 shift transitions (0.6%) have less than 8 hours rest between shifts."

**Note:** Only 1 of 11 CBAs requires minimum rest between shifts.

---

### `employee_concentration`
Top-10 employee OT concentration. Flags when the top 10 employees hold more than **50%** of total OT hours.

**Variables:** `top_10_ot_pct`

**Threshold:** > 50% → warning/medium

**Example Finding:**
> "The top 10 employees hold 62.3% of total OT hours, exceeding the 50% concentration flag threshold."

---

### `scheduled_vs_unscheduled_ot`
Ratio of scheduled to unscheduled OT.

**Variables:** `scheduled_ot_hours`, `unscheduled_ot_hours`

**Threshold:** Unscheduled OT > 50% of total → warning/medium

**Example Finding:**
> "58.4% of OT is unscheduled (340.2h of 582.5h). High unscheduled OT suggests reactive staffing patterns."

## Scenarios

None defined.

## Key Variables

| Variable | Description |
|----------|-------------|
| `productive_hours` | Total productive hours worked |
| `overtime_hours` | Total overtime hours |
| `daily_ot_violations` | List of CBA daily OT violations |
| `double_time_hours` | Total double-time hours |
| `total_ot_hours` | Total OT hours (including double-time) |
| `vto_in_ot_base` | Boolean: VTO/VTU incorrectly included in OT base |
| `base_excludes_fringe` | Boolean: OT base excludes fringe benefits |
| `mandatory_ot_hours_by_employee` | Dict mapping employee → mandatory OT hours |
| `cap_hours` | Configurable mandatory OT cap |
| `short_rest_instances` | Count of shift transitions with insufficient rest |
| `total_shift_transitions` | Total number of shift transitions analyzed |
| `min_rest_hours` | Minimum required rest between shifts (default 8h) |
| `top_10_ot_pct` | Percentage of total OT held by top 10 employees |
| `scheduled_ot_hours` | Scheduled OT hours |
| `unscheduled_ot_hours` | Unscheduled OT hours |

## Thresholds Summary

| Threshold | Value | Severity |
|-----------|-------|----------|
| OT % of productive | > 15% | high |
| Double-time % of total OT | > 5% | medium |
| Mandatory OT cap exceedance | > cap_hours | high (if >10%) / medium |
| Rest between shifts | < min_rest_hours (8h) | high |
| Top-10 employee concentration | > 50% | medium |
| Unscheduled OT % | > 50% | medium |

## Known BSMH Context

- **St. Vincent known issue:** VTO/VTU/MTO/MTU counted as worked hours toward OT threshold.
- **MRMC Security:** OT base excludes fringe — FLSA compliance flag.
- **CBA daily OT variation:** MRMC and Allen RN have >8, >10, >12 hr thresholds.
- **4 of 11 CBAs** have daily OT; **7 do not**.
- **Only 1 of 11 CBAs** requires minimum rest between shifts.
