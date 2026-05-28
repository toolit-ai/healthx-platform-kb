# Role-Based Premiums Playbook

## Overview

| Attribute | Value |
|-----------|-------|
| **Slug** | `role_based_premiums` |
| **Name** | Role-Based Premiums |
| **Category** | `threshold_check` |
| **Status** | ✅ Fully Implemented |
| **ROC Segmentation** | No |
| **Required Tables** | `payroll`, `timekeeping` |
| **Required Columns** | `pay_code`, `role`, `hours_worked` |
| **Pay Code Patterns** | `PREC`, `CHRG`, `MTRN`, `PRECPT`, `CHARGE` |

## Description

Analysis of preceptor, charge nurse, and mandatory training pay hours. Flags sustained preceptor use suggesting operational role rather than training function. Examines premium as percentage of core hours and role/department concentration.

## Check Families

- `threshold_check`
- `concentration_analysis`
- `segment_variance`

## Checks

### `preceptor_hours_per_employee`
Preceptor hours per employee. Flags employees exceeding **100 hours/month**.

**Known BSMH High:** ~109 hrs/month for top employee.

**Variables:** `preceptor_hours_by_employee` (dict)

**Threshold:** > 100 hrs/month → warning/medium

**Example Finding:**
> "2 of 34 preceptors (5.9%) exceed 100 preceptor hours/month. BSMH known high is ~109 hrs/month. Top-10 concentration: 68.4%."

**Discussion Questions:**
- Are high preceptor-hour employees assigned to specific units or shifts?
- Does orientation end date data support the duration of preceptor assignment?

---

### `charge_nurse_hours`
Charge nurse hours concentration per employee.

**Variables:** `charge_nurse_hours_by_employee` (dict)

**Outputs:** Total hours, employee count, top-10 concentration, spread.

**Example Finding:**
> "Charge nurse hours: 1,240.0h across 45 employees. Top-10 concentration: 42.3%. Spread: 180.5%."

---

### `premium_pct_of_core`
Role premium hours as a percentage of core hours.

**Variables:** `role_premium_hours`, `core_hours`

**Threshold:** > 10% → warning/medium

**Example Finding:**
> "Role-based premium hours represent 12.4% of core hours (1,540h of 12,420h)."

---

### `sustained_use_check`
Sustained preceptor use — flag employees active > 3 consecutive months (operational role signal).

**Variables:** `employees_sustained_preceptor_use`, `total_preceptors`

**Threshold:** > 10% of preceptors show sustained use → warning/medium

**Example Finding:**
> "5 of 34 preceptors (14.7%) have been active >3 consecutive months, which may indicate an operational role rather than training."

**Discussion Questions:**
- Are sustained preceptors assigned to units with chronic preceptor shortages?
- Do these employees have active assignment linkages or orientation end dates?

---

### `mandatory_training_hours`
Mandatory training pay hours distribution by role and department.

**Variables:** `mandatory_training_hours_by_role`, `mandatory_training_hours_by_dept`

**Outputs:** Total training hours, role count, department count, spread percentages.

**Example Finding:**
> "Mandatory training hours: 420.0h. By role (6 roles, spread 145.2%). By dept (8 depts, spread 98.3%)."

**Discussion Questions:**
- Are mandatory training hours evenly distributed or concentrated in specific roles?
- Do departments with high training hours correlate with high turnover or new hire rates?

## Scenarios

None defined.

## Key Variables

| Variable | Description |
|----------|-------------|
| `pay_code` | Preceptor, charge nurse, training pay codes |
| `role` | Employee role |
| `hours_worked` | Hours worked |
| `preceptor_hours_by_employee` | Preceptor hours per employee |
| `charge_nurse_hours_by_employee` | Charge nurse hours per employee |
| `role_premium_hours` | Total role-based premium hours |
| `core_hours` | Total core hours |
| `employees_sustained_preceptor_use` | Count of preceptors active > 3 months |
| `total_preceptors` | Total preceptor count |
| `mandatory_training_hours_by_role` | Training hours per role |
| `mandatory_training_hours_by_dept` | Training hours per department |

## Thresholds Summary

| Threshold | Value | Severity |
|-----------|-------|----------|
| Preceptor hours per employee | > 100 hrs/month | medium |
| Premium % of core hours | > 10% | medium |
| Sustained preceptor use | > 10% of preceptors > 3 months | medium |

## Known BSMH Context

- **Preceptor high:** ~109 hrs/month for top employee.
- Sustained preceptor use suggests the employee may be performing an operational role rather than a training function.
- Active assignment linkage and orientation end date should be reviewed where available.
