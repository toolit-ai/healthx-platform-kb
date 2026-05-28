# Weekend Option Pay Playbook

## Overview

| Attribute | Value |
|-----------|-------|
| **Slug** | `weekend_option` |
| **Name** | Weekend Option Pay |
| **Category** | `date_range_check` |
| **Status** | ✅ Fully Implemented |
| **ROC Segmentation** | No |
| **Required Tables** | `timekeeping`, `payroll` |
| **Required Columns** | `weo_hours`, `pay_code`, `weekend_flag` |
| **Pay Code Patterns** | `WEO`, `WOPT` |

## Description

Analysis of Weekend Option (WEO) hours by market, facility, and department; weekend window compliance; detection of WEO hours outside the weekend zone; holiday and callback no-stacking rules; displacement effects against critical staffing and overtime; employee concentration; and year-over-year trend since WEO program launch.

## Check Families

- `date_range_check`
- `stacking_check`
- `segment_variance`
- `trend_analysis`
- `concentration_analysis`
- `ratio_check`

## Checks

### `weo_hours_by_market`
WEO hours as a percentage of productive hours segmented by market, facility, and department. Flags when WEO exceeds **5%** of productive hours in any department.

**Variables:** `weo_hours`, `productive_hours`, `market`, `facility`, `department`

**Threshold:** > 5% of productive hours in any department → warning/medium

**Example Finding:**
> "WEO hours represent 7.2% of productive hours in the ED at St. Vincent (142.0h of 1,971.4h), exceeding the 5% threshold."

**Discussion Questions:**
- Which departments show the highest WEO penetration relative to core staffing?
- Are WEO hours concentrated in departments with chronic weekend coverage gaps?

---

### `weo_window_compliance`
Verifies WEO hours fall within the defined weekend window. Flags any WEO hours recorded outside the qualifying period of **Friday 23:00 to Monday 07:00**.

**Variables:** `weo_hours`, `weekend_window_start`, `weekend_window_end`, `shift_start`, `shift_end`

**Status Mapping:**
- Any WEO hours outside window → fail/high
- All WEO hours within window → pass/info

**Example Finding:**
> "12.0 WEO hours were recorded outside the weekend window of Friday 23:00 to Monday 07:00 across 3 shifts at Allen Hospital."

**Discussion Questions:**
- Are the off-window hours due to scheduling exceptions, coding errors, or a misconfigured window definition?
- Which facilities show the highest rate of off-window WEO coding?

---

### `weo_outside_weekend_zone`
Detects WEO pay codes applied on weekdays outside the qualifying weekend zone. Any WEO-coded hour on a non-weekend day indicates a data integrity or policy compliance issue.

**Variables:** `weo_hours`, `weekend_flag`, `pay_code`, `shift_date`

**Status Mapping:**
- Any WEO on non-weekend day → fail/high
- All WEO on weekend days → pass/info

**Example Finding:**
> "8.5 WEO hours were coded on Tuesday and Wednesday shifts for 2 employees at MRMC, outside the qualifying weekend zone."

**Discussion Questions:**
- Are weekday WEO codes the result of make-up shifts, system defaults, or manual entry errors?
- Does the CBA allow WEO make-up hours outside the standard weekend window?

---

### `holiday_callback_no_stacking`
Verifies WEO does not stack with holiday pay or callback pay on the same shift. WEO is intended as a standalone weekend premium and should not compound with other premium types.

**Variables:** `weo_hours`, `holiday_flag`, `callback_flag`, `pay_code_combinations`, `shift_date`

**Status Mapping:**
- Any WEO + holiday or WEO + callback stacking → fail/high
- No prohibited stacking → pass/info

**Example Finding:**
> "3 employees have WEO hours stacking with holiday pay on the same shift (12.0 total hours), violating the no-stacking rule."

**Discussion Questions:**
- Is the stacking caused by overlapping pay-code logic or scheduling overlaps?
- What is the estimated cost impact if stacked premiums were paid at the higher rate only?

---

### `weo_vs_critical_staffing_displacement`
Assesses whether the WEO program is displacing critical staffing (CS) hours. Flags when CS hours remain above **5%** of core hours in departments with an active WEO program.

**Variables:** `cs_hours`, `core_hours`, `weo_hours`, `department`

**Threshold:** CS > 5% of core hours in departments with active WEO → warning/medium

**Example Finding:**
> "Critical staffing remains at 6.8% of core hours in Med Surg despite an active WEO program (87.3h CS vs 1,283.5h core), suggesting limited displacement effect."

**Discussion Questions:**
- Are WEO participants assigned to the same shifts where CS is most frequently used?
- What is the net cost comparison of WEO commitment premiums versus displaced CS premiums?

---

### `weo_vs_overtime_displacement`
Assesses whether the WEO program is reducing overtime usage on weekends. Flags when weekend OT exceeds **10%** of productive hours in departments with active WEO.

**Variables:** `weekend_ot_hours`, `productive_hours`, `weo_hours`, `department`

**Threshold:** Weekend OT > 10% of productive hours in departments with active WEO → warning/medium

**Example Finding:**
> "Weekend OT in Telemetry remains at 11.4% of productive hours (94.2h of 826.3h) despite WEO coverage, indicating minimal OT displacement."

**Discussion Questions:**
- Is weekend OT being driven by unplanned absences that WEO coverage cannot absorb?
- Should WEO commitment levels be increased in departments with persistent weekend OT?

---

### `employee_concentration`
Top-10 employee WEO concentration. Flags when the top 10 employees hold more than **40%** of total WEO hours.

**Variables:** `top_10_weo_pct`, `weo_hours_by_employee`

**Threshold:** > 40% → warning/medium

**Example Finding:**
> "The top 10 employees hold 52.3% of total WEO hours (1,140.0h of 2,179.7h), exceeding the 40% concentration flag threshold."

**Discussion Questions:**
- Does high concentration indicate reliance on a small group of committed WEO staff?
- What is the operational risk if one or more top WEO employees leave or change roles?

---

### `yoy_trend_since_launch`
Year-over-year trend in WEO hours since program launch. Flags when WEO hours increase by more than **10%** year-over-year without a corresponding increase in core hours.

**Variables:** `weo_hours_yoy_pct_change`, `core_hours_yoy_pct_change`, `launch_date`

**Threshold:** WEO hours increase > 10% YoY while core hours are flat or declining → warning/medium

**Example Finding:**
> "WEO hours increased 14.2% year-over-year while core hours declined 1.8%, indicating growing reliance on weekend option premiums."

**Discussion Questions:**
- Is the YoY growth driven by expanded eligibility, new facilities, or increased weekend demand?
- How does WEO growth compare to overall premium labor growth across the system?

## Scenarios

None defined.

## Key Variables

| Variable | Description |
|----------|-------------|
| `weo_hours` | Total Weekend Option hours |
| `pay_code` | WEO pay codes |
| `weekend_flag` | Indicator for weekend qualifying period |
| `market` | Market segment |
| `facility` | Facility segment |
| `department` | Department segment |
| `productive_hours` | Total productive hours worked |
| `weekend_window_start` | Start of qualifying weekend window (default Friday 23:00) |
| `weekend_window_end` | End of qualifying weekend window (default Monday 07:00) |
| `shift_start` | Shift start timestamp |
| `shift_end` | Shift end timestamp |
| `shift_date` | Calendar date of the shift |
| `holiday_flag` | Holiday indicator for stacking checks |
| `callback_flag` | Callback indicator for stacking checks |
| `pay_code_combinations` | Combined pay codes on a single shift |
| `cs_hours` | Critical staffing hours |
| `core_hours` | Total core hours |
| `weekend_ot_hours` | Overtime hours worked on weekends |
| `weo_hours_by_employee` | WEO hours per employee |
| `top_10_weo_pct` | Percentage of total WEO held by top 10 employees |
| `weo_hours_yoy_pct_change` | Year-over-year percentage change in WEO hours |
| `core_hours_yoy_pct_change` | Year-over-year percentage change in core hours |
| `launch_date` | WEO program launch date |

## Thresholds Summary

| Threshold | Value | Severity |
|-----------|-------|----------|
| WEO % of productive hours (by department) | > 5% | medium |
| WEO window compliance | Any outside window | high |
| WEO outside weekend zone | Any on non-weekend day | high |
| Holiday/callback stacking | Any prohibited stacking | high |
| CS displacement (departments with WEO) | > 5% of core | medium |
| Weekend OT displacement (departments with WEO) | > 10% of productive | medium |
| Top-10 employee concentration | > 40% | medium |
| YoY WEO growth without core growth | > 10% YoY | medium |

## Known BSMH Context

- WEO is designed to reduce weekend premium costs through pre-committed scheduling.
- Displacement analysis determines whether WEO achieves its cost-reduction objectives.
- The standard weekend window is Friday 23:00 to Monday 07:00; variations may exist by CBA.
