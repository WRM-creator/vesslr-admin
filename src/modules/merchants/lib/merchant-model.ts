export interface Merchant {
  id: string;
  name: string;
  company: string;
  status: "active" | "suspended" | "pending";
  trustScore: number;
  dateRegistered: string; // ISO date string
}

export const MOCK_MERCHANTS: Merchant[] = [
  {
    id: "mer_01",
    name: "John Doe",
    company: "Acme Corp",
    status: "active",
    trustScore: 95,
    dateRegistered: "2024-01-15T10:00:00Z",
  },
  {
    id: "mer_02",
    name: "Jane Smith",
    company: "Global Tech",
    status: "pending",
    trustScore: 70,
    dateRegistered: "2024-02-01T14:30:00Z",
  },
  {
    id: "mer_03",
    name: "Bob Wilson",
    company: "Wilson Logistics",
    status: "suspended",
    trustScore: 45,
    dateRegistered: "2023-11-20T09:15:00Z",
  },
  {
    id: "mer_04",
    name: "Alice Brown",
    company: "Brown & Co",
    status: "active",
    trustScore: 88,
    dateRegistered: "2024-03-10T11:45:00Z",
  },
  {
    id: "mer_05",
    name: "Charlie Davis",
    company: "Davis Enterprises",
    status: "active",
    trustScore: 92,
    dateRegistered: "2024-01-05T16:20:00Z",
  },
];
