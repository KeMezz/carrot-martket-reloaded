"use server";

import {
  EMAIL_ERROR_MESSAGE,
  INVALID_USER_MESSAGE,
  PASSWORD_MIN_ERROR_MESSAGE,
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR_MESSAGE,
} from "@/lib/constants";
import bcrypt from "bcrypt";
import db from "@/lib/db";
import { z } from "zod";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";

const checkEmailExists = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });

  return !!user;
};

const formSchema = z.object({
  email: z
    .string()
    .email({ message: EMAIL_ERROR_MESSAGE })
    .toLowerCase()
    .refine(checkEmailExists, INVALID_USER_MESSAGE),
  password: z
    .string()
    .min(PASSWORD_MIN_LENGTH, PASSWORD_MIN_ERROR_MESSAGE)
    .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR_MESSAGE),
});

export async function login(prevState: any, formData: FormData) {
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };
  const result = await formSchema.spa(data);

  if (!result.success) {
    return result.error.flatten();
  } else {
    const user = await db.user.findUnique({
      where: {
        email: result.data.email,
      },
      select: {
        id: true,
        password: true,
      },
    });

    const ok = await bcrypt.compare(result.data.password, user!.password ?? "");
    if (ok) {
      const session = await getSession();
      session.id = user!.id;
      await session.save();
      redirect("/profile");
    } else {
      return {
        fieldErrors: {
          email: [INVALID_USER_MESSAGE],
          password: [INVALID_USER_MESSAGE],
        },
      };
    }

    // 일치하는 경우 유저를 로그인시킨다
  }
}
