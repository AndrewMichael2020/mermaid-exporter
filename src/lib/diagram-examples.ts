export interface DiagramExample {
  title: string;
  description: string;
  category: string;
  code: string;
}

export const diagramExamples: DiagramExample[] = [
  {
    title: "Patient Triage Flowchart",
    description: "Visualizes the patient assessment and routing process in an emergency department.",
    category: "Clinical Workflow",
    code: `graph TD
    A[Patient Arrives] --> B{Initial Triage};
    B -- Critical --> C[Resuscitation Bay];
    B -- Urgent --> D[Main Treatment Area];
    B -- Non-Urgent --> E[Waiting Room];
    E --> F[Re-assessment];
    F --> D;
    C --> G[Admit to ICU];
    D --> H{Discharge or Admit?};
    H -- Discharge --> I[Discharge Lounge];
    H -- Admit --> J[Admit to Ward];`
  },
  {
    title: "EHR Data Request",
    description: "Sequence of events for a clinic requesting patient records from a central lab.",
    category: "Health Informatics",
    code: `sequenceDiagram
  participant Clinic as Primary Care Clinic
  participant EHR as Electronic Health Record API
  participant Lab as Pathology Lab System

  Clinic->>EHR: Request lab results for Patient X
  activate EHR
  EHR->>Lab: Query for Patient X records
  activate Lab
  Lab-->>EHR: Return results
  deactivate Lab
  EHR-->>Clinic: Display lab results
  deactivate EHR`
  },
  {
    title: "Hospital Org Chart",
    description: "Shows the hierarchical structure of a hospital's leadership.",
    category: "Administration",
    code: `graph TD
    subgraph Hospital Leadership
        A(CEO)
        subgraph Medical Staff
            B(Chief Medical Officer)
            B --> D(Head of Surgery)
            B --> E(Head of Medicine)
        end
        subgraph Operations
            C(Chief Operating Officer)
            C --> F(Director of Nursing)
            C --> G(Facilities Manager)
        end
        A --> B
        A --> C
    end`
  },
  {
    title: "Patient State Diagram",
    description: "Tracks the status of a patient from admission to discharge.",
    category: "Clinical Workflow",
    code: `stateDiagram-v2
  [*] --> Admitted
  Admitted --> In_Surgery: Undergoes Procedure
  In_Surgery --> Post_Op_Care: Recovers
  Post_Op_Care --> Discharged: Medically Cleared
  Discharged --> [*]`
  },
  {
    title: "Clinical Trial Timeline",
    description: "A Gantt chart outlining the phases of a new drug trial.",
    category: "Research",
    code: `gantt
  title Drug XYZ Clinical Trial
  dateFormat  YYYY-MM-DD
  section Phase 1
    Recruitment :a1, 2024-01-01, 30d
    Initial Dosing :after a1, 60d
  section Phase 2
    Efficacy Study :2024-04-01, 120d
  section Data Analysis
    Final Analysis :2024-08-01, 45d
    FDA Submission :after Final Analysis, 15d`
  },
  {
    title: "ER Diagram: Patient Records",
    description: "A simple database schema for patients, doctors, and appointments.",
    category: "Health Informatics",
    code: `erDiagram
  PATIENT ||--o{ APPOINTMENT : "schedules"
  DOCTOR ||--o{ APPOINTMENT : "attends"
  PATIENT {
    int patient_id PK
    string name
    date date_of_birth
  }
  DOCTOR {
    int doctor_id PK
    string name
    string specialty
  }
  APPOINTMENT {
    int appointment_id PK
    datetime time
    string reason
  }`
  },
  {
    title: "Public Health Campaign Mindmap",
    description: "Brainstorming key areas for a community flu shot campaign.",
    category: "Epidemiology",
    code: `mindmap
  root((Flu Shot Campaign))
    Outreach
      Social Media
      Community Clinics
      Flyers & Posters
    Logistics
      Vaccine Supply
      Staffing
      Locations
    Target Groups
      Seniors (65+)
      Healthcare Workers
      Schools`
  },
  {
    title: "Outbreak Investigation Timeline",
    description: "Chronological events during an epidemiological investigation.",
    category: "Epidemiology",
    code: `timeline
  title Norovirus Outbreak Investigation
  2024-01-10 : First case reported
  2024-01-11 : Public Health unit notified
  2024-01-12 : Epidemiological interviews begin
             : Lab samples collected
  2024-01-14 : Source identified (Restaurant A)
  2024-01-15 : Public announcement`
  },
  {
    title: "Patient Journey Map",
    description: "Mapping the patient experience from booking to follow-up.",
    category: "Patient Experience",
    code: `journey
    title Primary Care Visit for Chronic Condition
    section Booking
      Finds clinic online: 5: Patient
      Books appointment via phone: 4: Patient
    section Visit
      Check-in: 3: Patient
      Consultation with GP: 5: Patient
      Receives prescription: 5: Patient
    section Follow-up
      Books follow-up test: 4: Patient
      Receives results via portal: 5: Patient`
  }
];
