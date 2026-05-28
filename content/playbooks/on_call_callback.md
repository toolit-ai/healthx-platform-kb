# On Call and Call Back Playbook

## Overview

| Attribute | Value |
|-----------|-------|
| **Slug** | `on_call_callback` |
| **Name** | On Call and Call Back |
| **Category** | `ratio_check` |
| **Status** | ✅ Fully Implemented |
| **ROC Segmentation** | Yes |
| **Required Tables** | `timekeeping`, `payroll` |
| **Required Columns** | `on_call_hours`, `callback_hours`, `pay_code` |
| **Pay Code Patterns** | `ONC`, `ONCA`, `CB`, `CBACK`, `CALLBACK` |

## Description

Analysis of callback conversion rates, on-call as percentage of total hours, ROC vs non-ROC callback rate benchmarks, minimum guarantee compliance, short-gap callbacks, and multiple callbacks per on-call period.

## Check Families

- `ratio_check`
- `threshold_check`
- `stacking_check`
- `concentration_analysis`
- `segment_variance`

## Checks

### `callback_pct_of_oncall`
Callback as a percentage of on-call hours with ROC segmentation.

**Variables:** `callback_hours`, `on_call_hours`, `roc_callback_hours`, `roc_on_call_hours`, `non_roc_callback_hours`, `non_roc_on_call_hours`

**Threshold:** > 30% overall → warning/medium

**Example Finding:**
> "Callbacks represent 34.2% of on-call hours (420h of 1,228h), exceeding the 30% flag. ROC rate: 51.3%, Non-ROC rate: 8.7%."

---

### `oncall_pct_of_total`
On-call as a percentage of total hours.

**Variables:** `on_call_hours`, `total_hours`

**Threshold:** > 15% → warning/medium

**Example Finding:**
> "On-call hours are 12.4% of total hours — within threshold."

---

### `roc_vs_nonroc_callback_rate`
ROC vs non-ROC callback conversion rate against BSMH benchmarks.

**Known Benchmarks:**
- ROC expected: ~49%
- Non-ROC expected: ~10%

**Variables:** `roc_callback_hours`, `roc_on_call_hours`, `non_roc_callback_hours`, `non_roc_on_call_hours`

**Threshold:** Deviation > 10 percentage points from benchmark → warning/medium

**Example Finding:**
> "ROC callback rate (51.3%) deviates 2.3pp from BSMH benchmark (~49%). Non-ROC rate (8.7%) deviates 1.3pp from benchmark (~10%)."

**Discussion Questions:**
- What explains the deviation from BSMH benchmark callback rates?
- Are specific facilities driving the ROC/non-ROC divergence?

---

### `callback_minimum_guarantee`
Callback minimum guarantee compliance.

**Variables:** `callback_minimum_violations`, `total_callbacks`

**Status Mapping:**
- Any violations → fail/high

**Example Finding:**
> "3 of 142 callbacks (2.1%) did not meet the minimum guarantee pay requirement."

---

### `short_gap_callback`
Short gap (< 8h) between shift end and callback.

**Variables:** `short_gap_instances`, `total_callbacks`

**Threshold:** < 8h gap → warning/medium

**Example Finding:**
> "8 of 142 callbacks (5.6%) occurred within 8 hours of the employee's prior shift end — potential rest violation."

---

### `multiple_callbacks_per_period`
Employees with multiple callbacks per on-call period.

**Variables:** `employees_with_multiple_callbacks`, `total_employees_with_callbacks`

**Threshold:** > 25% of callback employees → warning/medium

**Example Finding:**
> "12 of 45 employees (26.7%) with callbacks had multiple callbacks in a single on-call period."

## Scenarios

None defined.

## Key Variables

| Variable | Description |
|----------|-------------|
| `callback_hours` | Total callback hours |
| `on_call_hours` | Total on-call hours |
| `roc_callback_hours` | Callback hours in ROC |
| `roc_on_call_hours` | On-call hours in ROC |
| `non_roc_callback_hours` | Callback hours in non-ROC |
| `non_roc_on_call_hours` | On-call hours in non-ROC |
| `callback_minimum_violations` | Count of minimum guarantee violations |
| `total_callbacks` | Total callback events |
| `short_gap_instances` | Count of callbacks within 8h of prior shift |
| `employees_with_multiple_callbacks` | Count of employees with multiple callbacks per period |
| `total_employees_with_callbacks` | Count of employees with any callbacks |

## Thresholds Summary

| Threshold | Value | Severity |
|-----------|-------|----------|
| Callback % of on-call | > 30% | medium |
| On-call % of total | > 15% | medium |
| ROC callback benchmark | ~49% | — |
| Non-ROC callback benchmark | ~10% | — |
| Benchmark deviation | > 10pp | medium |
| Short gap | < 8h | medium |
| Multiple callbacks | > 25% of callback employees | medium |

## Known BSMH Context

- **ROC callback rate:** ~49% (much higher than non-ROC ~10%).
- ROC segmentation is a primary axis for callback analysis.
