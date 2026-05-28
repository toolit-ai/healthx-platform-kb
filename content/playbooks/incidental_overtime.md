# Incidental Overtime Playbook

## Overview

| Attribute | Value |
|-----------|-------|
| **Slug** | `incidental_overtime` |
| **Name** | Incidental Overtime |
| **Category** | `threshold_check` |
| **Status** | ✅ Fully Implemented |
| **ROC Segmentation** | No |
| **Required Tables** | `timekeeping` |
| **Required Columns** | `hours_worked`, `pay_code`, `schedule_data` |
| **Pay Code Patterns** | `OT`, `OVTM` |

## Description

Focused analysis of incidental overtime less than 1 hour around schedule edges. Known BSMH pattern: approximately **1.8%** of total OT. Duration buckets: 0-15 minutes, 15-30 minutes, 30-60 minutes. This playbook is closely related to the [Punch Exceptions](./punch_exceptions.md) playbook and is often analyzed together.

## Check Families

- `threshold_check`
- `ratio_check`
- `concentration_analysis`
- `trend_analysis`

## Checks

### `incidental_ot_ratio`
Incidental OT as a percentage of total overtime hours. Incidental OT is defined as OT less than 1 hour occurring within 15 minutes of a scheduled start or end time. Flags when incidental OT exceeds the expected **1.8%** baseline by a significant margin.

**Variables:** `incidental_ot_hours`, `total_ot_hours`

**Threshold:** > 3.0% → warning/medium

**Example Finding:**
> "Incidental OT represents 2.4% of total OT (14.2h of 591.7h), above the expected 1.8% baseline."

---

### `micro_incident_bucket_0_15min`
Analyzes the 0-15 minute bucket for incidental OT. Micro-incidents in this bucket often indicate rounding-related issues or minor punch timing discrepancies. Flags when this bucket exceeds **40%** of total incidental OT.

**Variables:** `bucket_0_15_min`, `incidental_ot_hours`

**Threshold:** > 40% of incidental OT → warning/medium

**Example Finding:**
> "0-15 minute incidents represent 44.3% of incidental OT (6.3h of 14.2h), suggesting potential rounding configuration issues."

**Discussion Questions:**
- Is the current rounding threshold (e.g., 7.5 minutes) contributing to micro-incidents?
- Would adjusting the grace window reduce this bucket without impacting compliance?

---

### `short_incident_bucket_15_30min`
Analyzes the 15-30 minute bucket for incidental OT. Short incidents in this range typically reflect schedule edge overruns rather than rounding errors. Flags when this bucket exceeds **35%** of total incidental OT.

**Variables:** `bucket_15_30_min`, `incidental_ot_hours`

**Threshold:** > 35% of incidental OT → warning/medium

**Example Finding:**
> "15-30 minute incidents represent 31.0% of incidental OT (4.4h of 14.2h), within normal range for schedule edge overruns."

---

### `near_hour_incident_bucket_30_60min`
Analyzes the 30-60 minute bucket for incidental OT. Near-hour incidents may indicate systemic handoff delays, report-time issues, or insufficient transition coverage. Flags when this bucket exceeds **25%** of total incidental OT.

**Variables:** `bucket_30_60_min`, `incidental_ot_hours`

**Threshold:** > 25% of incidental OT → warning/high

**Example Finding:**
> "30-60 minute incidents represent 18.2% of incidental OT (2.6h of 14.2h), suggesting manageable transition coverage."

**Discussion Questions:**
- Are 30-60 minute incidents concentrated at shift change times (e.g., 7:00 AM, 7:00 PM)?
- Would staggered shift start times reduce near-hour incidental OT?

---

### `incidental_ot_employee_concentration`
Identifies whether incidental OT is concentrated among a small number of employees. High concentration may indicate individual scheduling issues, training gaps, or timekeeping abuse. Flags when the top 10 employees hold more than **50%** of total incidental OT hours.

**Variables:** `top_10_incidental_ot_pct`

**Threshold:** > 50% → warning/medium

**Example Finding:**
> "The top 10 employees hold 58.7% of incidental OT hours, indicating concentrated patterns that warrant individual review."

**Discussion Questions:**
- Do the top employees share a common department, shift, or supervisor?
- Are incidental OT patterns correlated with specific schedule templates or recurring assignments?

---

### `threshold_configuration_review`
Assesses whether current rounding and threshold configurations are appropriate for controlling incidental OT. Flags when the rounding threshold is set above **7.5 minutes** or when the grace window exceeds **10 minutes**.

**Variables:** `rounding_threshold_minutes`, `grace_window_minutes`

**Threshold Logic:**
- Rounding threshold > 7.5 min → warning/medium
- Grace window > 10 min → warning/medium
- Both exceeded → warning/high

**Example Finding:**
> "Rounding threshold is set to 10.0 minutes with a 12.0-minute grace window, both exceeding recommended limits and contributing to incidental OT accumulation."

**Discussion Questions:**
- When were the rounding and grace thresholds last reviewed?
- Do the current thresholds align with the parameters defined in each CBA?

## Scenarios

None defined.

## Key Variables

| Variable | Description |
|----------|-------------|
| `hours_worked` | Hours worked per record |
| `pay_code` | OT pay codes |
| `schedule_data` | Scheduled start/end times |
| `incidental_ot_hours` | OT hours < 1hr around schedule edge |
| `total_ot_hours` | Total OT hours for ratio |
| `bucket_0_15_min` | Incidental OT in 0-15 minute range |
| `bucket_15_30_min` | Incidental OT in 15-30 minute range |
| `bucket_30_60_min` | Incidental OT in 30-60 minute range |
| `top_10_incidental_ot_pct` | Percentage of incidental OT held by top 10 employees |
| `rounding_threshold_minutes` | Configured rounding threshold in minutes |
| `grace_window_minutes` | Configured grace window in minutes |

## Thresholds Summary

| Threshold | Value | Severity |
|-----------|-------|----------|
| Incidental OT % of total OT | > 3.0% | medium |
| 0-15 min bucket % of incidental OT | > 40% | medium |
| 15-30 min bucket % of incidental OT | > 35% | medium |
| 30-60 min bucket % of incidental OT | > 25% | high |
| Top-10 employee concentration | > 50% | medium |
| Rounding threshold | > 7.5 min | medium |
| Grace window | > 10 min | medium |
| Both rounding and grace exceeded | Both | high |

## Known BSMH Context

- Incidental OT is approximately **1.8%** of total OT.
- Duration bucketing helps distinguish systemic rounding issues from random schedule edge cases.
- Focus departments for punch exceptions show **26% to 52%** exception rates.
- Incidental OT is less than **1 hour** and typically occurs around schedule edges.
