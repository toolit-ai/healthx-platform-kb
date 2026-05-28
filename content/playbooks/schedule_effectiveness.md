# Schedule Effectiveness Playbook

## Overview

| Attribute | Value |
|-----------|-------|
| **Slug** | `schedule_effectiveness` |
| **Name** | Schedule Effectiveness |
| **Category** | `ratio_check` |
| **Status** | ✅ Fully Implemented |
| **ROC Segmentation** | Yes |
| **Required Tables** | `timekeeping`, `staffing` |
| **Required Columns** | `schedule_data`, `hours_worked` |
| **Pay Code Patterns** | — |

## Description

Analysis of schedule effectiveness, optimization opportunities, and alignment between scheduled and actual hours. Evaluates how well staffing schedules match actual worked hours, measures unscheduled PTO and VTO/VTU utilization, and identifies opportunities for schedule optimization across departments.

## Check Families

- `ratio_check`
- `segment_variance`
- `trend_analysis`
- `threshold_check`

## Checks

### `schedule_adherence_rate`
Measures the percentage of scheduled hours that match actual worked hours within an acceptable variance band. Low adherence indicates poor schedule accuracy or high unplanned variance. Flags when adherence falls below **90%**.

**Variables:** `scheduled_hours`, `actual_hours`, `variance_threshold_hours` (default 0.5)

**Threshold:** < 90% → warning/medium

**Example Finding:**
> "Schedule adherence is 87.3% (3,245.0 of 3,717.5 scheduled hours within 0.5h variance), indicating significant schedule-to-actual misalignment."

**Discussion Questions:**
- Which departments or shifts show the lowest adherence rates?
- Are adherence issues driven by understaffing, overstaffing, or unscheduled absences?

---

### `unscheduled_pto_rate`
Unscheduled PTO hours as a percentage of total scheduled hours. High unscheduled PTO disrupts staffing plans and drives premium labor costs (overtime, agency, float). Flags when unscheduled PTO exceeds **8%** of scheduled hours.

**Variables:** `unscheduled_pto_hours`, `scheduled_hours`

**Threshold:** > 8% → warning/high

**Example Finding:**
> "Unscheduled PTO represents 9.4% of scheduled hours (349.5h of 3,717.5h), exceeding the 8% threshold and creating staffing gaps."

**Discussion Questions:**
- Is unscheduled PTO concentrated in specific departments (e.g., ED, Med Surg) or seasons?
- What is the correlation between unscheduled PTO and subsequent overtime or agency usage?

---

### `vto_vtu_utilization`
VTO/VTU hours as a percentage of total scheduled hours. Very low utilization may indicate overstaffing or missed cost-saving opportunities; very high utilization may indicate chronic understaffing or schedule instability. Flags when utilization is below **5%** or above **20%**.

**Variables:** `vto_vtu_hours`, `scheduled_hours`

**Threshold Logic:**
- < 5% → warning/medium (potential overstaffing)
- > 20% → warning/high (schedule instability or chronic understaffing)
- 5-20% → pass/info

**Example Finding:**
> "VTO/VTU utilization is 22.7% (844.5h of 3,717.5h), exceeding the 20% upper threshold and indicating significant schedule volatility."

**Discussion Questions:**
- Is high VTO/VTU utilization driven by census fluctuations or poor schedule forecasting?
- Are VTO/VTU patterns consistent across ROC and non-ROC facilities?

---

### `schedule_premium_cost_ratio`
Premium labor costs (overtime, agency, callback, shift differential) attributable to schedule variance as a percentage of total labor budget. Flags when premium costs from schedule misalignment exceed **10%** of the labor budget.

**Variables:** `premium_cost_from_variance`, `total_labor_budget`

**Threshold:** > 10% → warning/high

**Example Finding:**
> "Premium labor costs attributable to schedule variance total $42,800, representing 11.5% of the labor budget and indicating poor schedule optimization."

**Discussion Questions:**
- Which premium cost categories (OT, agency, callback) contribute most to the variance-driven total?
- Would improved schedule forecasting reduce premium costs below the 10% threshold?

---

### `fill_rate_by_department`
Measures the percentage of scheduled shifts that are filled by regular staff (not agency, float, or callback) by department. Low fill rates indicate staffing shortages or retention challenges. Flags when any department falls below **90%** fill rate.

**Variables:** `filled_shifts_by_dept` (dict), `scheduled_shifts_by_dept` (dict)

**Threshold Logic:**
- Any department < 85% → fail/high
- Any department < 90% → warning/medium
- All departments ≥ 90% → pass/info

**Example Finding:**
> "ICU fill rate is 83.2% (142 of 171 scheduled shifts filled by regular staff), falling below the 85% critical threshold and indicating severe staffing shortage."

**Discussion Questions:**
- Are low fill rates in ED and ICU correlated with high agency usage in those departments?
- What is the trend in fill rates over the past 6 months by department?

## Scenarios

None defined.

## Key Variables

| Variable | Description |
|----------|-------------|
| `schedule_data` | Scheduled start/end times and hours |
| `hours_worked` | Actual hours worked |
| `scheduled_hours` | Total scheduled hours |
| `actual_hours` | Total actual hours worked |
| `variance_threshold_hours` | Acceptable schedule variance in hours (default 0.5) |
| `unscheduled_pto_hours` | Total unscheduled PTO hours |
| `vto_vtu_hours` | Total VTO/VTU hours |
| `premium_cost_from_variance` | Premium labor cost driven by schedule variance |
| `total_labor_budget` | Total labor budget for the period |
| `filled_shifts_by_dept` | Dict mapping department → filled shift count |
| `scheduled_shifts_by_dept` | Dict mapping department → scheduled shift count |

## Thresholds Summary

| Threshold | Value | Severity |
|-----------|-------|----------|
| Schedule adherence | < 90% | medium |
| Unscheduled PTO % of scheduled | > 8% | high |
| VTO/VTU utilization | < 5% | medium |
| VTO/VTU utilization | > 20% | high |
| Premium cost from variance | > 10% of labor budget | high |
| Fill rate by department | < 85% | high |
| Fill rate by department | < 90% | medium |

## Known BSMH Context

- Schedule effectiveness is a cross-cutting analysis that informs multiple other playbooks (Overtime, Premium Labor, Float Staffing).
- Poor schedule alignment is often a root cause of high premium labor costs.
- **ROC segmentation** is applied where scheduling practices differ between Regional Operations Center and non-ROC facilities.
- Key departments monitored include **ED, ICU, Med Surg,** and **Telemetry**.
- The **11 CBAs** cover different employee groups with varying schedule rules and PTO policies.
