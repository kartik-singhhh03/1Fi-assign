const express = require('express');
const prisma = require('../prisma');

const router = express.Router();

// Prisma Decimal → string keeps money exact in JSON (no float rounding).
function decimalToString(value) {
  if (value === null || value === undefined) {
    return null;
  }

  return value.toString();
}

function serializeProduct(product) {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    brand: product.brand,
    description: product.description,
    mrp: decimalToString(product.mrp),
    price: decimalToString(product.price),
    createdAt: product.createdAt,
  };
}

function serializeVariant(variant) {
  return {
    id: variant.id,
    name: variant.name,
    value: variant.value,
    image: variant.image,
  };
}

function serializeEmiPlan(plan) {
  return {
    id: plan.id,
    tenure: plan.tenure,
    monthlyAmount: decimalToString(plan.monthlyAmount),
    interestRate: decimalToString(plan.interestRate),
    cashback: decimalToString(plan.cashback),
  };
}

// GET /api/products — lightweight product list (no variants / EMI plans)
router.get('/', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
        brand: true,
        description: true,
        mrp: true,
        price: true,
        createdAt: true,
      },
    });

    res.status(200).json({
      success: true,
      products: products.map(serializeProduct),
    });
  } catch (error) {
    console.error('GET /api/products failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
    });
  }
});

// GET /api/products/:slug — one product with variants and EMI plans
router.get('/:slug', async (req, res) => {
  const { slug } = req.params;

  if (!slug) {
    return res.status(400).json({
      success: false,
      message: 'Product slug is required',
    });
  }

  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        variants: true,
        emiPlans: {
          orderBy: { tenure: 'asc' },
        },
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      product: {
        ...serializeProduct(product),
        variants: product.variants.map(serializeVariant),
        emiPlans: product.emiPlans.map(serializeEmiPlan),
      },
    });
  } catch (error) {
    console.error(`GET /api/products/${slug} failed:`, error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
    });
  }
});

module.exports = router;
