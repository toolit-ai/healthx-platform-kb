# Punch Exceptions and Incidental Overtime Playbook

## Overview

| Attribute | Value |
|-----------|-------|
| **Slug** | `punch_exceptions` |
| **Name** | Punch Exceptions and Incidental Overtime |
| **Category** | `threshold_check` |
| **Status** | ✅ Fully Implemented |
| **ROC Segmentation** | No |
| **Required Tables** | `timekeeping` |
| **Required Columns** | `punch_type`, `exception_type`, `exception_minutes` |
| **Pay Code Patterns** | `PUNCH`, `ROUND` |

## Description

Analysis of early-in, late-in, late-out, and missed punch exception rates by department; violation hours and cost; incidental OT less than 1 hour around schedule edges; duration bucketing (0-15min, 15-30min, 30-60min); role and employee concentration; and threshold configuration review.

## Check Families

- `threshold_check`
- `ratio_check`
- `concentration_analysis`

## Checks

### `early_in_exception_rate`
Early punch-in exceptions occur when an employee clocks in more than the grace period before their scheduled start. Flags when the early-in rate exceeds **12%** of all punches.

**Variables:** `early_in_count`, `total_punches`

**Threshold:** > 12% → warning/medium

**Example Finding:**
> "Early-in exceptions occur on 14.2% of all punches (312 of 2,197), exceeding the 12% threshold."

---

### `late_out_exception_rate`
Late punch-out exceptions occur when an employee clocks out more than the grace period after their scheduled end. Flags when the late-out rate exceeds **10%** of all punches.

**Variables:** `late_out_count`, `total_punches`

**Threshold:** > 10% → warning/medium

**Example Finding:**
> "Late-out exceptions occur on 11.8% of all punches (259 of 2,197), exceeding the 10% threshold."

---

### `missed_punch_rate`
Missed punches occur when an expected in or out punch is absent. Flags when the missed punch rate exceeds **5%** of all expected punches.

**Variables:** `missed_punch_count`, `total_expected_punches`

**Threshold:** > 5% → fail/high

**Example Finding:**
> "Missed punches occur on 6.4% of expected punches (142 of 2,218), exceeding the 5% threshold."

**Discussion Questions:**
- Are missed punches concentrated around shift handoffs or meal breaks?
- Is the timekeeping system accessibility contributing to missed punches?

---

### `exception_rate_by_department`
Exception rate segmented by department. Focus departments are known to exhibit rates between **26% and 52%**. Flags any department above the **25%** system baseline.

**Variables:** `exception_rate_by_department` (dict)

**Threshold Logic:**
- Department rate > 25% → warning/medium
- Department rate > 40% → warning/high

**Example Finding:**
> "Telemetry shows a 48.3% punch exception rate, and ED shows 31.7%, both exceeding the 25% baseline."

**Discussion Questions:**
- Do high-exception departments have unique scheduling or coverage constraints?
- Are time clocks or kiosk locations adequate in these departments?

---

### `incidental_ot_lt_1hr`
Incidental OT less than 1 hour around schedule edges, often caused by minor early-in or late-out punch exceptions. Known pattern: approximately **1.8%** of total OT. Flags when incidental OT exceeds **2.5%** of total OT.

**Variables:** `incidental_ot_hours`, `total_ot_hours`

**Threshold:** > 2.5% → warning/medium

**Example Finding:**
> "Incidental OT accounts for 3.1% of total OT (28.4h of 916.1h), exceeding the 2.5% threshold."

---

### `duration_bucket_analysis`
Punch exceptions grouped by duration buckets. Flags when the **30-60 minute** bucket exceeds **15%** of all exceptions, indicating systemic rather than incidental deviations.

**Variables:** `exceptions_0_15_min`, `exceptions_15_30_min`, `exceptions_30_60_min`, `total_exceptions`

**Threshold Logic:**
- 30-60 min bucket > 15% of exceptions → warning/medium
- 30-60 min bucket > 25% of exceptions → warning/high

**Example Finding:**
> "The 30-60 minute bucket contains 18.4% of exceptions (89 of 483), suggesting systematic schedule misalignment rather than minor punch variance."

---

### `employee_concentration`
Concentration of punch exceptions by employee. Flags when the top **10 employees** account for more than **35%** of all punch exceptions.

**Variables:** `top_10_employee_exception_pct`

**Threshold:** > 35% → warning/medium

**Example Finding:**
> "The top 10 employees account for 38.2% of all punch exceptions (184 of 482), indicating a small cohort drives most exceptions."

## Scenarios

None defined.

## Key Variables

| Variable | Description |
|----------|-------------|
| `early_in_count` | Number of early punch-in exceptions |
| `late_out_count` | Number of late punch-out exceptions |
| `missed_punch_count` | Number of missed punches |
| `total_punches` | Total punch records analyzed |
| `total_expected_punches` | Total expected punch events |
| `exception_rate_by_department` | Exception rate per department |
| `incidental_ot_hours` | OT hours < 1hr around schedule edge |
| `total_ot_hours` | Total OT hours for ratio calculation |
| `exceptions_0_15_min` | Exceptions in 0-15 minute bucket |
| `exceptions_15_30_min` | Exceptions in 15-30 minute bucket |
| `exceptions_30_60_min` | Exceptions in 30-60 minute bucket |
| `total_exceptions` | Total punch exceptions |
| `top_10_employee_exception_pct` | Percentage of exceptions from top 10 employees |

## Thresholds Summary

| Threshold | Value | Severity |
|-----------|-------|----------|
| Early-in exception rate | > 12% | medium |
| Late-out exception rate | > 10% | medium |
| Missed punch rate | > 5% | high |
| Department exception rate | > 25% | medium; > 40% high |
| Incidental OT (< 1hr) | > 2.5% of total OT | medium |
| 30-60 min bucket | > 15% of exceptions | medium; > 25% high |
| Top-10 employee concentration | > 35% | medium |

## Known BSMH Context

- Focus departments show exception rates from **26% to 52%**.
- Incidental OT is approximately **1.8% of total OT**.
- Duration buckets help identify systemic vs. random exceptions.
