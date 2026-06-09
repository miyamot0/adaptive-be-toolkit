export interface TOCItem {
  level: number; // Heading level (1-6)
  title: string; // Display text
  id: string; // Anchor ID
  children?: TOCItem[]; // Nested items for deeper levels
}
