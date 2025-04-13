/** Types generated for queries found in "src/data-access/user.repository.ts" */
export type userrole = 'ADMIN' | 'BUSINESS' | 'REVIEWER';

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

/** 'GetUser' parameters type */
export interface IGetUserParams {
  userId?: number | null | void;
}

/** 'GetUser' return type */
export interface IGetUserResult {
  created_at: Date;
  email: string;
  password: string;
  role: userrole;
  user_id: number;
}

/** 'GetUser' query type */
export interface IGetUserQuery {
  params: IGetUserParams;
  result: IGetUserResult;
}

