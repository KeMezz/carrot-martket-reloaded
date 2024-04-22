"use server";

export async function smsLogin(prevState: any, formData: FormData) {
  const data = {
    phone_number: formData.get("phone_number"),
  };
  console.log(data);
  return null;
}
