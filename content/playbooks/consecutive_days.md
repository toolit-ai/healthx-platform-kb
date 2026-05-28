# Consecutive Days Playbook

## Overview

| Attribute | Value |
|-----------|-------|
| **Slug** | `consecutive_days` |
| **Name** | Consecutive Days |
| **Category** | `threshold_check` |
| **Status** | ✅ Fully Implemented |
| **ROC Segmentation** | No |
| **Required Tables** | `timekeeping` |
| **Required Columns** | `work_date`, `employee_id` |
| **Pay Code Patterns** | — |

## Description

Analysis of consecutive day streaks by employee, percentage of employees exceeding configured limits, average streak length, threshold breaches, streak-related OT hours, and role/facility/department patterns. Known employee impact range by department: 32% to 100%.

## Check Families

- `threshold_check`
- `concentration_analysis`
- `segment_variance`

## Checks

### `consecutive_day_streaks`
Identifies employees with consecutive day streaks exceeding the configured policy limit. Flags when any employee exceeds the **CBA- or policy-defined consecutive day limit** (commonly 6 or 7 days).

**Variables:** `max_consecutive_days_by_employee`, `configured_limit`

**Threshold:** Any employee > configured_limit → warning/high

**Example Finding:**
> "Employee ID 48291 has worked 9 consecutive days, exceeding the configured limit of 7 days."

---

### `pct_employees_exceeding_limit`
Percentage of employees with at least one streak exceeding the configured limit. Flags when more than **15%** of active employees breach the limit.

**Variables:** `employees_exceeding_limit`, `total_active_employees`

**Threshold:** > 15% → fail/high

**Example Finding:**
> "87 of 520 active employees (16.7%) have exceeded the 7-day consecutive work limit."

**Discussion Questions:**
- Is the current staffing model creating pressure to work consecutive days?
- Are per-diem or agency staff being utilized to break streaks?

---

### `average_streak_length`
Mean consecutive day streak across all employees. A rising average indicates systemic scheduling pressure. Flags when the average streak length exceeds **5.5 days**.

**Variables:** `average_streak_length`, `median_streak_length`

**Threshold:** > 5.5 days → warning/medium

**Example Finding:**
> "Average consecutive day streak is 6.2 days (median 5.0 days), exceeding the 5.5-day threshold."

---

### `streak_related_ot`
Overtime hours directly attributable to consecutive day streaks (e.g., OT triggered on day 6 or 7 of a streak). Flags when streak-related OT exceeds **15%** of total OT hours.

**Variables:** `streak_related_ot_hours`, `total_ot_hours`

**Threshold:** > 15% → warning/medium

**Example Finding:**
> "Streak-related OT accounts for 18.4% of total OT (142.3h of 773.1h), exceeding the 15% threshold."

**Discussion Questions:**
- Would hiring additional FTEs reduce both streaks and associated OT?
- Are managers approving consecutive day schedules that trigger avoidable OT?

---

### `department_impact_range`
Percentage of employees per department with consecutive day streaks exceeding the configured limit. Flags departments where more than **50%** of employees are affected.

**Variables:** `pct_exceeding_by_department`

**Threshold Logic:**
- Department > 50% employees exceeding → fail/high
- Department > 35% employees exceeding → warning/medium

**Example Finding:**
> "ICU has 58.3% of employees (35 of 60) exceeding the consecutive day limit, and Med Surg has 42.1% (32 of 76)."

---

### `role_facility_patterns`
Consecutive day patterns segmented by role and facility. Flags when any single role or facility shows a streak rate more than **10 percentage points** above the system average.

**Variables:** `streak_rate_by_role`, `streak_rate_by_facility`, `system_avg_streak_rate`

**Threshold Logic:**
- Role/facility rate > system avg + 10 pp → warning/medium
- Role/facility rate > system avg + 20 pp → warning/high

**Example Finding:**
> "Security staff show a 28.4% streak exceedance rate, which is 15.2 percentage points above the system average of 13.2%."

## Scenarios

None defined.

## Key Variables

| Variable | Description |
|----------|-------------|
| `max_consecutive_days_by_employee` | Max streak length per employee |
| `configured_limit` | Policy limit for consecutive days |
| `employees_exceeding_limit` | Count of employees exceeding the limit |
| `total_active_employees` | Total active employees in period |
| `average_streak_length` | Mean consecutive days across all employees |
| `median_streak_length` | Median consecutive days across all employees |
| `streak_related_ot_hours` | OT hours linked to streaks |
| `total_ot_hours` | Total OT hours for ratio calculation |
| `pct_exceeding_by_department` | Percentage exceeding limit per department |
| `streak_rate_by_role` | Streak exceedance rate per role |
| `streak_rate_by_facility` | Streak exceedance rate per facility |
| `system_avg_streak_rate` | System-wide streak exceedance rate |

## Thresholds Summary

| Threshold | Value | Severity |
|-----------|-------|----------|
| Any employee streak | > configured_limit | high |
| % employees exceeding limit | > 15% | high |
| Average streak length | > 5.5 days | medium |
| Streak-related OT | > 15% of total OT | medium |
| Department impact | > 50% employees | high |
| Role/facility variance | > +10 pp vs system avg | medium |

## Known BSMH Context

- Employee impact range by department: **32% to 100%**.
- Consecutive day policies vary across the **11 CBAs**.
