export interface DiagramExample {
  title: string;
  description: string;
  category: string;
  diagramType: string;
  code: string;
}

export const diagramExamples: DiagramExample[] = [
  {
    title: "[Flowchart] Patient Triage Flowchart",
    description: "Visualizes the patient assessment and routing process in an emergency department.",
    category: "Clinical Workflow",
    diagramType: "flowchart",
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
    title: "[Flowchart] Radiology Workflow",
    description: "Tracks an imaging order from receipt to the final report being sent.",
    category: "Diagnostic Services",
    diagramType: "flowchart",
    code: `graph TD
    A[Imaging Order Received] --> B{Patient Check-in};
    B --> C[Perform Scan/X-Ray];
    C --> D[Image Quality Check];
    D -- OK --> E[Radiologist Review];
    D -- Redo --> C;
    E --> F[Report Dictated];
    F --> G[Report Transcribed & Signed];
    G --> H[Report Sent to Referring Dr.];`
  },
  {
    title: "[Journey] Patient Journey Map",
    description: "Mapping the patient experience across multiple roles from booking to follow-up.",
    category: "Patient Experience",
    diagramType: "journey",
    code: `journey
    title Primary Care Visit for Chronic Condition
    section Booking
      Finds clinic online: 5: Patient
      Books appointment via phone: 4: Patient, MOA
    section Visit
      Check-in & Vitals: 4: Patient, MOA
      Initial Assessment: 5: Nurse Practitioner
      Consultation with Doctor: 5: Patient, Doctor
      Receives prescription & referral: 5: Doctor
    section Follow-up
      Schedules specialist appt: 4: MOA
      Consultation with Specialist: 5: Patient, Specialist
      Receives results via portal: 5: Patient`
  },
  {
    title: "[Sequence] Lab Sample Journey",
    description: "A sequence diagram showing how a sample is processed from collection to analysis.",
    category: "Diagnostic Services",
    diagramType: "sequence",
    code: `sequenceDiagram
  participant Patient
  participant Phlebotomist
  participant LIS as Lab Information System
  participant Analyzer as Automated Analyzer

  Patient->>Phlebotomist: Arrives for blood draw
  Phlebotomist->>LIS: Scan requisition & print labels
  Phlebotomist->>Patient: Collect sample
  Phlebotomist->>LIS: Log sample as collected
  LIS->>Analyzer: Pre-authorize test
  Analyzer-->>LIS: Acknowledge`
  },
  {
    title: "[State] Disease Progression Model",
    description: "A state diagram modeling the potential stages of an infectious disease.",
    category: "Epidemiology",
    diagramType: "state",
    code: `stateDiagram-v2
    [*] --> Susceptible
    Susceptible --> Infected : Exposure
    Infected --> Recovered : Treatment/Immunity
    Infected --> Deceased : Complications
    Recovered --> Susceptible : Waning Immunity
    Recovered --> [*]
    Deceased --> [*]`
  },
  {
    title: "[Flowchart] Hospital Org Chart",
    description: "Shows the hierarchical structure of a hospital's leadership.",
    category: "Administration",
    diagramType: "flowchart",
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
    title: "[Gantt] Clinical Trial Timeline",
    description: "A Gantt chart outlining the phases of a new drug trial.",
    category: "Research",
    diagramType: "gantt",
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
    title: "[ER] ER Diagram: Patient Records",
    description: "A simple database schema for patients, doctors, and appointments.",
    category: "Health Informatics",
    diagramType: "er",
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
  APPOINTPOINTMENT {
    int appointment_id PK
    datetime time
    string reason
  }`
  },
  {
    title: "[Timeline] Outbreak Investigation Timeline",
    description: "Chronological events during an epidemiological investigation.",
    category: "Epidemiology",
    diagramType: "timeline",
    code: `timeline
  title Norovirus Outbreak Investigation
  2024-01-10 : First case reported
  2024-01-11 : Public Health unit notified
  2024-01-12 : Epidemiological interviews begin
             : Lab samples collected
  2024-01-14 : Source identified (Restaurant A)
  2024-01-15 : Public announcement`
  }
];
