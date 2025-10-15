async function checkPassword() {
  const input = document.getElementById("password").value;
  const hashedInput = await hash(input);

  // SHA-256 for "password123" (change this!)
  const correctHash = "50e9468381c3b24be12e34b6025d855ad51ed1218975d103c9600f20931e406e";

  if (hashedInput === correctHash) {
    localStorage.setItem("authorized", "true");
    window.location.href = "index.html";
  } else {
    document.getElementById("error").style.display = "block";
  }
}

async function hash(str) {
  const buffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}
