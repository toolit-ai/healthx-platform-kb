# Stacking Playbook

## Overview

| Attribute | Value |
|-----------|-------|
| **Slug** | `stacking` |
| **Name** | Stacking |
| **Category** | `stacking_check` |
| **Status** | ✅ Fully Implemented |
| **ROC Segmentation** | No |
| **Required Tables** | `timekeeping`, `payroll` |
| **Required Columns** | `pay_code`, `hours_worked` |
| **Pay Code Patterns** | — |

## Description

General pay-code stacking and anti-pyramiding analysis. This playbook is covered primarily under the [Shift Differential and Stacking](./shift_differential.md) playbook. It exists as a standalone module for broader stacking analysis across all pay practices, including allowed and prohibited combinations, FLSA regular-rate compliance, and top-stack volume verification.

## Check Families

- `stacking_check`
- `formula_verification`
- `compliance_check`
- `concentration_analysis`

## Checks

### `prohibited_stacking_combinations`
Detects instances where prohibited pay-code combinations are applied to the same hours. Flags when any prohibited combination is observed in the dataset.

**Variables:** `observed_combos` (list), `prohibited_combos` (list)

**Status Mapping:**
- Any prohibited combo found → fail/high
- No prohibited combos found → pass/info

**Example Finding:**
> "Found 3 instances of prohibited stacking combination SD2 Evening + SD3 Night on 12.5 hours across 2 employees."

**Discussion Questions:**
- Are the prohibited combinations defined correctly in the configuration?
- Which CBA clauses explicitly prohibit these combinations?

---

### `anti_pyramiding_compliance`
Ensures only the highest applicable differential applies to any given base hour. Anti-pyramiding violations occur when multiple differentials stack additively instead of applying the highest single rate.

**Variables:** `pyramiding_instances` (count), `total_stacked_hours`

**Threshold Logic:**
- Any pyramiding instance → warning/high
- > 5% of stacked hours affected → fail/high

**Example Finding:**
> "Identified 8 anti-pyramiding violations affecting 24.0 hours (6.2% of all stacked hours), indicating systemic calculation errors."

**Discussion Questions:**
- Is the payroll system configured to apply the highest differential automatically?
- What is the estimated cost recovery if pyramiding violations are corrected retroactively?

---

### `flsa_regular_rate_inclusion`
Verifies that stacked premiums are correctly included in the FLSA regular rate for overtime calculations. Flags when stacked differentials are excluded from the regular-rate base.

**Variables:** `stacked_premiums_excluded` (boolean), `affected_ot_hours`

**Status Mapping:**
- `True` (excluded) → fail/high
- `False` (included) → pass/info

**Example Finding:**
> "Stacked premiums totaling $1,240 were excluded from the FLSA regular-rate calculation, affecting 45.5 overtime hours."

**Discussion Questions:**
- Does the payroll engine correctly aggregate all remuneration for the regular rate?
- What is the DOL exposure if this exclusion is found in an audit?

---

### `top_stack_volume_verification`
Validates that the known highest-volume stacking combination (SD3 Night + WDF Weekend) is correctly identified and its volume is within expected bounds. BSMH data shows this is the top stacking combination system-wide.

**Variables:** `top_combo_name`, `top_combo_hours`, `total_stacked_hours`

**Threshold Logic:**
- Top combo is not SD3 Night + WDF Weekend → warning/medium
- Top combo > 30% of total stacked hours → warning/medium
- Top combo > 40% of total stacked hours → warning/high

**Example Finding:**
> "SD3 Night + WDF Weekend is the top stacking combination at 28.3% of total stacked hours (412.0 of 1,456.5), within expected bounds."

**Discussion Questions:**
- Does the top combination vary significantly by facility or CBA?
- Should volume caps be considered for the highest-volume combination to control labor costs?

---

### `stacking_concentration`
Measures concentration of stacking hours across combinations. Flags when the top 3 stacking combinations hold a disproportionate share of total stacked hours.

**Variables:** `top_3_combo_pct`

**Threshold:** > 60% → warning/medium

**Example Finding:**
> "The top 3 stacking combinations represent 67.4% of total stacked hours, indicating high concentration in a few premium patterns."

## Scenarios

None defined.

## Key Variables

| Variable | Description |
|----------|-------------|
| `pay_code` | Pay codes being analyzed |
| `hours_worked` | Hours worked |
| `observed_combos` | List of observed pay-code combinations |
| `prohibited_combos` | List of prohibited pay-code combinations |
| `pyramiding_instances` | Count of anti-pyramiding violations |
| `total_stacked_hours` | Total hours with stacked premiums |
| `stacked_premiums_excluded` | Boolean: stacked premiums excluded from FLSA regular rate |
| `affected_ot_hours` | OT hours affected by regular-rate exclusion |
| `top_combo_name` | Name of the highest-volume stacking combination |
| `top_combo_hours` | Hours for the top stacking combination |
| `top_3_combo_pct` | Percentage of total stacked hours held by top 3 combinations |

## Thresholds Summary

| Threshold | Value | Severity |
|-----------|-------|----------|
| Prohibited stacking combo found | Any occurrence | high |
| Anti-pyramiding % of stacked hours | > 5% | high |
| FLSA regular-rate exclusion | Any occurrence | high |
| Top combo volume | > 40% of stacked hours | high |
| Top combo volume | > 30% of stacked hours | medium |
| Top 3 combo concentration | > 60% | medium |

## Known BSMH Context

- **Top stacking combination:** SD3 Night + WDF Weekend (known highest-volume combination).
- Anti-pyramiding rules are critical for FLSA compliance.
- Stacking combinations vary across the **11 CBAs** covering different employee groups.
- FLSA regular-rate miscalculations from stacking are a common DOL audit finding.
