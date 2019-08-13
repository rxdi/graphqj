// tslint:disable
// graphql typescript definitions


  export interface IGraphQLResponseRoot {
    data?: IQuery;
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
    findUser2?: IUser | null;
    status?: IStatusQueryType | null;
}

  
  export interface IUser {
    __typename?: "user";
    name?: string | null;
    email?: string | null;
    phone?: number | null;
    arrayOfNumbers?: Array<number> | null;
    arrayOfStrings?: Array<string> | null;
}

  
  export interface IStatusQueryType {
    __typename?: "StatusQueryType";
    status?: string | null;
}


// tslint:enable
