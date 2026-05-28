# Critical Staffing Playbook

## Overview

| Attribute | Value |
|-----------|-------|
| **Slug** | `critical_staffing` |
| **Name** | Critical Staffing |
| **Category** | `ratio_check` |
| **Status** | ✅ Fully Implemented |
| **ROC Segmentation** | Yes |
| **Required Tables** | `timekeeping`, `payroll` |
| **Required Columns** | `cs_hours`, `pay_code`, `department` |
| **Pay Code Patterns** | `CS`, `CRIT`, `CSTAF` |

## Description

Analysis of critical staffing utilization as a percentage of core hours, tier distribution, ROC vs non-ROC segmentation, employee/department concentration, stacking with shift differential, and departments exceeding thresholds.

## Check Families

- `ratio_check`
- `threshold_check`
- `segment_variance`
- `trend_analysis`

## Checks

### `cs_pct_of_core_hours`
Critical staffing as a percentage of core hours. Flags when CS exceeds **5%**.

**Variables:** `cs_hours`, `core_hours`, `cs_hours_by_segment`

**Threshold:** > 5% → warning/high

**Example Finding:**
> "Critical staffing is 7.2% of core hours (890h of 12,361h), exceeding the 5% threshold."

**Discussion Questions:**
- Are the departments above 5% concentrated in specific service lines?
- Is CS usage trending up or down over the analysis period?

---

### `cs_hours_by_tier`
Distribution of CS hours across tiers/levels.

**Variables:** `cs_hours_by_tier` (dict)

**Outputs:** Total CS hours, tier count, percentage by tier.

**Example Finding:**
> "CS hours distributed across 3 tier(s). Total: 890.0h. Tier 1: 62.4% | Tier 2: 28.1% | Tier 3: 9.5%"

---

### `roc_vs_nonroc_cs_rate`
ROC vs non-ROC critical staffing rate segmentation.

**Variables:** `roc_cs_hours`, `roc_core_hours`, `non_roc_cs_hours`, `non_roc_core_hours`

**Threshold:** Deviation > 5 percentage points → warning/medium

**Example Finding:**
> "ROC CS rate (8.4%) differs from non-ROC (4.1%) by 4.3 percentage points."

---

### `employee_department_concentration`
CS concentration by employee and department. Flags when top 10 employees hold more than **50%** of CS hours.

**Variables:** `top_10_cs_employee_pct`, `top_5_cs_dept_pct`

**Threshold:** Top 10 employees > 50% → warning/medium

**Example Finding:**
> "Top 10 employees hold 55.2% of CS hours (threshold 50%). Top 5 departments hold 78.4%."

---

### `stacking_with_shift_differential`
CS + shift differential stacking. Flags when stacking exceeds **20%** of CS hours.

**Variables:** `cs_sd_stacking_hours`, `total_cs_hours`

**Threshold:** > 20% of CS hours → warning/medium

**Example Finding:**
> "24.3% of CS hours (216.0h of 890.0h) also carry shift differential — exceeds stacking concentration threshold."

---

### `departments_above_5pct`
List all departments with CS rate above 5% of core hours.

**Variables:** `cs_pct_by_dept` (dict)

**Status Logic:**
- 1-3 departments above threshold → warning
- > 3 departments above threshold → fail
- > 5 departments above threshold → severity high

**Example Finding:**
> "5 department(s) exceed 5% CS rate: ED (8.2%), ICU (7.1%), Med Surg (6.4%), Telemetry (5.8%), OR (5.1%)..."

## Scenarios

None defined.

## Key Variables

| Variable | Description |
|----------|-------------|
| `cs_hours` | Total critical staffing hours |
| `core_hours` | Total core hours |
| `cs_hours_by_tier` | CS hours per tier/level |
| `roc_cs_hours` | CS hours in ROC facilities |
| `roc_core_hours` | Core hours in ROC facilities |
| `non_roc_cs_hours` | CS hours in non-ROC facilities |
| `non_roc_core_hours` | Core hours in non-ROC facilities |
| `top_10_cs_employee_pct` | % of CS hours held by top 10 employees |
| `top_5_cs_dept_pct` | % of CS hours held by top 5 departments |
| `cs_sd_stacking_hours` | CS hours that also have shift differential |
| `total_cs_hours` | Total CS hours for stacking calculation |
| `cs_pct_by_dept` | CS percentage per department |

## Thresholds Summary

| Threshold | Value | Severity |
|-----------|-------|----------|
| CS % of core hours | > 5% | high |
| CS + SD stacking | > 20% of CS hours | medium |
| ROC vs non-ROC deviation | > 5pp | medium |
| Employee concentration (top 10) | > 50% | medium |
| Departments above threshold | > 3 depts | fail |

## Known BSMH Context

- CS rates above 5% of core hours trigger deep-dive analysis.
- Unscheduled PTO forfeiture interaction should be reviewed where data is available.
- Holiday and weekend interactions with CS are analyzed in the Holiday Pay playbook.
