const express = require("express");
const cors = require("cors");
const crypto = require("crypto");

const app = express();

app.use(cors());
app.use(express.json());

/* 🔐 TEMP STORAGE (for demo) */
let otpStore = {};
let certificates = [];

/* 🟢 TEST ROUTE */
app.get("/", (req, res) => {
    res.send("Server Running ✅");
});

/* 🔥 GENERATE OTP */
app.post("/generate-otp", (req, res) => {
    const { certId } = req.body;

    if (!certId) {
        return res.json({ status: "Certificate ID required" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    otpStore[certId] = otp;

    console.log(`OTP for ${certId}: ${otp}`);

    res.json({
        status: "OTP Sent",
        otp: otp // ⚠️ For demo (remove in real system)
    });
});

/* 🔥 VERIFY OTP */
app.post("/verify-otp", (req, res) => {
    const { certId, otp } = req.body;

    if (!otpStore[certId]) {
        return res.json({ status: "OTP not generated" });
    }

    if (otpStore[certId] == otp) {
        delete otpStore[certId]; // clear after use

        res.json({ status: "OTP Verified" });
    } else {
        res.json({ status: "Invalid OTP" });
    }
});

/* 🔥 STORE CERTIFICATE */
app.post("/upload", (req, res) => {
    const { certId, name } = req.body;

    if (!certId || !name) {
        return res.json({ status: "Missing data" });
    }

    const hash = crypto
        .createHash("sha256")
        .update(certId + name)
        .digest("hex");

    const cert = {
        certId,
        name,
        hash
    };

    certificates.push(cert);

    res.json({
        status: "Certificate Stored",
        hash: hash
    });
});

/* 🔍 VERIFY CERTIFICATE */
app.post("/verify", (req, res) => {
    const { certId } = req.body;

    const cert = certificates.find(c => c.certId === certId);

    if (cert) {
        res.json({
            status: "Valid Certificate ✔",
            name: cert.name,
            hash: cert.hash
        });
    } else {
        res.json({ status: "Invalid Certificate ❌" });
    }
});

/* 🚀 SERVER START */
app.listen(3000, () => {
    console.log("🚀 Server running on port 3000");
});
const express = require("express");
const path = require("path");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files (HTML/CSS/JS)
app.use(express.static(path.join(__dirname, "public")));

// Default route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Test route (for checking server is alive)
app.get("/health", (req, res) => {
    res.json({ status: "Server is running successfully 🚀" });
});

// IMPORTANT: Render uses process.env.PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});