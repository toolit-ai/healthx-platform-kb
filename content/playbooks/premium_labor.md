# Premium Labor Playbook

## Overview

| Attribute | Value |
|-----------|-------|
| **Slug** | `premium_labor` |
| **Name** | Premium Labor |
| **Category** | `ratio_check` |
| **Status** | ✅ Fully Implemented |
| **ROC Segmentation** | No |
| **Required Tables** | `timekeeping`, `payroll` |
| **Required Columns** | `hours_worked`, `pay_code`, `department` |
| **Pay Code Patterns** | `PREM`, `OT`, `CS`, `SD`, `AGCY` |

## Description

Aggregate analysis of all premium labor components: overtime + critical staffing + shift differential + agency labor. Examines premium labor as a percentage of core hours, market/facility/department clusters, high-premium departments (ED, ICU, Med Surg, Telemetry), role and employee concentration, and trend/variance over time.

## Check Families

- `ratio_check`
- `segment_variance`
- `concentration_analysis`
- `trend_analysis`
- `composition_analysis`

## Checks

### `premium_labor_pct_of_core`
Premium labor hours as a percentage of core hours. Flags when total premium labor exceeds **25%** of core hours system-wide or **30%** in any single department.

**Formula:** `Premium Labor = OT + CS + Shift Differential + Agency Labor`

**Variables:** `premium_labor_hours`, `core_hours`, `department`

**Threshold Logic:**
- System-wide > 25% of core → warning/high
- Any department > 30% of core → warning/high

**Example Finding:**
> "Premium labor represents 28.4% of core hours system-wide (4,521.0h of 15,918.3h) and reaches 34.7% in the ED (892.5h of 2,572.1h)."

**Discussion Questions:**
- Which premium component (OT, CS, SD, or agency) is driving the majority of the variance?
- How does the system-wide premium labor percentage compare to peer health systems?

---

### `premium_labor_composition`
Breakdown of premium labor by component type. Flags when any single component exceeds **50%** of total premium labor hours, indicating an over-reliance on one premium mechanism.

**Variables:** `ot_hours`, `cs_hours`, `shift_diff_hours`, `agency_hours`, `premium_labor_hours`

**Threshold:** Any component > 50% of total premium labor → warning/medium

**Example Finding:**
> "Agency labor represents 53.2% of total premium labor hours (2,405.0h of 4,521.0h), indicating over-reliance on temporary staffing."

**Discussion Questions:**
- Is the composition skew driven by a short-term staffing crisis or a structural workforce gap?
- What is the cost differential if the dominant premium component were converted to core FTE hours?

---

### `high_premium_departments`
Identifies departments with disproportionately high premium labor usage. Focus departments are **ED, ICU, Med Surg, and Telemetry**. Flags when premium labor in these departments exceeds **30%** of their core hours.

**Variables:** `premium_labor_hours_by_department`, `core_hours_by_department`, `department`

**Threshold:** Premium labor > 30% of core hours in ED, ICU, Med Surg, or Telemetry → warning/high

**Example Finding:**
> "Telemetry shows premium labor at 31.5% of core hours (623.8h of 1,980.3h), exceeding the 30% threshold for high-premium departments."

**Discussion Questions:**
- Do high-premium departments share common scheduling patterns or patient acuity drivers?
- Are there recruitment or retention initiatives that could reduce premium labor dependence in these units?

---

### `market_facility_clusters`
Cluster analysis of premium labor patterns across markets and facilities. Flags when a single market or facility exceeds **120%** of the system-wide average premium labor percentage.

**Variables:** `premium_labor_hours_by_market`, `premium_labor_hours_by_facility`, `core_hours_by_market`, `core_hours_by_facility`

**Threshold:** Market or facility premium labor % > 120% of system average → warning/medium

**Example Finding:**
> "St. Vincent market premium labor is 32.1% of core hours, which is 138% of the system-wide average of 23.2%."

**Discussion Questions:**
- Are outlier markets or facilities understaffed relative to their patient volume?
- Do outlier facilities have different CBA provisions that inflate premium labor eligibility?

---

### `role_employee_concentration`
Role and employee concentration of premium labor hours. Flags when the top **10 employees** hold more than **45%** of total premium labor hours, or when a single role accounts for more than **60%**.

**Variables:** `premium_labor_hours_by_role`, `premium_labor_hours_by_employee`, `top_10_premium_pct`, `top_role_premium_pct`

**Threshold Logic:**
- Top 10 employees > 45% of total premium labor → warning/medium
- Single role > 60% of total premium labor → warning/medium

**Example Finding:**
> "The top 10 employees hold 48.6% of total premium labor hours (2,197.2h of 4,521.0h), and Registered Nurses account for 64.3% of all premium labor."

**Discussion Questions:**
- Does role concentration reflect appropriate scope of practice, or are roles being stretched beyond standard duties?
- Is employee concentration driven by a small group of high-utilization individuals or systemic scheduling gaps?

---

### `trend_and_variance`
Weekly and monthly trends and variance in premium labor hours. Flags when premium labor shows a sustained **> 10%** increase over 3 consecutive months or when month-over-month variance exceeds **15%**.

**Variables:** `premium_labor_hours_monthly`, `premium_labor_pct_monthly`, `variance_pct`, `trend_direction`

**Threshold Logic:**
- Sustained increase > 10% over 3 consecutive months → warning/high
- Month-over-month variance > 15% → warning/medium

**Example Finding:**
> "Premium labor hours increased 12.3%, 11.8%, and 14.1% over the last 3 consecutive months, indicating a sustained upward trend with 18.4% month-over-month variance."

**Discussion Questions:**
- Is the trend correlated with seasonal patient volume, flu season, or a specific operational event?
- What operational levers (hiring, scheduling, float pool expansion) can reverse a sustained premium labor increase?

## Scenarios

None defined.

## Key Variables

| Variable | Description |
|----------|-------------|
| `hours_worked` | Total hours worked |
| `pay_code` | Pay codes for premium components |
| `department` | Department segment |
| `premium_labor_hours` | Sum of OT + CS + SD + Agency hours |
| `core_hours` | Total core hours |
| `ot_hours` | Overtime hours |
| `cs_hours` | Critical staffing hours |
| `shift_diff_hours` | Shift differential hours |
| `agency_hours` | Agency labor hours |
| `premium_labor_hours_by_department` | Premium hours per department |
| `core_hours_by_department` | Core hours per department |
| `premium_labor_hours_by_market` | Premium hours per market |
| `premium_labor_hours_by_facility` | Premium hours per facility |
| `core_hours_by_market` | Core hours per market |
| `core_hours_by_facility` | Core hours per facility |
| `premium_labor_hours_by_role` | Premium hours per role |
| `premium_labor_hours_by_employee` | Premium hours per employee |
| `top_10_premium_pct` | Percentage of total premium labor held by top 10 employees |
| `top_role_premium_pct` | Percentage of total premium labor held by the top role |
| `premium_labor_hours_monthly` | Monthly premium labor hours |
| `premium_labor_pct_monthly` | Monthly premium labor as percentage of core |
| `variance_pct` | Month-over-month percentage variance |
| `trend_direction` | Sustained trend direction (increasing, decreasing, flat) |

## Thresholds Summary

| Threshold | Value | Severity |
|-----------|-------|----------|
| Premium labor % of core (system-wide) | > 25% | high |
| Premium labor % of core (department) | > 30% | high |
| Single component dominance | > 50% of total premium | medium |
| High-premium department (ED/ICU/Med Surg/Telemetry) | > 30% of core | high |
| Market/facility vs system average | > 120% of system average | medium |
| Top-10 employee concentration | > 45% | medium |
| Single role concentration | > 60% | medium |
| Sustained 3-month increase | > 10% each month | high |
| Month-over-month variance | > 15% | medium |

## Known BSMH Context

- Premium labor is a composite metric used for executive reporting.
- High-premium departments consistently show elevated costs across multiple premium types.
- The standard premium labor formula is: OT + CS + Shift Differential + Agency Labor.
