export const useSession = jest.fn();
export const signIn = jest.fn();
export const signOut = jest.fn();

//@ts-ignore
global.useSession = useSession;
//@ts-ignore
global.signIn = signIn;
//@ts-ignore
global.signOut = signOut;