// Copyright © MJDG 2026
import pg from "pg";
import bcrypt from "bcryptjs";

const { Pool } = pg;

const pool = new Pool({
    connectionString: "postgresql://mjdg@localhost:5432/mjdg-db01",
});

async function seed() {
    const test_username = "testuser";
    const test_firstName = "Test";
    const test_lastName = "User";
    const test_email = "test@test.com";
    const test_password = "password123";
    const hashedPassword = await bcrypt.hash(test_password, 10);

    await pool.query(
        `INSERT INTO "User" (username, email, hashed_password, "firstName", "lastName")
        VALUES ($1, $2, $3, $4, $5)`,
        [test_username, test_email, hashedPassword, test_firstName, test_lastName]
    );

    console.log("✅ Seed user created");
    await pool.end();
}

seed().catch(console.error);