import { strEnum } from '../helpers/string-to-enum';

export const ClientViewRenderingEnum = strEnum(['client', 'server']);
export type ClientViewRenderingEnum = keyof typeof ClientViewRenderingEnum;



export const ConditionalOperators = strEnum([
    '*if',
    'of',
    '*for',
    '*let',
    '{',
    '}',
    '{{',
    '}}',
    '*template'
]);

export type ConditionalOperators = keyof typeof ConditionalOperators;
