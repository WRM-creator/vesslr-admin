export interface Customer {
  id: string;
  name: string;
  email: string;
  company: string;
  role: "buyer" | "seller" | "admin";
  status: "active" | "suspended" | "pending";
  trustScore: number;
  dateRegistered: string; // ISO date string
}

export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: "cus_01",
    name: "John Doe",
    email: "john@acme.com",
    company: "Acme Corp",
    role: "seller",
    status: "active",
    trustScore: 95,
    dateRegistered: "2024-01-15T10:00:00Z",
  },
  {
    id: "cus_02",
    name: "Jane Smith",
    email: "jane@globaltech.com",
    company: "Global Tech",
    role: "buyer",
    status: "pending",
    trustScore: 70,
    dateRegistered: "2024-02-01T14:30:00Z",
  },
  {
    id: "cus_03",
    name: "Bob Wilson",
    email: "bob@logistics.com",
    company: "Wilson Logistics",
    role: "seller",
    status: "suspended",
    trustScore: 45,
    dateRegistered: "2023-11-20T09:15:00Z",
  },
  {
    id: "cus_04",
    name: "Alice Brown",
    email: "alice@brownco.com",
    company: "Brown & Co",
    role: "buyer",
    status: "active",
    trustScore: 88,
    dateRegistered: "2024-03-10T11:45:00Z",
  },
  {
    id: "cus_05",
    name: "Charlie Davis",
    email: "charlie@davisent.com",
    company: "Davis Enterprises",
    role: "seller",
    status: "active",
    trustScore: 92,
    dateRegistered: "2024-01-05T16:20:00Z",
  },
  {
    id: "cus_06",
    name: "Eve Miller",
    email: "eve@miller.com",
    company: "Miller Inc",
    role: "buyer",
    status: "active",
    trustScore: 85,
    dateRegistered: "2024-03-15T09:00:00Z",
  },
  {
    id: "cus_07",
    name: "Frank White",
    email: "frank@white.com",
    company: "White Ltd",
    role: "seller",
    status: "pending",
    trustScore: 65,
    dateRegistered: "2024-03-18T11:00:00Z",
  },
  {
    id: "cus_08",
    name: "Grace Green",
    email: "grace@green.com",
    company: "Green Solutions",
    role: "buyer",
    status: "active",
    trustScore: 90,
    dateRegistered: "2024-03-20T13:00:00Z",
  },
  {
    id: "cus_09",
    name: "Henry Black",
    email: "henry@black.com",
    company: "Black Industries",
    role: "seller",
    status: "active",
    trustScore: 82,
    dateRegistered: "2024-03-22T15:00:00Z",
  },
  {
    id: "cus_10",
    name: "Ivy Gold",
    email: "ivy@gold.com",
    company: "Gold Standard",
    role: "buyer",
    status: "active",
    trustScore: 89,
    dateRegistered: "2024-03-25T10:00:00Z",
  },
  {
    id: "cus_11",
    name: "Jack Silver",
    email: "jack@silver.com",
    company: "Silver Lake",
    role: "seller",
    status: "active",
    trustScore: 94,
    dateRegistered: "2024-03-28T12:00:00Z",
  },
];
