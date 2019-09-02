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
    users?: IUser | null;
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
    clickHamburgerButton?: IHamburgerStatisticsType | null;
    clientReady?: IClientReadyStatusType | null;
}

  
  export interface IHamburgerStatisticsType {
    __typename?: "HamburgerStatisticsType";
    clicks?: number | null;
}

  
  export interface IClientReadyStatusType {
    __typename?: "ClientReadyStatusType";
    status?: string | null;
}

  /**
    description?: Subscription type for all subscriptions via pub sub
  */
  export interface ISubscription {
    __typename?: "Subscription";
    subscribeToStatistics?: IHamburgerStatisticsType | null;
    listenForChanges?: IClientType | null;
}

  
  export interface IClientType {
    __typename?: "ClientType";
    components?: Array<string> | null;
    views?: Array<IClientViewType> | null;
    schema?: string | null;
}

  
  export interface IClientViewType {
    __typename?: "ClientViewType";
    html?: string | null;
    components?: Array<string> | null;
    name?: string | null;
    policy?: string | null;
    query?: string | null;
    props?: Array<string> | null;
    output?: string | null;
}


// tslint:enable
