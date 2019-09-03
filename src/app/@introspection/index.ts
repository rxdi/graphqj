// tslint:disable
// graphql typescript definitions


  export interface IGraphQLResponseRoot {
    data?: IQuery | IMutation | ISubscription;
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
    user?: IUser | null;
}

  
  export interface IStatusQueryType {
    __typename?: "StatusQueryType";
    status?: string | null;
}

  /**
    description?: Mutation type for all requests which will change persistent data
  */
  export interface IMutation {
    __typename?: "Mutation";
    clientReady?: IClientType | null;
}

  
  export interface IClientType {
    __typename?: "ClientType";
    components?: Array<IComponentsType> | null;
    views?: Array<IClientViewType> | null;
    schema?: string | null;
}

  
  export interface IComponentsType {
    __typename?: "ComponentsType";
    link?: string | null;
    selector?: string | null;
}

  
  export interface IClientViewType {
    __typename?: "ClientViewType";
    html?: string | null;
    lhtml?: string | null;
    components?: Array<IComponentsType> | null;
    name?: string | null;
    policy?: string | null;
    query?: string | null;
    props?: Array<string> | null;
    output?: string | null;
}

  /**
    description?: Subscription type for all subscriptions via pub sub
  */
  export interface ISubscription {
    __typename?: "Subscription";
    listenForChanges?: IClientType | null;
}


// tslint:enable
