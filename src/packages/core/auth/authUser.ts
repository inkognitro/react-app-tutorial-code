type AuthUserType = 'anonymous' | 'authenticated';
type GenericUser<T extends AuthUserType, Payload extends object = {}> = { type: T } & Payload;
type UserData = { id: string; username: string };
export type AnonymousAuthUser = GenericUser<'anonymous'>;
export type AuthenticatedAuthUser = GenericUser<'authenticated', { apiKey: string; data: UserData }>;
export type AuthUser = AnonymousAuthUser | AuthenticatedAuthUser;