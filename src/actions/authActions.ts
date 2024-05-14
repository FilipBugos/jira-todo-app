"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

import { signIn, signOut } from "@/auth";
import { SignInFormSchema, SignupFormSchema } from "@/lib/definitions";
import { getUserById, getUserByUsername } from "@/actions/userActions";
import { createSession, deleteSession } from "@/lib/session";
import { verifySession } from "@/lib/dal";

import { db } from "../../db/db";
import { user } from "../../db/schema";

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}
export async function ownSignIn(
  prevState: string | undefined,
  formData: FormData,
) {
  const validatedFields = SignInFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  const data = await getUserByUsername(email);
  const returnedUser = data[0];

  if (!returnedUser) {
    return {
      errors: {
        email: "User not found.",
      },
    };
  }

  const bcrypt = require("bcrypt");
  const isValidPassword = await bcrypt.compare(password, returnedUser.password);

  if (!isValidPassword) {
    return {
      errors: {
        password: "Invalid password.",
      },
    };
  }

  await createSession(returnedUser.id);
  redirect("/profile");
}
export async function signup(
  prevState: string | undefined,
  formData: FormData,
) {
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get("name"),
    username: formData.get("email"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  const { name, email, password } = validatedFields.data;
  const bcrypt = require("bcrypt");
  const hashedPassword = await bcrypt.hash(password, 10);

  const data = await db
    .insert(user)
    .values({
      name,
      username: email,
      email,
      password: hashedPassword,
    })
    .returning({ id: user.id });

  const createdUser = data[0];

  if (!createdUser) {
    return {
      message: "An error occurred while creating your account.",
    };
  }

  await createSession(createdUser.id);
  redirect("/profile");
}

export async function logout() {
  deleteSession();
  await signOut(redirect("/"));
}

export const getLoggedInUser = async () => {
  const { isAuth, userId } = await verifySession();
  if (!isAuth || !userId) {
    return;
  }

  const loggedInUser = await getUserById(userId);
  return loggedInUser[0];
};
