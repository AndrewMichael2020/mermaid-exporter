export interface DiagramExample {
  title: string;
  description: string;
  category: string;
  code: string;
}

export const diagramExamples: DiagramExample[] = [
  // --- Existing ---
  {
    title: "Flowchart",
    description: "Standard process flow with decisions.",
    category: "Basic",
    code: `graph TD
  A[Start] --> B{Decision?}
  B -- Yes --> C[Action OK]
  B -- No --> D[Action FAIL]
  C --> E[End]
  D --> E`
  },
  {
    title: "Sequence Diagram",
    description: "Interaction between participants over time.",
    category: "UML",
    code: `sequenceDiagram
  participant Alice
  participant Bob
  Alice->>Bob: Hello Bob
  Bob-->>Alice: Hi Alice`
  },
  {
    title: "Class Diagram",
    description: "Structure of a system showing classes and relationships.",
    category: "UML",
    code: `classDiagram
  class Person {
    +String name
    +int age
    +walk()
  }
  class Student {
    +int studentId
    +int marks
    +study()
  }
  Person <|-- Student`
  },
  {
    title: "State Diagram",
    description: "Finite state machine visualization.",
    category: "UML",
    code: `stateDiagram-v2
  [*] --> Idle
  Idle --> Running : start
  Running --> Paused : pause
  Paused --> Running : resume
  Paused --> [*] : stop`
  },
  {
    title: "Gantt Chart",
    description: "Project schedule and timeline.",
    category: "Business",
    code: `gantt
  title Project Timeline
  dateFormat  YYYY-MM-DD
  section Phase 1
    Task A       :a1, 2023-01-01, 10d
    Task B       :after a1, 7d
  section Phase 2
    Milestone    :milestone, 2023-01-25, 0d`
  },
  {
    title: "Pie Chart",
    description: "Simple distribution visualization.",
    category: "Business",
    code: `pie
  title Browser Usage
  "Chrome"  : 60
  "Firefox" : 25
  "Edge"    : 15`
  },
  {
    title: "ER Diagram",
    description: "Entity Relationship diagram for database modeling.",
    category: "Database",
    code: `erDiagram
  CUSTOMER ||--o{ ORDER : places
  ORDER ||--|{ LINE_ITEM : contains
  CUSTOMER {
    string name
    string address
  }`
  },
  {
    title: "Mindmap",
    description: "Hierarchical mind map for brainstorming.",
    category: "Creative",
    code: `mindmap
  root((Life))
    Origins
      Earth
      Mars
    Journey
      Climb
      Ski`
  },
  {
    title: "Timeline",
    description: "Chronological event visualization with sections.",
    category: "Business",
    code: `timeline
  title AI History
  section Early Days
    1956 : Dartmouth Workshop
    1965 : ELIZA
  section Modern Era
    2012 : AlexNet
    2022 : GPT-3.5`
  },
  {
    title: "Git Graph",
    description: "Visualization of git commits and branches.",
    category: "Developer",
    code: `gitGraph
  commit
  branch develop
  commit
  checkout main
  merge develop
  commit`
  },
  {
    title: "Quadrant Chart",
    description: "XY matrix for prioritizing items.",
    category: "Business",
    code: `quadrantChart
  title Risk vs Reward
  x-axis Low Risk --> High Risk
  y-axis Low Reward --> High Reward
  quadrant-1 We should expand
  quadrant-2 Need to promote
  quadrant-3 Re-evaluate
  quadrant-4 May be improved
  "Campaign A": [0.3, 0.6]
  "Campaign B": [0.45, 0.23]
  "Campaign C": [0.57, 0.69]
  "Campaign D": [0.78, 0.34]`
  },
  // --- New Additions ---
  {
    title: "Org Chart",
    description: "Visualize hierarchical structures like company teams.",
    category: "Business",
    code: `graph TD
    subgraph Company
        c(CEO)
        subgraph Tech
            cto(CTO)
            cto --> dev1(Developer)
            cto --> dev2(Developer)
        end
        subgraph HR
            h(HR Manager)
        end
        c --> cto
        c --> h
    end`
  },
  {
    title: "User Journey",
    description: "Map out the steps and experiences of a user.",
    category: "UX",
    code: `journey
    title User Onboarding
    section Visit
      Landing Page: 5: User
      Signup Form: 3: User
    section Use
      Tutorial: 4: New User
      First Project: 2: New User`
  },
  {
    title: "Requirement Diagram",
    description: "Model system requirements and their relationships.",
    category: "Systems",
    code: `requirementDiagram
  requirement req1 {
    id: 001
    text: System shall handle 10k req/s
  }
  requirement req2 {
    id: 002
    text: System shall encrypt all data
  }
  req1 --> req2`
  },
  {
    title: "Flowchart with Subgraphs",
    description: "Organize complex flowcharts into logical groups.",
    category: "Basic",
    code: `graph LR
  subgraph API
    A[Request] --> B[Validate]
  end
  subgraph Worker
    C[Process] --> D[Save]
  end

  B --> C`
  },
  {
    title: "C4 Diagram",
    description: "A lightweight model for software architecture.",
    category: "Systems",
    code: `C4Context
  title System Context for Mermaid Cloud Viz
  
  Person(user, "User")
  System(cloudViz, "Mermaid Cloud Viz", "Generates and enhances diagrams using AI.")
  
  System_Ext(genkit, "Google Genkit", "AI Framework")
  System_Ext(google, "Google AI", "Language Models")
  
  user -> cloudViz: Uses
  cloudViz -> genkit: Calls
  genkit -> google: Accesses Models`
  }
];
