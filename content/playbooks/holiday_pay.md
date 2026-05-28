# Holiday Pay Playbook

## Overview

| Attribute | Value |
|-----------|-------|
| **Slug** | `holiday_pay` |
| **Name** | Holiday Pay |
| **Category** | `date_range_check` |
| **Status** | ✅ Fully Implemented |
| **ROC Segmentation** | No |
| **Required Tables** | `timekeeping`, `payroll` |
| **Required Columns** | `holiday_flag`, `pay_code`, `hours_worked` |
| **Pay Code Patterns** | `HOL`, `HPAY`, `XMAS`, `NY` |

## Description

Analysis of holiday pay hours across markets, critical staffing and overtime behavior during Christmas and New Year windows, holiday window compliance per CBA, stacking with other premiums, and the known BSMH pattern where holiday pay rises while OT and CS dip on actual holidays.

## Check Families

- `date_range_check`
- `stacking_check`
- `segment_variance`
- `threshold_check`

## Checks

### `holiday_hours_by_market`
Segment variance of holiday pay hours across markets.

**Variables:** `holiday_hours_by_market` (dict)

**Threshold:** Spread > 40% → warning/medium

**Example Finding:**
> "Holiday pay hours vary 38.2% across 9 markets (min: 120.0h, max: 165.8h)."

---

### `christmas_new_year_cs_ot_behavior`
Known BSMH pattern: holiday pay rises while OT and CS dip at Christmas/New Year.

**Variables:** `christmas_holiday_pay_hours`, `christmas_ot_hours`, `christmas_cs_hours`, `regular_week_ot_hours`, `regular_week_cs_hours`

**Expected Pattern:** Holiday pay up, OT down, CS down vs regular week.

**Example Finding (Pass):**
> "Holiday pay rises (240.5h) while OT (-12.4%) and CS (-8.1%) dip vs regular week — matches known BSMH pattern."

**Example Finding (Warning):**
> "Holiday window OT and CS did not dip as expected. OT change: +5.2%, CS change: +2.1% vs regular week. This deviates from the known BSMH holiday pattern."

---

### `holiday_window_compliance_by_cba`
Holiday window compliance violations per CBA.

**Variables:** `cba_holiday_violations` (list of dicts with `cba_name`, `violation_count`)

**Status Mapping:**
- Any violations → fail/high

**Example Finding:**
> "15 holiday window compliance violations across CBA(s): Toledo RN, Lorain Allied."

---

### `stacking_with_premiums`
Holiday stacking with other premium codes — detect prohibited combinations.

**Variables:** `holiday_stacking_combos`, `prohibited_during_holiday`

**Status Mapping:**
- Any prohibited combinations → fail/high

**Example Finding:**
> "Found 3 prohibited premium stacking combinations during holiday windows."

---

### `holiday_pay_rises_ot_dips`
Trend pattern validation — holiday pay rises while OT and CS dip across multiple weeks.

**Variables:** `holiday_pay_trend` (list of weekly dicts with `holiday_pay_hours`, `ot_hours`, `cs_hours`)

**Logic:** For each week where holiday pay rises, confirm OT and CS both decline.

**Threshold:** More anomaly weeks than confirmed weeks → warning/medium

**Example Finding:**
> "The known pattern (holiday pay rises → OT+CS dip) was confirmed in 8 weeks but broken in 3 weeks (confirmation rate: 72.7%)."

## Scenarios

None defined.

## Key Variables

| Variable | Description |
|----------|-------------|
| `holiday_flag` | Holiday indicator |
| `pay_code` | Holiday pay codes |
| `hours_worked` | Hours worked |
| `holiday_hours_by_market` | Holiday hours per market |
| `christmas_holiday_pay_hours` | Holiday pay hours during Christmas window |
| `christmas_ot_hours` | OT hours during Christmas window |
| `christmas_cs_hours` | CS hours during Christmas window |
| `regular_week_ot_hours` | Baseline OT hours (regular week) |
| `regular_week_cs_hours` | Baseline CS hours (regular week) |
| `cba_holiday_violations` | CBA holiday window violations |
| `holiday_stacking_combos` | Observed pay-code combinations during holidays |
| `prohibited_during_holiday` | Prohibited combinations during holidays |
| `holiday_pay_trend` | Weekly trend data for holiday pattern validation |

## Thresholds Summary

| Threshold | Value | Severity |
|-----------|-------|----------|
| Holiday hours market variance | > 40% | medium |
| Holiday pattern confirmation | More anomalies than confirmations | medium |

## Known BSMH Context

- **Known pattern:** Holiday pay rises while OT and CS dip on actual holidays.
- Holiday window rules vary by CBA; compliance must be checked per agreement.
- Christmas and New Year windows are the primary focus for pattern analysis.
