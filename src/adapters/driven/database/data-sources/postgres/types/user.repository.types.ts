/** Types generated for queries found in "src/data-access/user.repository.ts" */
export type userrole = "ADMIN" | "BUSINESS" | "REVIEWER";

/** 'CreateUser' parameters type */
export interface ICreateUserParams {
	email?: string | null | void;
	password?: string | null | void;
	role?: userrole | null | void;
}

/** 'CreateUser' return type */
export interface ICreateUserResult {
	user_id: number;
}

/** 'CreateUser' query type */
export interface ICreateUserQuery {
	params: ICreateUserParams;
	result: ICreateUserResult;
}

/** 'GetUserById' parameters type */
export interface IGetUserByIdParams {
	userId?: number | null | void;
}

/** 'GetUserById' return type */
export interface IGetUserByIdResult {
	created_at: Date;
	email: string;
	password: string;
	role: userrole;
	user_id: number;
}

/** 'GetUserById' query type */
export interface IGetUserByIdQuery {
	params: IGetUserByIdParams;
	result: IGetUserByIdResult;
}

/** 'GetUserByEmail' parameters type */
export interface IGetUserByEmailParams {
	email?: string | null | void;
}

/** 'GetUserByEmail' return type */
export interface IGetUserByEmailResult {
	created_at: Date;
	email: string;
	password: string;
	role: userrole;
	user_id: number;
}

/** 'GetUserByEmail' query type */
export interface IGetUserByEmailQuery {
	params: IGetUserByEmailParams;
	result: IGetUserByEmailResult;
}
