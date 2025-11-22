export interface DiagramExample {
  title: string;
  description: string;
  category: string;
  code: string;
}

export const diagramExamples: DiagramExample[] = [
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
    description: "Chronological event visualization.",
    category: "Business",
    code: `timeline
  title Major Events
  2000 : Y2K
  2001 : 9/11
  2020 : COVID-19`
  },
  {
    title: "Sankey Diagram",
    description: "Flow visualization with weighted arrows.",
    category: "Data",
    code: `sankey-beta
  Source,Flow,5
  Flow,Destination,5`
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
  }
];
