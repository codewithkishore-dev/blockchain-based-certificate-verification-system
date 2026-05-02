const API = "http://localhost:3000";

/* LOGIN */
function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (email === "admin@gmail.com" && password === "1234") {
        window.location = "dashboard.html";
    } else {
        alert("Invalid login");
    }
}

/* NAVIGATION */
function goUpload() {
    window.location = "upload.html";
}

function goVerify() {
    window.location = "verify.html";
}

/* OTP GENERATE */
function generateOTP() {
    const certId = document.getElementById("certId").value;
    const mobile = document.getElementById("mobile").value;

    if (!certId || !mobile) {
        alert("Enter Certificate ID and Mobile");
        return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    localStorage.setItem("otp", otp);
    localStorage.setItem("certId", certId);

    const issueDate = new Date().toLocaleDateString();
    localStorage.setItem("issueDate", issueDate);

    alert("Your OTP is: " + otp);

    window.location = "otp.html";
}

/* STORE CERTIFICATE IN BACKEND */
async function uploadCertificate() {
    const certId = localStorage.getItem("certId");
    const name = "R. Kishore";

    await fetch(API + "/upload", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ certId, name })
    });
}

/* OTP VERIFY */
async function verifyOTP() {
    const userOtp = document.getElementById("otpInput").value;
    const realOtp = localStorage.getItem("otp");

    if (userOtp == realOtp) {

        // STORE CERTIFICATE
        await uploadCertificate();

        window.location = "certificate.html";
    } else {
        alert("Invalid OTP");
    }
}

/* VERIFY CERTIFICATE (PUBLIC PAGE) */
async function verifyCert() {
    const certId = document.getElementById("certId").value;

    const box = document.getElementById("resultBox");

    if (!certId) {
        alert("Enter Certificate ID");
        return;
    }

    box.innerHTML = "Checking...";

    try {
        const res = await fetch("http://127.0.0.1:3000/verify", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ certId: certId })
        });

        // 🔥 DEBUG
        console.log("Response status:", res.status);

        const data = await res.json();

        console.log("Data:", data);

        if (data.status.includes("Valid")) {
            box.innerHTML = `
                <h3 style="color:lime;">✅ Certificate Valid</h3>
                <p><b>Name:</b> ${data.name}</p>
                <p><b>Hash:</b> ${data.hash}</p>
            `;
        } else {
            box.innerHTML = `
                <h3 style="color:red;">❌ Certificate Invalid</h3>
            `;
        }

    } catch (err) {
        console.error("ERROR:", err);
        box.innerHTML = `<p style="color:red;">Server Error</p>`;
    }
}

/* DOWNLOAD PDF */
function downloadPDF() {
    const element = document.querySelector(".certificate");
    html2pdf().from(element).save("certificate.pdf");
}
