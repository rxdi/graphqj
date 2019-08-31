// tslint:disable
// graphql typescript definitions


  export interface IGraphQLResponseRoot {
    data?: IQuery | ISubscription;
    errors?: Array<IGraphQLResponseError>;
  }

  export interface IGraphQLResponseError {
    message: string;            // Required for all errors
    locations?: Array<IGraphQLResponseErrorLocation>;
    [propName: string]: any;    // 7.2.2 says 'GraphQL servers may provide additional entries to error'
  }

  export interface IGraphQLResponseErrorLocation {
    line: number;
    column: number;
  }

  /**
    description?: Query type for all get requests which will not change persistent data
  */
  export interface IQuery {
    __typename?: "Query";
    findUser?: IUser | null;
    status?: IStatusQueryType | null;
}

  
  export interface IUserPayload {
    name: string;
    pesho?: string | null;
}

  
  export interface IUser {
    __typename?: "User";
    name?: string | null;
    email?: string | null;
    phone?: number | null;
    arrayOfNumbers?: Array<number> | null;
    arrayOfStrings?: Array<string> | null;
    arrayOfStrings2?: Array<string> | null;
}

  
  export interface IStatusQueryType {
    __typename?: "StatusQueryType";
    status?: string | null;
}

  /**
    description?: Subscription type for all subscriptions via pub sub
  */
  export interface ISubscription {
    __typename?: "Subscription";
    listenForChanges?: IClientType | null;
}

  
  export interface IClientType {
    __typename?: "ClientType";
    views?: Array<IClientViewType> | null;
}

  
  export interface IClientViewType {
    __typename?: "ClientViewType";
    html?: string | null;
    components?: Array<string> | null;
    name?: string | null;
    query?: string | null;
    props?: string | null;
    output?: string | null;
}


// tslint:enable
