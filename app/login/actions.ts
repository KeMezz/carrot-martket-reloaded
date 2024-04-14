"use server";

export async function handleForm(prevState: any, formData: FormData) {
  await new Promise((resolve) => setTimeout(resolve, 4000));
  console.log(prevState);
  console.log(formData.get("email"), formData.get("password"));
  console.log("i run in the server!");
  return {
    errors: ["잘못된 계정 정보입니다.", "비밀번호가 너무 짧습니다."],
  };
}
