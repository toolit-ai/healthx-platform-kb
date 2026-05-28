# Shift Differential and Stacking Playbook

## Overview

| Attribute | Value |
|-----------|-------|
| **Slug** | `shift_differential` |
| **Name** | Shift Differential and Stacking |
| **Category** | `stacking_check` |
| **Status** | ✅ Fully Implemented |
| **ROC Segmentation** | No |
| **Required Tables** | `timekeeping`, `payroll` |
| **Required Columns** | `shift_start`, `shift_end`, `pay_code`, `zone` |
| **Pay Code Patterns** | `SD`, `DIFF`, `EVE`, `NITE`, `WDF` |

## Description

Analysis of shift differential zone allocation, majority/minimum rule scenario modeling, stacking compliance, anti-pyramiding, and market-level variance. Includes SD3 Night + WDF Weekend top-stack verification.

## Check Families

- `threshold_check`
- `stacking_check`
- `segment_variance`
- `scenario_modeling`
- `formula_verification`

## Checks

### `zone_hour_allocation`
Distribution of hours across shift-differential zones.

**Variables:** `zone_hours` (dict: zone → hours)

**Outputs:** Total hours, percentage by zone.

**Example Finding:**
> "Hours distributed across 3 shift zones. Total: 8,420.0h. Day: 45.2% | Evening: 32.1% | Night: 22.7%"

---

### `majority_rule_scenario`
Majority-rule scenario: differential assigned by majority hours in zone.

**Variables:** `zone_hours`, `zone_rates`, `total_hours`, `current_cost`

**Scenario Assumptions:**
- Basis: `majority_hours_in_zone`
- Rule: Assign shift differential for the zone where the employee spends the majority of their shift.

**Outputs:** `scenario_cost`, `current_cost`, `cost_delta`, `cost_delta_pct`, `majority_zone`

**Example Finding:**
> "Under the majority-rule scenario, differential is assigned using zone 'Night'. Scenario cost: $124,500.00 vs current: $118,200.00 (delta: +5.3%)."

**Discussion Questions:**
- How many employees would see pay changes under the majority rule?
- Are there CBA provisions that override the majority rule for specific groups?

---

### `minimum_hours_scenario`
Minimum-hours scenario: differential only when minimum threshold hours are met in zone.

**Variables:** `zone_hours`, `zone_rates`, `total_hours`, `current_cost`, `min_hours_threshold` (default 4.0)

**Scenario Assumptions:**
- Basis: `minimum_hours_in_zone`
- Rule: Assign shift differential only when employee works at least 4.0 hours in the qualifying zone.

**Outputs:** `scenario_cost`, `current_cost`, `cost_delta`, `cost_delta_pct`, `qualifying_zone_count`, `disqualified_hours`

**Example Finding:**
> "Under the minimum-hours scenario (4h threshold), 2 of 3 zones qualify. Scenario cost: $112,800.00 vs current: $118,200.00 (delta: -4.6%)."

**Discussion Questions:**
- How does the minimum-hours threshold compare across markets?
- Which employee groups are most affected by disqualification under this rule?

---

### `stacking_combinations`
Detect prohibited shift differential stacking combinations.

**Variables:** `observed_combos`, `prohibited_combos`

**Logic:** A violation occurs when any prohibited combination is a subset of an observed combination.

**Status Mapping:**
- Any violations → fail/high

**Example Finding:**
> "Found 7 instances of prohibited shift differential stacking."

---

### `anti_pyramiding`
Anti-pyramiding rule compliance — multiple shift differentials stacked on the same base hours.

**Variables:** `pyramiding_instances`, `total_records`

**Status Mapping:**
- Any instances → fail/high

**Example Finding:**
> "12 of 8,420 records (0.1%) violate the anti-pyramiding rule — multiple shift differentials stacked on the same base hours."

---

### `market_variance`
Segment variance in shift differential hours across markets.

**Variables:** `differential_hours_by_market` (dict)

**Threshold:** Spread > 30% → warning/medium

**Example Finding:**
> "Shift differential hours vary 42.3% across 9 markets (min: 340.0h, max: 484.2h)."

## Scenarios

1. **Majority Rule Scenario** — Assign differential by majority hours in zone
2. **Minimum Hours Scenario** — Assign differential only when minimum threshold hours met in zone

## Scenario Outputs

- `current_state_differential_hours`
- `majority_scenario_hours`
- `minimum_scenario_hours`
- `cost_impact_vs_current`
- `employee_impact_by_market`

## Key Variables

| Variable | Description |
|----------|-------------|
| `zone_hours` | Hours worked per shift zone |
| `zone_rates` | Differential rate per zone |
| `total_hours` | Total hours analyzed |
| `current_cost` | Current-state differential cost |
| `min_hours_threshold` | Minimum hours to qualify for differential (default 4.0h) |
| `observed_combos` | List of observed pay-code combinations |
| `prohibited_combos` | List of prohibited pay-code combinations |
| `pyramiding_instances` | Count of anti-pyramiding violations |
| `total_records` | Total records analyzed for pyramiding |
| `differential_hours_by_market` | Differential hours per market |

## Thresholds Summary

| Threshold | Value | Severity |
|-----------|-------|----------|
| Min hours in zone | 4.0h (configurable) | — |
| Market variance spread | > 30% | medium |

## Known BSMH Context

- **Top stacking combination:** SD3 Night + WDF Weekend (known highest-volume combination).
- Majority rule vs minimum rule scenario modeling is used to compare policy options.
- FLSA regular-rate inclusion flags are checked for differential pay.
