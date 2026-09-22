# TRAC REQUEST - Registrar Queuing System with Notification

**Tawi-Tawi Regional Agricultural College**

Rebuilt from MSU-TCTO architecture by converting all school-specific constants into configurable TRAC data. Keeps current queue/auth/status workflow for v1 to reduce risk.

## 🌱 TRAC Color Theme

- **Primary Green**: `#1B5E20` (Deep Agricultural Green)
- **Primary Light**: `#2E7D32`
- **Secondary Gold**: `#F9A825` (Harvest Gold)
- **Secondary Dark**: `#F57F17`
- **Accent**: `#33691E`
- **Background**: `#F1F8E9`

Legacy MSU colors (`#7A0019` maroon, `#0038A8` blue) mapped to TRAC green/gold for easy migration.

## 🏫 Academic Programs (Configurable)

All programs are defined in `src/config/trac.config.js`:

### Institute of Computing Studies (ICS)
- **BSIT** – Bachelor of Science in Information Technology
- **BSIS** – Bachelor of Science in Information Systems

### Institute of Social and Criminal Justice Studies (ISCJS)
- **BSCRIM** – Bachelor of Science in Criminology

### Institute of Vocational and Technical Education Studies (IVTES)
- **BTVTED** – Bachelor of Technical-Vocational Teacher Education
- **BTLED** – Bachelor of Technology and Livelihood Education
- **BSHM** – Bachelor of Science in Hospitality Management
- **BSHRRM** – Bachelor of Science in Hotel and Restaurant Resource Management
- **BSHT** – Bachelor of Science in Hospitality and Tourism

### Institute of Agricultural Sciences (IAS)
- **BSA** – Bachelor of Science in Agriculture
- **BSF** – Bachelor of Science in Forestry
- **BSAB** – Bachelor of Science in Agribusiness

### Graduate Studies (GS)
- **MAEd** – Master of Arts in Education
- **MSA** – Master of Science in Agriculture
- **MSAgEd** – Master of Science in Agricultural Education
- **MSAg.Mgt.** – Master of Science in Agricultural Management

## 📋 Manual Process (Documented in Config)

### General Request Process
Before proceeding, follow process indicated in Question No. 6. Depending on number of requests, wait in line for some time before document is released.

### TOR Process
1. Proceed to respective department and obtain clearance
2. Library clearance
3. Cashier
4. Registrar's Office
5. Return to cashier, if required
6. Wait for TOR to be processed

**Requirements**: Bound thesis, Diploma, Permanent Record

### COG Process
1. Obtain Evaluation Form from department
2. Fill out completely
3. Bring green form to cashier and pay fee
4. Return to Registrar and submit
5. Wait for release

### Adding Form Process
1. Obtain Adding Form from Registrar
2. Fill out completely
3. Proceed to faculty in charge
4. Have approval/signature completed

### COR Process
1. Obtain Official Receipt (OR) from Cashier
2. Proceed to Registrar for processing
3. Wait for release

### Honorable Dismissal
1. Obtain OR from Cashier
2. Proceed to appropriate department
3. Follow department processing requirements

### Shifting Form
1. Obtain Shifting Form and Evaluation Form from current department
2. Complete info and signatures
3. Submit to department where student wishes to shift

### INC Form
Same as COR process, but can be released immediately because pre-printed.

## 💰 Document Fees (TRAC)

| Document / Request | Fee |
|---|---|
| Transcript of Records (TOR) | ₱100 per page |
| Certificate of Registration (COR) | ₱20 |
| Certificate of Grades (COG) | ₱20 |
| General Weighted Average (GWA) | ₱70 |
| Certification, Authentication, and Verification (CAV) | ₱50 |
| Incomplete (INC) Form | ₱15 per subject |
| Golden Seal | ₱30 |
| Documentary Stamp | ₱50 |
| Honorable Dismissal | ₱50 |
| Requesting Form | ₱20 |

## 🕒 Office Schedule

- **Days**: Monday to Friday
- **Morning**: 8:00 AM – 11:45 AM
- **Afternoon**: 1:00 PM – 5:00 PM
- **Lunch Break**: 11:45 AM – 1:00 PM (Closed)
- **Weekends**: Closed
- **Processing**: First-come, first-served basis

## 🏗️ Architecture

### Central Config
Single file: `src/config/trac.config.js` contains:

- `SCHOOL` - identity, logo, contact
- `THEME` - colors, gradients
- `OFFICE` - schedule, processing, pickup requirements
- `PROGRAMS` - institutes and programs
- `DEPARTMENTS`, `ALL_COURSES`, `COURSE_DEPARTMENT_MAP`, `DEPARTMENT_COURSE_MAP`
- `DOCUMENTS`, `FORMS`, `DOCUMENT_FEES`
- `MANUAL_PROCESSES`
- `ABBREVIATIONS`
- `SYSTEM` - apiBaseUrl, queue settings, auth rules (preserved workflow)

### Workflow Preserved for v1
- Queue: real-time monitor, pending_count, current_serving, last_queue_number
- Auth: ID 00-00000, email verification, forgot password via OTP, JWT token
- Status: pending → processing → ready → claimed / rejected

Future v2 enhancements: fee formulas (per page, per subject), richer policy rules.

### UI
- Keeps current layout, swaps MSU maroon/blue to TRAC green/gold
- All pages use `THEME` and `SCHOOL` from config
- Tailwind extended with `trac` colors
- CSS variables in `index.css`

## 🚀 Getting Started

```bash
npm install
npm run dev
# Backend expected at http://localhost:5000/api
```

Vite dev server binds to 0.0.0.0 for preview: https://{port}-{sandboxId}.e2b.app

## 📁 Project Structure

```
src/
  config/
    trac.config.js   # Single central TRAC config
    index.js
  student/
    components/
      Navbar.jsx     # TRAC logo, green theme
      Card.jsx
      Button.jsx     # TRAC green/gold variants
    pages/
      LandingPage.jsx
      AuthPage.jsx   # Uses TRAC institutes
      Dashboard.jsx
      RequestDocument.jsx # TRAC fees fallback
      TrackStatus.jsx
      RequestSubmitted.jsx
      Profile.jsx
      PrivacyNotice.jsx
      NeedHelp.jsx
      FAQ.jsx
  App.jsx
  index.css          # TRAC CSS variables
public/
  TRAC_Logo.png
  Msu-Tcto_Logo.jpg  # fallback
```

## 🔄 Migration from MSU-TCTO

1. Replace `Msu-Tcto_Logo.jpg` usage with `SCHOOL.logo` (TRAC_Logo.png)
2. Replace hardcoded departments/courses with `DEPARTMENTS` etc.
3. Replace `#7A0019` → `THEME.primary` `#1B5E20`
4. Replace `#0038A8` → `THEME.primaryLight` `#2E7D32`
5. Replace school name strings with `SCHOOL.fullName`, `SCHOOL.systemName`
6. Fees from `DOCUMENT_FEES` (TRAC table)
7. Office hours from `OFFICE.schedule`

All done in this branch.

## 📄 License

Private - TRAC Internal
