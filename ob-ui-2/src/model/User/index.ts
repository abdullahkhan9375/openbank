export type TUser =
{
    username: string,
    id: string,
    givenName: string,
    familyName: string,
    nickName: string,
    email: string,
    lastLoggedIn: number,
    createdAt: number,
    subscribedBanks: string[],
    subscribedTests: string[],
};

export type TReqUser =
{
    PK: string, // UR#userID
    type: "user",
} & TUser;
