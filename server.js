require('dotenv').config();
console.log('MONGO_URI:', process.env.MONGO_URI);
console.log('CLERK_SECRET_KEY:', process.env.CLERK_SECRET_KEY);

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { clerkClient, ClerkExpressWithAuth } = require('@clerk/clerk-sdk-node');

const app = express();

// CORS Middleware
const cors = require("cors");
app.use(cors({ origin: "*", credentials: true }));

app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

const authMiddleware = ClerkExpressWithAuth();

const taxSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  annualIncome: Number,
  investments: Number,
  otherDeductions: Number,
  otherIncome: Number,
  taxableIncome: Number,
  taxPayable: Number,
  suggestion: String,
  createdAt: { type: Date, default: Date.now },
});
const TaxRecord = mongoose.model('taxrecords', taxSchema);

const userSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  firstName: String,
  lastName: String,
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});
const User = mongoose.model('User', userSchema);

function calculateTax(taxableIncome) {
  let tax = 0;
  if (taxableIncome <= 300000) {
    tax = 0;
  } else if (taxableIncome <= 600000) {
    tax = (taxableIncome - 300000) * 0.05;
  } else if (taxableIncome <= 900000) {
    tax = (600000 - 300000) * 0.05 + (taxableIncome - 600000) * 0.2;
  } else {
    tax = (600000 - 300000) * 0.05 + (900000 - 600000) * 0.2 + (taxableIncome - 900000) * 0.3;
  }
  tax += tax * 0.04;
  return Math.round(tax);
}

app.post('/api/tax/calculate', authMiddleware, async (req, res) => {
  try {
    const userId = req.auth.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: No user found.' });
    }

    let userRecord = await User.findOne({ clerkId: userId });

    if (!userRecord) {
      try {
        const clerkUser = await clerkClient.users.getUser(userId);
        const email = clerkUser.emailAddresses?.[0]?.emailAddress || '';

        userRecord = await User.findOne({ email });

        if (!userRecord) {
          const newUser = new User({
            clerkId: userId,
            firstName: clerkUser.firstName || '',
            lastName: clerkUser.lastName || '',
            email: email,
          });
          userRecord = await newUser.save();
        } else {
          if (!userRecord.clerkId) {
            userRecord.clerkId = userId;
            await userRecord.save();
          }
        }
      } catch (err) {
        console.error("Error fetching user details from Clerk:", err);
      }
    }

    const { annualIncome, investments, otherDeductions, otherIncome } = req.body;
    if (!annualIncome) return res.status(400).json({ error: 'Annual income is required' });

    const taxableIncome =
      Number(annualIncome) - (Number(investments) || 0) - (Number(otherDeductions) || 0) + (Number(otherIncome) || 0);
    const taxPayable = calculateTax(taxableIncome);
    const suggestion = taxPayable > 0
      ? 'Consider investing in tax-saving instruments to reduce your tax liability.'
      : 'No tax liability!';

    const taxRecord = new TaxRecord({
      userId,
      annualIncome,
      investments,
      otherDeductions,
      otherIncome,
      taxableIncome,
      taxPayable,
      suggestion,
    });

    await taxRecord.save();
    res.json({ taxableIncome, taxPayable, suggestion });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/tax/records', authMiddleware, async (req, res) => {
  try {
    const userId = req.auth.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: No user found.' });
    }
    const records = await TaxRecord.find({ userId }).sort({ createdAt: -1 });
    res.json(records);
  } catch (err) {
    console.error('Error fetching records:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/', (req, res) => {
  res.send('Tax Calculator API is running with Clerk Authentication.');
});

const PORT = process.env.PORT || 5110;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
