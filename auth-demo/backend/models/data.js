// ============================================================
// In-Memory Data Store
// ============================================================
// This simulates a database for demo purposes.
// In production, use a real database with proper access controls.
// ============================================================

const users = {
  user1: {
    id: "user1",
    username: "alice",
    password: "password123",
    name: "Alice Johnson",
    phone: "9999999999",
    email: "alice@example.com",
  },
  user2: {
    id: "user2",
    username: "bob",
    password: "password456",
    name: "Bob Smith",
    phone: "8888888888",
    email: "bob@example.com",
  },
  admin: {
    id: "admin",
    username: "admin",
    password: "admin123",
    name: "Admin User",
    phone: "0000000000",
    email: "admin@example.com",
  },
};

const listings = [
  {
    id: "listing_1",
    title: "Vintage Camera",
    price: 250,
    sellerId: "user1",
    description: "Rare vintage film camera in mint condition.",
    // INSECURE: These private fields should only be visible to the seller
    sellerPhone: "9999999999",
    sellerEmail: "alice@example.com",
    privateNotes: "Price is negotiable. Original box included.",
  },
  {
    id: "listing_2",
    title: "Mountain Bike",
    price: 450,
    sellerId: "user1",
    description: "Almost new mountain bike, used twice.",
    sellerPhone: "9999999999",
    sellerEmail: "alice@example.com",
    privateNotes: "Selling because moving abroad.",
  },
  {
    id: "listing_3",
    title: "Guitar",
    price: 300,
    sellerId: "user2",
    description: "Acoustic guitar with hard case.",
    sellerPhone: "8888888888",
    sellerEmail: "bob@example.com",
    privateNotes: "Will include spare strings and tuner.",
  },
  {
    id: "listing_4",
    title: "Mechanical Keyboard",
    price: 120,
    sellerId: "user2",
    description: "Custom built mechanical keyboard with Cherry MX switches.",
    sellerPhone: "8888888888",
    sellerEmail: "bob@example.com",
    privateNotes: "Hand-wired prototype. No returns.",
  },
];

module.exports = { users, listings };
