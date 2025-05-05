import { type Mock, mock } from "bun:test";
import type { IDatabaseConnection } from "@pgtyped/runtime";

export interface MockDatabaseConnection extends IDatabaseConnection {
	query: Mock<
		(
			query: string,
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			bindings: any[],
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		) => Promise<{ rows: any[]; rowCount: number }>
	>;
}

export function createMockDatabaseConnection(): MockDatabaseConnection {
	return {
		query:
			mock<
				(
					query: string,
					// biome-ignore lint/suspicious/noExplicitAny: <explanation>
					bindings: any[],
					// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				) => Promise<{ rows: any[]; rowCount: number }>
			>(),
	};
}
