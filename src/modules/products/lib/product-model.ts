export interface Product {
  id: string;
  name: string;
  category: string;
  merchant: string;
  status: "active" | "draft" | "archived" | "out_of_stock";
  created: string; // ISO date string
  price: number;
  transactionType: "buy" | "lease" | "rental" | "auction";
  currency: string;
}

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "prod_01",
    name: "Wireless Noise-Canceling Headphones",
    category: "Electronics",
    merchant: "TechWorld Inc.",
    status: "active",
    created: "2024-03-15T10:00:00Z",
    price: 299.99,
    transactionType: "buy",
    currency: "USD",
  },
  {
    id: "prod_02",
    name: "Ergonomic Office Chair",
    category: "Furniture",
    merchant: "Office Supplies Co.",
    status: "out_of_stock",
    created: "2024-02-20T14:30:00Z",
    price: 349.5,
    transactionType: "buy",
    currency: "USD",
  },
  {
    id: "prod_03",
    name: "Mountain Bike Rental (Daily)",
    category: "Sports & Outdoors",
    merchant: "Adventure Gear",
    status: "active",
    created: "2024-04-01T09:15:00Z",
    price: 45.0,
    transactionType: "rental",
    currency: "USD",
  },
  {
    id: "prod_04",
    name: "Vintage Camera Lens",
    category: "Photography",
    merchant: "Retro Cam Store",
    status: "archived",
    created: "2023-12-10T11:45:00Z",
    price: 150.0,
    transactionType: "auction",
    currency: "USD",
  },
  {
    id: "prod_05",
    name: "Commercial Coffee Machine",
    category: "Appliances",
    merchant: "Brew Masters",
    status: "draft",
    created: "2024-01-05T16:20:00Z",
    price: 2500.0,
    transactionType: "lease",
    currency: "USD",
  },
  {
    id: "prod_06",
    name: "Smart Watch Series 5",
    category: "Electronics",
    merchant: "Gadget Hub",
    status: "active",
    created: "2024-03-25T13:10:00Z",
    price: 399.0,
    transactionType: "buy",
    currency: "USD",
  },
  {
    id: "prod_07",
    name: "Construction Excavator",
    category: "Heavy Machinery",
    merchant: "BuildIt Heavy",
    status: "active",
    created: "2024-01-20T08:00:00Z",
    price: 150000.0,
    transactionType: "lease",
    currency: "USD",
  },
];
