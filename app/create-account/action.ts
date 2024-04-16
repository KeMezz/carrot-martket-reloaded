"use server";

import { z } from "zod";

const passwordRegex = new RegExp(/^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{10,}$/);

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
      .min(3, "이름은 최소 3글자 이상이어야 해요")
      .max(20, "이름은 최대 20글자 이하여야 해요")
      .toLowerCase()
      .trim()
      .refine(checkUsername, "이름에 'potato'가 포함되어 있어요"),
    email: z
      .string()
      .email({ message: "올바른 형식의 이메일을 입력해주세요" })
      .toLowerCase(),
    password: z
      .string()
      .min(10, "비밀번호는 최소 10글자 이상이어야 해요")
      .regex(passwordRegex, "비밀번호는 영문, 숫자, 특수문자를 포함해야 해요"),
    confirm_password: z
      .string()
      .min(10, "비밀번호는 최소 10글자 이상이어야 해요"),
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

  const result = formSchema.safeParse(data);
  if (!result.success) {
    return { errors: result.error.flatten() };
  } else {
    console.log(result.data);
  }
}
