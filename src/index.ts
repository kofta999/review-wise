import app from "./app";
import env from "./env";

export default {
	fetch: app.fetch,
	port: env.PORT,
};
