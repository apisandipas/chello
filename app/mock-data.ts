export interface Card {
  id: string;
  title: string;
  description: string;
  labels: string[];
  createdAt: string;
}

export interface Column {
  id: string;
  title: string;
  cards: Card[];
}

export interface Board {
  id: string;
  title: string;
  columns: Column[];
}

export const mockBoard: Board = {
  id: "b0a54b27-2ca1-4e1c-8a2f-19d4d2c4c89a",
  title: "Project Tasks",
  columns: [
    {
      id: "c1d6e3f4-5a2b-4c8d-9e0f-1a2b3c4d5e6f",
      title: "To Do",
      cards: [
        {
          id: "card1-a1b2-c3d4-e5f6-g7h8i9j0k1l2",
          title: "Research new technologies",
          description: "Investigate latest frontend frameworks and tools",
          labels: ["research", "tech"],
          createdAt: new Date().toISOString(),
        },
        {
          id: "card2-b2c3-d4e5-f6g7-h8i9j0k1l2m3",
          title: "Update documentation",
          description: "Review and update project documentation",
          labels: ["documentation"],
          createdAt: new Date().toISOString(),
        },
      ],
    },
    {
      id: "c2e3f4g5-6b3c-4d5e-af1g-2b3c4d5e6f7g",
      title: "In Progress",
      cards: [
        {
          id: "card3-c3d4-e5f6-g7h8-i9j0k1l2m3n4",
          title: "Implement drag and drop",
          description: "Add dnd-kit functionality to board",
          labels: ["feature", "ui"],
          createdAt: new Date().toISOString(),
        },
      ],
    },
    {
      id: "c3f4g5h6-7c4d-5e6f-bg2h-3c4d5e6f7g8h",
      title: "Done",
      cards: [
        {
          id: "card4-d4e5-f6g7-h8i9-j0k1l2m3n4o5",
          title: "Setup project structure",
          description: "Initialize project and configure basic settings",
          labels: ["setup"],
          createdAt: new Date().toISOString(),
        },
      ],
    },
  ],
};
