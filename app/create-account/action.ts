"use server";

import * as msgs from "@/lib/constants";
import db from "@/lib/db";
import { z } from "zod";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import getSession from "@/lib/session";

const checkPasswords = ({
  password,
  confirm_password,
}: {
  password: string;
  confirm_password: string;
}) => password === confirm_password;

const checkUsername = (username: string) => {
  return !username.includes("-gh");
};

const formSchema = z
  .object({
    username: z
      .string({
        invalid_type_error: msgs.INVALID_TYPE_ERROR_MESSAGE,
        required_error: msgs.REQUIRED_ERROR_MESSAGE,
      })
      .min(msgs.USERNAME_MIN_LENGTH, msgs.USERNAME_MIN_ERROR_MESSAGE)
      .max(msgs.USERNAME_MAX_LENGTH, msgs.USERNAME_MAX_ERROR_MESSAGE)
      .toLowerCase()
      .trim()
      .refine(checkUsername, msgs.USERNAME_GITHUB_ERROR_MESSAGE),
    email: z
      .string()
      .email({ message: msgs.EMAIL_ERROR_MESSAGE })
      .toLowerCase(),
    password: z
      .string()
      .min(msgs.PASSWORD_MIN_LENGTH, msgs.PASSWORD_MIN_ERROR_MESSAGE)
      .regex(msgs.PASSWORD_REGEX, msgs.PASSWORD_REGEX_ERROR_MESSAGE),
    confirm_password: z
      .string()
      .min(msgs.PASSWORD_MIN_LENGTH, msgs.PASSWORD_MIN_ERROR_MESSAGE),
  })
  .superRefine(async ({ username }, ctx) => {
    const user = await db.user.findUnique({
      where: {
        username,
      },
      select: {
        id: true,
      },
    });
    if (user) {
      ctx.addIssue({
        code: "custom",
        message: msgs.USERNAME_ALREADY_EXISTS_MESSAGE,
        path: ["username"],
        fatal: true,
      });
      return z.NEVER;
    }
  })
  .superRefine(async ({ email }, ctx) => {
    const user = await db.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
      },
    });
    if (user) {
      ctx.addIssue({
        code: "custom",
        message: msgs.EMAIL_ALREADY_EXISTS_MESSAGE,
        path: ["email"],
        fatal: true,
      });
      return z.NEVER;
    }
  })
  .refine(checkPasswords, {
    message: msgs.PASSWORD_NOT_MATCH_MESSAGE,
    path: ["confirm_password"],
  });

export default async function createAccount(
  prevState: any,
  formData: FormData
) {
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirm_password: formData.get("confirm_password"),
  };

  // By using safeParse, we can get the errors in a flattened format
  // if we not use safeParse, we have to use try-catch block to get the errors
  const result = await formSchema.spa(data);
  if (!result.success) {
    return { errors: result.error.flatten() };
  } else {
    console.log(result);
    const hashedPassword = await bcrypt.hash(result.data.password, 12);
    const user = await db.user.create({
      data: {
        username: result.data.username,
        email: result.data.email,
        password: hashedPassword,
      },
      select: {
        id: true,
      },
    });

    // 유저를 로그인 시킨다
    const session = await getSession();
    session.id = user.id;
    await session.save();

    // 유저를 /home 페이지로 리다이렉트 시킨다
    redirect("/profile");
  }
}
