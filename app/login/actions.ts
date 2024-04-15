"use server";

export async function handleForm(prevState: any, formData: FormData) {
  return {
    errors: ["잘못된 계정 정보입니다.", "비밀번호가 너무 짧습니다."],
  };
}
