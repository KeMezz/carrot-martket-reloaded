"use server";

import { z } from "zod";
import validator from "validator";
import { redirect } from "next/navigation";
import { PHONE_ERROR_MESSAGE } from "@/lib/constants";

const phoneSchema = z
  .string()
  .trim()
  .refine(
    (phone) => validator.isMobilePhone(phone, "ko-KR"),
    PHONE_ERROR_MESSAGE
  );

const tokenSchema = z.coerce.number().min(100000).max(999999);

interface ActionState {
  vertification_token: boolean;
}

export async function smsLogin(prevState: ActionState, formData: FormData) {
  const phone = formData.get("phone");
  const vertification_token = formData.get("vertification_token");
  if (!prevState.vertification_token) {
    const result = phoneSchema.safeParse(phone);
    if (!result.success) {
      return {
        vertification_token: false,
        error: result.error.flatten(),
      };
    } else {
      return {
        vertification_token: true,
      };
    }
  } else {
    const result = tokenSchema.safeParse(vertification_token);
    if (!result.success) {
      return {
        vertification_token: true,
        error: result.error.flatten(),
      };
    } else {
      redirect("/");
    }
  }
}
