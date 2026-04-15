import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Mock Plaid Endpoints (Structure for real implementation)
  app.post("/api/create_link_token", async (req, res) => {
    // In a real app, you'd use the Plaid SDK here
    res.json({ link_token: "mock_link_token_" + Math.random().toString(36).substring(7) });
  });

  app.post("/api/set_access_token", async (req, res) => {
    res.json({ status: "success" });
  });

  app.get("/api/transactions", async (req, res) => {
    // Mock transactions in INR
    const transactions = [
      { id: "1", date: "2026-04-01", name: "BigBasket", amount: 1250.50, category: ["Food and Drink", "Groceries"] },
      { id: "2", date: "2026-04-03", name: "Local Mandi", amount: 450.00, category: ["Food and Drink", "Groceries"] },
      { id: "3", date: "2026-04-05", name: "Reliance Fresh", amount: 820.20, category: ["Food and Drink", "Groceries"] },
      { id: "4", date: "2026-04-07", name: "Hotstar Subscription", amount: 499.00, category: ["Entertainment"] },
      { id: "5", date: "2026-04-08", name: "Zomato", amount: 350.00, category: ["Food and Drink", "Dining Out"] },
    ];
    res.json({ transactions });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
