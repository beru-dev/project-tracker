import * as nextAuth from "next-auth";
import { getUser } from "../../src/utils";
import { db } from "../../src/database/connection";
import * as drizzle from "drizzle-orm";

jest.mock("drizzle-orm", () => ({
    ...jest.requireActual("drizzle-orm"),
    eq: jest.fn()
}));

describe("getUser", () => {
    const spyGetServerSession = jest.spyOn(nextAuth, "getServerSession");

    beforeEach(() => {
        jest.resetAllMocks();
    })

    it("should return an error message if the user is not logged in", async () => {
        spyGetServerSession.mockImplementationOnce(async () => null);

        expect(await getUser()).toEqual({ error: "Please log in to perform this operation" });
    });

    it("should return info of logged in user", async () => {
        spyGetServerSession.mockImplementationOnce(async () => ({
            user: { name: "Joe" }
        }));

        //@ts-ignore
        db.select.mockImplementationOnce(() => ({
            from: () => ({
                where: () => [{
                    id: 1,
                    name: "Joe",
                    role: "admin"
                }]
            })
        }));

        expect(await getUser()).toEqual({
            id: 1,
            name: "Joe",
            role: "admin"
        });
    });

    it("should not filter the results by role when no roles are provided", async () => {
        spyGetServerSession.mockImplementationOnce(async () => ({
            user: { name: "Joe" }
        }));

        //@ts-ignore
        db.select.mockImplementationOnce(() => ({
            from: () => ({
                where: () => [{
                    id: 1,
                    name: "Joe",
                    role: "admin"
                }]
            })
        }));

        await getUser();

        expect(drizzle.eq).toHaveBeenCalledWith(expect.any(Object), "Joe");
    });

    it("should filter the results by roles, when roles are provided", async () => {
        spyGetServerSession.mockImplementationOnce(async () => ({
            user: { name: "Joe" }
        }));

        //@ts-ignore
        db.select.mockImplementationOnce(() => ({
            from: () => ({
                where: () => [{
                    id: 1,
                    name: "Joe",
                    role: "admin"
                }]
            })
        }));

        await getUser(["user", "admin"]);

        expect(drizzle.eq).not.toHaveBeenCalled();
    });
});