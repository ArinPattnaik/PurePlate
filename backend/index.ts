import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Search products by name, brand, or category
app.get('/api/products/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || typeof q !== 'string') {
      return res.status(400).json({ error: 'Query parameter q is required' });
    }
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { brand: { contains: q, mode: 'insensitive' } },
          { category: { contains: q, mode: 'insensitive' } },
        ],
      },
    });
    res.json(products);
  } catch {
    res.status(500).json({ error: 'Failed to search products' });
  }
});

// Get a single product by ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id },
    });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Get all INS codes
app.get('/api/ins', async (req, res) => {
  try {
    const insEntries = await prisma.insEntry.findMany();
    res.json(insEntries);
  } catch {
    res.status(500).json({ error: 'Failed to fetch INS entries' });
  }
});

// Get a single INS code by ID
app.get('/api/ins/:code', async (req, res) => {
  try {
    let { code } = req.params;
    if (!code.startsWith("INS ")) {
      code = "INS " + code;
    }
    const insEntry = await prisma.insEntry.findUnique({
      where: { code },
    });
    if (!insEntry) {
      return res.status(404).json({ error: 'INS entry not found' });
    }
    res.json(insEntry);
  } catch {
    res.status(500).json({ error: 'Failed to fetch INS entry' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
