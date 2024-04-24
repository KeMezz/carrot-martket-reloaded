"use server";

import { z } from "zod";
import validator from "validator";

const phoneSchema = z
  .string()
  .trim()
  .refine((phone) => validator.isMobilePhone(phone, "ko-KR"));
const tokenSchema = z.coerce.number().min(100000).max(999999);

export async function smsLogin(prevState: any, formData: FormData) {
  const data = {
    phone_number: formData.get("phone_number"),
    token: formData.get("token"),
  };
  console.log(data);
  return null;
}
