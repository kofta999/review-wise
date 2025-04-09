import { exec, execSync } from "child_process";

function runCommand(command) {
	try {
		execSync(command, { stdio: "inherit" });
	} catch (error) {
		console.error(`Error executing command: ${command}`, error);
		process.exit(1);
	}
}

// Function to nuke and reinitialize the database
function nukeAndInitDB() {
	console.log("Nuking and reinitializing the database...");

	// Drop the existing database
	runCommand(
		'docker exec -i review_wise_pg psql -U test -d postgres -c "DROP DATABASE IF EXISTS review_wise_db WITH (FORCE);"',
	);

	// Recreate the database
	runCommand(
		'docker exec -i review_wise_pg psql -U test -d postgres -c "CREATE DATABASE review_wise_db;"',
	);

	// Run the initialization scripts
	runCommand(
		"docker exec -i review_wise_pg psql -U test -d review_wise_db -f /docker-entrypoint-initdb.d/schema.sql",
	);
}

// Initial Docker start
try {
	execSync("docker compose version", { stdio: "inherit" });
	execSync("docker compose up -d", { stdio: "inherit" });
} catch (error) {
	execSync("docker-compose up -d", { stdio: "inherit" });
}

// Nuke and reinitialize the database
nukeAndInitDB();

exec("bunx pgtyped -w -c config.json", { stdio: "inherit" });

execSync("bun run --hot src/index.ts", { stdio: "inherit" });
