# Float Staffing and Agency Labor Playbook

## Overview

| Attribute | Value |
|-----------|-------|
| **Slug** | `float_staffing` |
| **Name** | Float Staffing and Agency Labor |
| **Category** | `ratio_check` |
| **Status** | ✅ Fully Implemented |
| **ROC Segmentation** | Yes |
| **Required Tables** | `payroll`, `staffing` |
| **Required Columns** | `agency_hours`, `pay_code`, `department` |
| **Pay Code Patterns** | `AGCY`, `TRAV`, `FLOAT`, `CONTRACT` |

## Description

Analysis of agency labor utilization, cost premium over core comparable rates, float pool distribution, and ROC vs non-ROC segmentation. Focus on high-premium departments (ED, ICU, Med Surg, Telemetry).

## Check Families

- `ratio_check`
- `segment_variance`
- `threshold_check`
- `concentration_analysis`

## Checks

### `agency_pct_of_total_staffing`
Agency labor as a percentage of total staffing hours. Flags when agency labor exceeds **20%**.

**Variables:** `agency_hours`, `total_staffing_hours`, `agency_hours_by_segment`

**Threshold:** > 20% → warning/high

**Example Finding:**
> "Agency labor represents 24.3% of total staffing hours (1,240h of 5,103h), exceeding the 20% threshold."

---

### `agency_cost_premium`
Agency cost premium over the core comparable rate. Flags when the agency rate exceeds **1.5x** the core rate.

**Variables:** `agency_cost_rate`, `core_cost_rate`

**Threshold:** > 1.5x → warning/high

**Example Finding:**
> "Agency cost rate ($85.00) is 1.73x the core comparable rate ($49.13), exceeding the 1.5x flag threshold."

---

### `float_pool_hours`
Float pool hours distribution by department.

**Variables:** `float_pool_hours_by_dept` (dict)

**Outputs:** Total float hours, department count, spread percentage (max/min variance).

**Example Finding:**
> "Float pool hours distributed across 8 departments. Total: 420.5h. Spread: 340.1% (max/min variance)."

---

### `roc_vs_nonroc_agency_utilization`
ROC vs non-ROC agency utilization segmentation.

**Variables:** `roc_agency_hours`, `non_roc_agency_hours`, `roc_total_hours`, `non_roc_total_hours`

**Threshold:** Deviation > 10 percentage points → warning/medium

**Example Finding:**
> "ROC agency utilization (18.2%) differs from non-ROC (6.4%) by 11.8 percentage points."

---

### `agency_hours_trend`
Agency hours weekly trend. Flags when agency hours increase more than **10%** over the analysis period.

**Variables:** `agency_hours_by_week` (list)

**Threshold:** > +10% over period → warning/medium

**Example Finding:**
> "Agency hours have increased 14.5% over the analysis period (from 210.0h to 240.5h per week). Slope: 2.35."

---

### `agency_vs_core_concentration`
Agency concentration in high-premium departments (ED, ICU, Med Surg, Telemetry).

**Variables:** `agency_pct_by_dept`, `high_premium_depts`

**Threshold:** > 30% in any high-premium department → warning/high

**Example Finding:**
> "2 high-premium department(s) exceed 30% agency: ED (34.2%), ICU (31.8%)."

## Scenarios

None defined.

## Key Variables

| Variable | Description |
|----------|-------------|
| `agency_hours` | Total agency hours |
| `total_staffing_hours` | Total staffing hours (agency + core) |
| `agency_hours_by_segment` | Agency hours broken down by segment |
| `agency_cost_rate` | Average agency cost rate |
| `core_cost_rate` | Comparable core employee cost rate |
| `float_pool_hours_by_dept` | Float pool hours per department |
| `roc_agency_hours` | Agency hours in ROC facilities |
| `non_roc_agency_hours` | Agency hours in non-ROC facilities |
| `roc_total_hours` | Total hours in ROC facilities |
| `non_roc_total_hours` | Total hours in non-ROC facilities |
| `agency_hours_by_week` | Weekly agency hours for trend analysis |
| `agency_pct_by_dept` | Agency percentage per department |
| `high_premium_depts` | List of high-premium departments (default: ED, ICU, Med Surg, Telemetry) |

## Thresholds Summary

| Threshold | Value | Severity |
|-----------|-------|----------|
| Agency % of total staffing | > 20% | high |
| Agency cost premium | > 1.5x core rate | high |
| High-premium dept concentration | > 30% | high |
| Hours trend increase | > +10% over period | medium |

## Known BSMH Context

- High-premium departments: **ED, ICU, Med Surg, Telemetry**
- Agency cost premium is a major cost driver; focus on conversion opportunities.
