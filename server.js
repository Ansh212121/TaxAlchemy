require('dotenv').config();
console.log('MONGO_URI:', process.env.MONGO_URI);
console.log('CLERK_SECRET_KEY:', process.env.CLERK_SECRET_KEY);

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { clerkClient, ClerkExpressWithAuth } = require('@clerk/clerk-sdk-node'); // Updated import

const app = express();

// List of allowed origins for production (add your deployed URLs here)
const allowedOrigins = ['https://tax-frontend-f0yfqjrkc-ansh-agarwals-projects-d1e0f0fa.vercel.app/'];

// Use a dynamic CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (e.g., mobile apps or curl requests)
    if (!origin) return callback(null, true);
    // Allow any localhost origin during development
    if (origin.includes('localhost')) {
      return callback(null, true);
    }
    // Allow production origins
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    console.error("Origin not allowed:", origin);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

// Use Clerk's authentication middleware
const authMiddleware = ClerkExpressWithAuth();

// ----- Define Schemas & Models ----- //

// Tax Record Schema
const taxSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Clerk's user ID
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

// User Schema - will be stored in the "users" collection
const userSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  firstName: String,
  lastName: String,
  email: String,
  createdAt: { type: Date, default: Date.now },
});
const User = mongoose.model('User', userSchema);

// ----- Helper Function ----- //
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
  tax += tax * 0.04; // Add Education Cess (4%)
  return Math.round(tax);
}

// ----- Routes ----- //

// Protected Route: Calculate & Store Tax Record and store User Details if not present
app.post('/api/tax/calculate', authMiddleware, async (req, res) => {
  try {
    const userId = req.auth.userId; // Clerk provides the user ID in req.auth
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: No user found.' });
    }
    
    // Check if the user details are stored in our database; if not, fetch from Clerk and store them.
    let userRecord = await User.findOne({ clerkId: userId });
    if (!userRecord) {
      try {
        const clerkUser = await clerkClient.users.getUser(userId); // Updated call
        const newUser = new User({
          clerkId: userId,
          firstName: clerkUser.firstName || '',
          lastName: clerkUser.lastName || '',
          email:
            (clerkUser.emailAddresses &&
              clerkUser.emailAddresses[0] &&
              clerkUser.emailAddresses[0].emailAddress) ||
            '',
        });
        userRecord = await newUser.save();
        console.log("Stored new user:", userRecord);
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

// Protected Route: Retrieve Tax Records for the Logged-in User
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

// Root Route
app.get('/', (req, res) => {
  res.send('Tax Calculator API is running with Clerk Authentication.');
});

const PORT = process.env.PORT || 5710;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
