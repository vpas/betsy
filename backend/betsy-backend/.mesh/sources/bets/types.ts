// @ts-nocheck

import { InContextSdkMethod } from '@graphql-mesh/types';
import { MeshContext } from '@graphql-mesh/runtime';

export namespace BetsTypes {
  export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  /** The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text. */
  String: { input: string; output: string; }
  /** The `Boolean` scalar type represents `true` or `false`. */
  Boolean: { input: boolean; output: boolean; }
  /** The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1. */
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A time string at UTC, such as 10:15:30Z, compliant with the `full-time` format outlined in section 5.6 of the RFC 3339profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  Time: { input: Date | string; output: Date | string; }
  /** Integers that will have a value of 0 or more. */
  UnsignedInt: { input: number; output: number; }
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: { input: Date | string; output: Date | string; }
};

export type Query = {
  bets?: Maybe<Array<Maybe<bets>>>;
  count_bets?: Maybe<Scalars['Int']['output']>;
  tasks?: Maybe<Array<Maybe<tasks>>>;
  count_tasks?: Maybe<Scalars['Int']['output']>;
  users?: Maybe<Array<Maybe<users>>>;
  count_users?: Maybe<Scalars['Int']['output']>;
};


export type QuerybetsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<bets_WhereInput>;
  orderBy?: InputMaybe<bets_OrderByInput>;
};


export type Querycount_betsArgs = {
  where?: InputMaybe<bets_WhereInput>;
};


export type QuerytasksArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<tasks_WhereInput>;
  orderBy?: InputMaybe<tasks_OrderByInput>;
};


export type Querycount_tasksArgs = {
  where?: InputMaybe<tasks_WhereInput>;
};


export type QueryusersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<users_WhereInput>;
  orderBy?: InputMaybe<users_OrderByInput>;
};


export type Querycount_usersArgs = {
  where?: InputMaybe<users_WhereInput>;
};

export type bets = {
  id: Scalars['Int']['output'];
  created_by: Scalars['Int']['output'];
  accepted_by?: Maybe<Scalars['Int']['output']>;
  mirror_bet_id?: Maybe<Scalars['Int']['output']>;
  bet_condition: bets_bet_condition;
  term: Scalars['Time']['output'];
  bet_amount: Scalars['UnsignedInt']['output'];
  bets?: Maybe<Array<Maybe<bets>>>;
  users?: Maybe<Array<Maybe<users>>>;
};


export type betsbetsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<bets_WhereInput>;
  orderBy?: InputMaybe<bets_OrderByInput>;
};


export type betsusersArgs = {
  where?: InputMaybe<users_WhereInput>;
  orderBy?: InputMaybe<users_OrderByInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type bets_bet_condition =
  | 'done_in_time'
  | 'not_done_in_time';

export type bets_WhereInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  created_by?: InputMaybe<Scalars['String']['input']>;
  accepted_by?: InputMaybe<Scalars['String']['input']>;
  mirror_bet_id?: InputMaybe<Scalars['String']['input']>;
  bet_condition?: InputMaybe<Scalars['String']['input']>;
  term?: InputMaybe<Scalars['String']['input']>;
  bet_amount?: InputMaybe<Scalars['String']['input']>;
};

export type bets_OrderByInput = {
  id?: InputMaybe<OrderBy>;
  created_by?: InputMaybe<OrderBy>;
  accepted_by?: InputMaybe<OrderBy>;
  mirror_bet_id?: InputMaybe<OrderBy>;
  bet_condition?: InputMaybe<OrderBy>;
  term?: InputMaybe<OrderBy>;
  bet_amount?: InputMaybe<OrderBy>;
};

export type OrderBy =
  | 'asc'
  | 'desc';

export type users = {
  id: Scalars['Int']['output'];
  username: Scalars['String']['output'];
  email: Scalars['String']['output'];
  bets?: Maybe<Array<Maybe<bets>>>;
  tasks?: Maybe<Array<Maybe<tasks>>>;
};


export type usersbetsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<bets_WhereInput>;
  orderBy?: InputMaybe<bets_OrderByInput>;
};


export type userstasksArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<tasks_WhereInput>;
  orderBy?: InputMaybe<tasks_OrderByInput>;
};

export type tasks = {
  id: Scalars['Int']['output'];
  created_by: Scalars['Int']['output'];
  title: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  state: tasks_state;
  started_at?: Maybe<Scalars['DateTime']['output']>;
  users?: Maybe<Array<Maybe<users>>>;
};


export type tasksusersArgs = {
  where?: InputMaybe<users_WhereInput>;
  orderBy?: InputMaybe<users_OrderByInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type tasks_state =
  | 'accept_bets'
  | 'bets_finalized'
  | 'in_progress'
  | 'done'
  | 'abandoned';

export type users_WhereInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
};

export type users_OrderByInput = {
  id?: InputMaybe<OrderBy>;
  username?: InputMaybe<OrderBy>;
  email?: InputMaybe<OrderBy>;
};

export type tasks_WhereInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  created_by?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['String']['input']>;
  started_at?: InputMaybe<Scalars['String']['input']>;
};

export type tasks_OrderByInput = {
  id?: InputMaybe<OrderBy>;
  created_by?: InputMaybe<OrderBy>;
  title?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  state?: InputMaybe<OrderBy>;
  started_at?: InputMaybe<OrderBy>;
};

export type Mutation = {
  insert_bets?: Maybe<bets>;
  update_bets?: Maybe<bets>;
  delete_bets?: Maybe<Scalars['Boolean']['output']>;
  insert_tasks?: Maybe<tasks>;
  update_tasks?: Maybe<tasks>;
  delete_tasks?: Maybe<Scalars['Boolean']['output']>;
  insert_users?: Maybe<users>;
  update_users?: Maybe<users>;
  delete_users?: Maybe<Scalars['Boolean']['output']>;
};


export type Mutationinsert_betsArgs = {
  bets: bets_InsertInput;
};


export type Mutationupdate_betsArgs = {
  bets: bets_UpdateInput;
  where?: InputMaybe<bets_WhereInput>;
};


export type Mutationdelete_betsArgs = {
  where?: InputMaybe<bets_WhereInput>;
};


export type Mutationinsert_tasksArgs = {
  tasks: tasks_InsertInput;
};


export type Mutationupdate_tasksArgs = {
  tasks: tasks_UpdateInput;
  where?: InputMaybe<tasks_WhereInput>;
};


export type Mutationdelete_tasksArgs = {
  where?: InputMaybe<tasks_WhereInput>;
};


export type Mutationinsert_usersArgs = {
  users: users_InsertInput;
};


export type Mutationupdate_usersArgs = {
  users: users_UpdateInput;
  where?: InputMaybe<users_WhereInput>;
};


export type Mutationdelete_usersArgs = {
  where?: InputMaybe<users_WhereInput>;
};

export type bets_InsertInput = {
  id: Scalars['Int']['input'];
  created_by: Scalars['Int']['input'];
  accepted_by?: InputMaybe<Scalars['Int']['input']>;
  mirror_bet_id?: InputMaybe<Scalars['Int']['input']>;
  bet_condition: bets_bet_condition;
  term: Scalars['Time']['input'];
  bet_amount: Scalars['UnsignedInt']['input'];
};

export type bets_UpdateInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  created_by?: InputMaybe<Scalars['Int']['input']>;
  accepted_by?: InputMaybe<Scalars['Int']['input']>;
  mirror_bet_id?: InputMaybe<Scalars['Int']['input']>;
  bet_condition?: InputMaybe<bets_bet_condition>;
  term?: InputMaybe<Scalars['Time']['input']>;
  bet_amount?: InputMaybe<Scalars['UnsignedInt']['input']>;
};

export type tasks_InsertInput = {
  id: Scalars['Int']['input'];
  created_by: Scalars['Int']['input'];
  title: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  state: tasks_state;
  started_at?: InputMaybe<Scalars['DateTime']['input']>;
};

export type tasks_UpdateInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  created_by?: InputMaybe<Scalars['Int']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<tasks_state>;
  started_at?: InputMaybe<Scalars['DateTime']['input']>;
};

export type users_InsertInput = {
  username: Scalars['String']['input'];
  email: Scalars['String']['input'];
};

export type users_UpdateInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
};

  export type QuerySdk = {
      /** undefined **/
  bets: InContextSdkMethod<Query['bets'], QuerybetsArgs, MeshContext>,
  /** undefined **/
  count_bets: InContextSdkMethod<Query['count_bets'], Querycount_betsArgs, MeshContext>,
  /** undefined **/
  tasks: InContextSdkMethod<Query['tasks'], QuerytasksArgs, MeshContext>,
  /** undefined **/
  count_tasks: InContextSdkMethod<Query['count_tasks'], Querycount_tasksArgs, MeshContext>,
  /** undefined **/
  users: InContextSdkMethod<Query['users'], QueryusersArgs, MeshContext>,
  /** undefined **/
  count_users: InContextSdkMethod<Query['count_users'], Querycount_usersArgs, MeshContext>
  };

  export type MutationSdk = {
      /** undefined **/
  insert_bets: InContextSdkMethod<Mutation['insert_bets'], Mutationinsert_betsArgs, MeshContext>,
  /** undefined **/
  update_bets: InContextSdkMethod<Mutation['update_bets'], Mutationupdate_betsArgs, MeshContext>,
  /** undefined **/
  delete_bets: InContextSdkMethod<Mutation['delete_bets'], Mutationdelete_betsArgs, MeshContext>,
  /** undefined **/
  insert_tasks: InContextSdkMethod<Mutation['insert_tasks'], Mutationinsert_tasksArgs, MeshContext>,
  /** undefined **/
  update_tasks: InContextSdkMethod<Mutation['update_tasks'], Mutationupdate_tasksArgs, MeshContext>,
  /** undefined **/
  delete_tasks: InContextSdkMethod<Mutation['delete_tasks'], Mutationdelete_tasksArgs, MeshContext>,
  /** undefined **/
  insert_users: InContextSdkMethod<Mutation['insert_users'], Mutationinsert_usersArgs, MeshContext>,
  /** undefined **/
  update_users: InContextSdkMethod<Mutation['update_users'], Mutationupdate_usersArgs, MeshContext>,
  /** undefined **/
  delete_users: InContextSdkMethod<Mutation['delete_users'], Mutationdelete_usersArgs, MeshContext>
  };

  export type SubscriptionSdk = {
    
  };

  export type Context = {
      ["bets"]: { Query: QuerySdk, Mutation: MutationSdk, Subscription: SubscriptionSdk },
      
    };
}
