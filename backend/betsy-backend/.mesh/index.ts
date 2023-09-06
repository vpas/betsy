// @ts-nocheck
import { GraphQLResolveInfo, SelectionSetNode, FieldNode, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import type { GetMeshOptions } from '@graphql-mesh/runtime';
import type { YamlConfig } from '@graphql-mesh/types';
import { PubSub } from '@graphql-mesh/utils';
import { DefaultLogger } from '@graphql-mesh/utils';
import MeshCache from "@graphql-mesh/cache-localforage";
import { fetch as fetchFn } from '@whatwg-node/fetch';

import { MeshResolvedSource } from '@graphql-mesh/runtime';
import { MeshTransform, MeshPlugin } from '@graphql-mesh/types';
import MysqlHandler from "@graphql-mesh/mysql"
import FilterSchemaTransform from "@graphql-mesh/transform-filter-schema";
import BareMerger from "@graphql-mesh/merger-bare";
import { createMeshHTTPHandler, MeshHTTPHandler } from '@graphql-mesh/http';
import { getMesh, ExecuteMeshFn, SubscribeMeshFn, MeshContext as BaseMeshContext, MeshInstance } from '@graphql-mesh/runtime';
import { MeshStore, FsStoreStorageAdapter } from '@graphql-mesh/store';
import { path as pathModule } from '@graphql-mesh/cross-helpers';
import { ImportFn } from '@graphql-mesh/types';
import type { BetsTypes } from './sources/bets/types';
import * as importedModule$0 from "./sources/bets/getDatabaseTables_main";
import * as importedModule$1 from "./sources/bets/getTableFields_bets";
import * as importedModule$2 from "./sources/bets/getTableFields_tasks";
import * as importedModule$3 from "./sources/bets/getTableFields_users";
import * as importedModule$4 from "./sources/bets/getTableForeigns_bets";
import * as importedModule$5 from "./sources/bets/getTableForeigns_tasks";
import * as importedModule$6 from "./sources/bets/getTableForeigns_users";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };



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

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string | ((fieldNode: FieldNode) => SelectionSetNode);
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Query: ResolverTypeWrapper<{}>;
  bets: ResolverTypeWrapper<bets>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  bets_bet_condition: bets_bet_condition;
  Time: ResolverTypeWrapper<Scalars['Time']['output']>;
  UnsignedInt: ResolverTypeWrapper<Scalars['UnsignedInt']['output']>;
  bets_WhereInput: bets_WhereInput;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  bets_OrderByInput: bets_OrderByInput;
  OrderBy: OrderBy;
  users: ResolverTypeWrapper<users>;
  tasks: ResolverTypeWrapper<tasks>;
  tasks_state: tasks_state;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  users_WhereInput: users_WhereInput;
  users_OrderByInput: users_OrderByInput;
  tasks_WhereInput: tasks_WhereInput;
  tasks_OrderByInput: tasks_OrderByInput;
  Mutation: ResolverTypeWrapper<{}>;
  bets_InsertInput: bets_InsertInput;
  bets_UpdateInput: bets_UpdateInput;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  tasks_InsertInput: tasks_InsertInput;
  tasks_UpdateInput: tasks_UpdateInput;
  users_InsertInput: users_InsertInput;
  users_UpdateInput: users_UpdateInput;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Query: {};
  bets: bets;
  Int: Scalars['Int']['output'];
  Time: Scalars['Time']['output'];
  UnsignedInt: Scalars['UnsignedInt']['output'];
  bets_WhereInput: bets_WhereInput;
  String: Scalars['String']['output'];
  bets_OrderByInput: bets_OrderByInput;
  users: users;
  tasks: tasks;
  DateTime: Scalars['DateTime']['output'];
  users_WhereInput: users_WhereInput;
  users_OrderByInput: users_OrderByInput;
  tasks_WhereInput: tasks_WhereInput;
  tasks_OrderByInput: tasks_OrderByInput;
  Mutation: {};
  bets_InsertInput: bets_InsertInput;
  bets_UpdateInput: bets_UpdateInput;
  Boolean: Scalars['Boolean']['output'];
  tasks_InsertInput: tasks_InsertInput;
  tasks_UpdateInput: tasks_UpdateInput;
  users_InsertInput: users_InsertInput;
  users_UpdateInput: users_UpdateInput;
}>;

export type QueryResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  bets?: Resolver<Maybe<Array<Maybe<ResolversTypes['bets']>>>, ParentType, ContextType, Partial<QuerybetsArgs>>;
  count_bets?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType, Partial<Querycount_betsArgs>>;
  tasks?: Resolver<Maybe<Array<Maybe<ResolversTypes['tasks']>>>, ParentType, ContextType, Partial<QuerytasksArgs>>;
  count_tasks?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType, Partial<Querycount_tasksArgs>>;
  users?: Resolver<Maybe<Array<Maybe<ResolversTypes['users']>>>, ParentType, ContextType, Partial<QueryusersArgs>>;
  count_users?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType, Partial<Querycount_usersArgs>>;
}>;

export type betsResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['bets'] = ResolversParentTypes['bets']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  created_by?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  accepted_by?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  mirror_bet_id?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  bet_condition?: Resolver<ResolversTypes['bets_bet_condition'], ParentType, ContextType>;
  term?: Resolver<ResolversTypes['Time'], ParentType, ContextType>;
  bet_amount?: Resolver<ResolversTypes['UnsignedInt'], ParentType, ContextType>;
  bets?: Resolver<Maybe<Array<Maybe<ResolversTypes['bets']>>>, ParentType, ContextType, Partial<betsbetsArgs>>;
  users?: Resolver<Maybe<Array<Maybe<ResolversTypes['users']>>>, ParentType, ContextType, Partial<betsusersArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface TimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Time'], any> {
  name: 'Time';
}

export interface UnsignedIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['UnsignedInt'], any> {
  name: 'UnsignedInt';
}

export type usersResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['users'] = ResolversParentTypes['users']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  bets?: Resolver<Maybe<Array<Maybe<ResolversTypes['bets']>>>, ParentType, ContextType, Partial<usersbetsArgs>>;
  tasks?: Resolver<Maybe<Array<Maybe<ResolversTypes['tasks']>>>, ParentType, ContextType, Partial<userstasksArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type tasksResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['tasks'] = ResolversParentTypes['tasks']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  created_by?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  state?: Resolver<ResolversTypes['tasks_state'], ParentType, ContextType>;
  started_at?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  users?: Resolver<Maybe<Array<Maybe<ResolversTypes['users']>>>, ParentType, ContextType, Partial<tasksusersArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type MutationResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  insert_bets?: Resolver<Maybe<ResolversTypes['bets']>, ParentType, ContextType, RequireFields<Mutationinsert_betsArgs, 'bets'>>;
  update_bets?: Resolver<Maybe<ResolversTypes['bets']>, ParentType, ContextType, RequireFields<Mutationupdate_betsArgs, 'bets'>>;
  delete_bets?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, Partial<Mutationdelete_betsArgs>>;
  insert_tasks?: Resolver<Maybe<ResolversTypes['tasks']>, ParentType, ContextType, RequireFields<Mutationinsert_tasksArgs, 'tasks'>>;
  update_tasks?: Resolver<Maybe<ResolversTypes['tasks']>, ParentType, ContextType, RequireFields<Mutationupdate_tasksArgs, 'tasks'>>;
  delete_tasks?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, Partial<Mutationdelete_tasksArgs>>;
  insert_users?: Resolver<Maybe<ResolversTypes['users']>, ParentType, ContextType, RequireFields<Mutationinsert_usersArgs, 'users'>>;
  update_users?: Resolver<Maybe<ResolversTypes['users']>, ParentType, ContextType, RequireFields<Mutationupdate_usersArgs, 'users'>>;
  delete_users?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, Partial<Mutationdelete_usersArgs>>;
}>;

export type Resolvers<ContextType = MeshContext> = ResolversObject<{
  Query?: QueryResolvers<ContextType>;
  bets?: betsResolvers<ContextType>;
  Time?: GraphQLScalarType;
  UnsignedInt?: GraphQLScalarType;
  users?: usersResolvers<ContextType>;
  tasks?: tasksResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
}>;


export type MeshContext = BetsTypes.Context & BaseMeshContext;


const baseDir = pathModule.join(typeof __dirname === 'string' ? __dirname : '/', '..');

const importFn: ImportFn = <T>(moduleId: string) => {
  const relativeModuleId = (pathModule.isAbsolute(moduleId) ? pathModule.relative(baseDir, moduleId) : moduleId).split('\\').join('/').replace(baseDir + '/', '');
  switch(relativeModuleId) {
    case ".mesh/sources/bets/getDatabaseTables_main":
      return Promise.resolve(importedModule$0) as T;
    
    case ".mesh/sources/bets/getTableFields_bets":
      return Promise.resolve(importedModule$1) as T;
    
    case ".mesh/sources/bets/getTableFields_tasks":
      return Promise.resolve(importedModule$2) as T;
    
    case ".mesh/sources/bets/getTableFields_users":
      return Promise.resolve(importedModule$3) as T;
    
    case ".mesh/sources/bets/getTableForeigns_bets":
      return Promise.resolve(importedModule$4) as T;
    
    case ".mesh/sources/bets/getTableForeigns_tasks":
      return Promise.resolve(importedModule$5) as T;
    
    case ".mesh/sources/bets/getTableForeigns_users":
      return Promise.resolve(importedModule$6) as T;
    
    default:
      return Promise.reject(new Error(`Cannot find module '${relativeModuleId}'.`));
  }
};

const rootStore = new MeshStore('.mesh', new FsStoreStorageAdapter({
  cwd: baseDir,
  importFn,
  fileType: "ts",
}), {
  readonly: true,
  validate: false
});

export const rawServeConfig: YamlConfig.Config['serve'] = undefined as any
export async function getMeshOptions(): Promise<GetMeshOptions> {
const pubsub = new PubSub();
const sourcesStore = rootStore.child('sources');
const logger = new DefaultLogger("🕸️  Mesh");
const cache = new (MeshCache as any)({
      ...({} as any),
      importFn,
      store: rootStore.child('cache'),
      pubsub,
      logger,
    } as any)

const sources: MeshResolvedSource[] = [];
const transforms: MeshTransform[] = [];
const additionalEnvelopPlugins: MeshPlugin<any>[] = [];
const betsTransforms = [];
const additionalTypeDefs = [] as any[];
const betsHandler = new MysqlHandler({
              name: "bets",
              config: {"host":"betsy.c9wzmnw9mmdm.eu-central-1.rds.amazonaws.com","port":3306,"user":"admin","password":"AizdhmakEPQxOts3XvCl","database":"main"},
              baseDir,
              cache,
              pubsub,
              store: sourcesStore.child("bets"),
              logger: logger.child("bets"),
              importFn,
            });
betsTransforms[0] = new FilterSchemaTransform({
                  apiName: "bets",
                  config: {"mode":"bare","filters":["users_InsertInput.!id"]},
                  baseDir,
                  cache,
                  pubsub,
                  importFn,
                  logger,
                });
sources[0] = {
          name: 'bets',
          handler: betsHandler,
          transforms: betsTransforms
        }
const additionalResolvers = [] as any[]
const merger = new(BareMerger as any)({
        cache,
        pubsub,
        logger: logger.child('bareMerger'),
        store: rootStore.child('bareMerger')
      })

  return {
    sources,
    transforms,
    additionalTypeDefs,
    additionalResolvers,
    cache,
    pubsub,
    merger,
    logger,
    additionalEnvelopPlugins,
    get documents() {
      return [
      
    ];
    },
    fetchFn,
  };
}

export function createBuiltMeshHTTPHandler<TServerContext = {}>(): MeshHTTPHandler<TServerContext> {
  return createMeshHTTPHandler<TServerContext>({
    baseDir,
    getBuiltMesh: getBuiltMesh,
    rawServeConfig: undefined,
  })
}


let meshInstance$: Promise<MeshInstance> | undefined;

export function getBuiltMesh(): Promise<MeshInstance> {
  if (meshInstance$ == null) {
    meshInstance$ = getMeshOptions().then(meshOptions => getMesh(meshOptions)).then(mesh => {
      const id = mesh.pubsub.subscribe('destroy', () => {
        meshInstance$ = undefined;
        mesh.pubsub.unsubscribe(id);
      });
      return mesh;
    });
  }
  return meshInstance$;
}

export const execute: ExecuteMeshFn = (...args) => getBuiltMesh().then(({ execute }) => execute(...args));

export const subscribe: SubscribeMeshFn = (...args) => getBuiltMesh().then(({ subscribe }) => subscribe(...args));