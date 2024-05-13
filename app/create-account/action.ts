"use server";

import {
  EMAIL_ALREADY_EXISTS_MESSAGE,
  EMAIL_ERROR_MESSAGE,
  INVALID_TYPE_ERROR_MESSAGE,
  PASSWORD_MIN_ERROR_MESSAGE,
  PASSWORD_MIN_LENGTH,
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

const checkPasswords = ({
  password,
  confirm_password,
}: {
  password: string;
  confirm_password: string;
}) => password === confirm_password;

const checkUsername = async (username: string) => {
  const user = await db.user.findUnique({
    where: {
      username: username,
    },
    select: {
      id: true,
    },
  });
  return !!user;
};

const checkUserEmail = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email: email,
    },
    select: {
      id: true,
    },
  });
  return !!user;
};

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
      .trim()
      .refine(checkUsername, USERNAME_ALREADY_EXISTS_MESSAGE),
    email: z
      .string()
      .email({ message: EMAIL_ERROR_MESSAGE })
      .toLowerCase()
      .refine(checkUserEmail, EMAIL_ALREADY_EXISTS_MESSAGE),
    password: z.string(),
    // .min(PASSWORD_MIN_LENGTH, PASSWORD_MIN_ERROR_MESSAGE)
    // .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR_MESSAGE),
    confirm_password: z.string(),
    // .min(PASSWORD_MIN_LENGTH, PASSWORD_MIN_ERROR_MESSAGE),
  })
  .refine(checkPasswords, {
    message: "비밀번호가 일치하지 않아요",
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
  const result = await formSchema.safeParseAsync(data);
  if (!result.success) {
    return { errors: result.error.flatten() };
  } else {
    // 패스워드를 해싱한다
    // 데이터베이스에 유저를 추가한다
    // 유저를 로그인 시킨다
    // 유저를 /home 페이지로 리다이렉트 시킨다
  }
}
