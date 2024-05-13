"use server";

import {
  EMAIL_ERROR_MESSAGE,
  PASSWORD_MIN_ERROR_MESSAGE,
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR_MESSAGE,
  USERNAME_MAX_ERROR_MESSAGE,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_ERROR_MESSAGE,
  USERNAME_MIN_LENGTH,
} from "@/lib/constants";
import db from "@/lib/db";
import { z } from "zod";

const checkUsername = (username: string) => !username.includes("potato");
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
        invalid_type_error: "유효하지 않은 형식입니다",
        required_error: "이름은 필수 입력 사항이에요",
      })
      .min(USERNAME_MIN_LENGTH, USERNAME_MIN_ERROR_MESSAGE)
      .max(USERNAME_MAX_LENGTH, USERNAME_MAX_ERROR_MESSAGE)
      .toLowerCase()
      .trim()
      .refine(checkUsername, "이름에 'potato'가 포함되어 있어요"),
    email: z.string().email({ message: EMAIL_ERROR_MESSAGE }).toLowerCase(),
    password: z.string(),
    // .min(PASSWORD_MIN_LENGTH, PASSWORD_MIN_ERROR_MESSAGE)
    // .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR_MESSAGE),
    confirm_password: z
      .string()
      .min(PASSWORD_MIN_LENGTH, PASSWORD_MIN_ERROR_MESSAGE),
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
  const result = formSchema.safeParse(data);
  if (!result.success) {
    return { errors: result.error.flatten() };
  } else {
    // 유저명이 이미 존재하는지 확인한다
    const user = await db.user.findUnique({
      where: {
        username: result.data.username,
      },
      select: {
        id: true,
      },
    });
    if (user) {
      // 에러 메시지를 보여준다
    }

    // 이메일이 이미 존재하는지 확인한다
    const userEmail = await db.user.findUnique({
      where: {
        email: result.data.email,
      },
      select: {
        id: true,
      },
    });
    if (userEmail) {
      // 에러 메시지를 보여준다
    }

    // 패스워드를 해싱한패

    // 데이터베이스에 유저를 추가한터

    // 유저를 로그인 시킨다

    // 유저를 /home 페이지로 리다이렉트 시킨다
  }
}
