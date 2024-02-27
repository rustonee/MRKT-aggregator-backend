const bcrypt = require("bcryptjs");

async function handler() {
    const hashedPassword = (await bcrypt.hash('plaintext', 10))
    console.log(hashedPassword);
}

async function main() {
    await handler();
}

main();
