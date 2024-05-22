"use server";

import {
  EMAIL_ALREADY_EXISTS_MESSAGE,
  EMAIL_ERROR_MESSAGE,
  INVALID_TYPE_ERROR_MESSAGE,
  PASSWORD_MIN_ERROR_MESSAGE,
  PASSWORD_MIN_LENGTH,
  PASSWORD_NOT_MATCH_MESSAGE,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR_MESSAGE,
  REQUIRED_ERROR_MESSAGE,
  USERNAME_ALREADY_EXISTS_MESSAGE,
  USERNAME_MAX_ERROR_MESSAGE,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_ERROR_MESSAGE,
  USERNAME_MIN_LENGTH,
} from "@/lib/constants";
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

const formSchema = z
  .object({
    username: z
      .string({
        invalid_type_error: INVALID_TYPE_ERROR_MESSAGE,
        required_error: REQUIRED_ERROR_MESSAGE,
      })
      .min(USERNAME_MIN_LENGTH, USERNAME_MIN_ERROR_MESSAGE)
      .max(USERNAME_MAX_LENGTH, USERNAME_MAX_ERROR_MESSAGE)
      .toLowerCase()
      .trim(),
    email: z.string().email({ message: EMAIL_ERROR_MESSAGE }).toLowerCase(),
    password: z
      .string()
      .min(PASSWORD_MIN_LENGTH, PASSWORD_MIN_ERROR_MESSAGE)
      .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR_MESSAGE),
    confirm_password: z
      .string()
      .min(PASSWORD_MIN_LENGTH, PASSWORD_MIN_ERROR_MESSAGE),
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
        message: USERNAME_ALREADY_EXISTS_MESSAGE,
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
        message: EMAIL_ALREADY_EXISTS_MESSAGE,
        path: ["email"],
        fatal: true,
      });
      return z.NEVER;
    }
  })
  .refine(checkPasswords, {
    message: PASSWORD_NOT_MATCH_MESSAGE,
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
