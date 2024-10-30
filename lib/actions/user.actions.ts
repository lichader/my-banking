"use server";

import { ID } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { parseStringify } from "../utils";
import { cookies } from "next/headers";

const sessionName = "appwrite-session";

export const signIn = async ({ email, password }: signInProps) => {
  try {
    // Mutation / Database / Make fetch

    const { account } = await createAdminClient();
    const session = await account.createEmailPasswordSession(email, password);

    cookies().set(sessionName, session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify(session);
  } catch (error) {
    console.error("ERROR", error);
  }
};

export const signUp = async (userData: SignUpParams) => {
  try {
    // Mutation / Database / Make fetch

    const { email, password, firstName, lastName } = userData;

    const { account } = await createAdminClient();

    const newUserAccount = await account.create(
      ID.unique(),
      email,
      password,
      `${firstName} ${lastName}`,
    );
    const session = await account.createEmailPasswordSession(email, password);

    cookies().set(sessionName, session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify(newUserAccount);
  } catch (error) {
    console.error("ERROR", error);
  }
};

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    return await account.get();
  } catch (error) {
    console.error("ERROR", error);
    return null;
  }
}

export const logoutAccount = async () => {
  try {
    const { account } = await createSessionClient();

    cookies().delete(sessionName);

    await account.deleteSession("current");
  } catch (error) {
    console.error("LOG OUT ERROR", error);
    return null;
  }
};
