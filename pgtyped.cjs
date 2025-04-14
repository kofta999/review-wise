module.exports = {
	transforms: [
		{
			mode: "ts",
			include: "./data-access/*.repository.ts",
			emitTemplate: "{{dir}}/types/{{name}}.types.ts",
		},
	],
	srcDir: "./src/",
	failOnError: false,
	db: {
		host: "localhost",
		user: "test",
		dbName: "review_wise_db",
		password: "test",
	},
};
