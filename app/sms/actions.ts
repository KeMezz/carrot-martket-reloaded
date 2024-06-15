"use server";

import { z } from "zod";
import validator from "validator";
import { redirect } from "next/navigation";
import { PHONE_ERROR_MESSAGE } from "@/lib/constants";
import db from "@/lib/db";
import crypto from "crypto";

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

/**
 * 새로운 6자리 토큰을 생성합니다.
 * @returns 새로운 6자리 토큰
 */
async function getToken() {
  const token = crypto.randomInt(100000, 999999).toString();
  const exists = await db.sMSToken.findUnique({
    where: {
      token,
    },
    select: {
      id: true,
    },
  });
  if (exists) {
    return getToken();
  } else {
    return token;
  }
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
      // delete every previous token
      await db.sMSToken.deleteMany({
        where: {
          user: {
            phone: result.data,
          },
        },
      });

      // create a new token and save it to the database
      const token = await getToken();
      await db.sMSToken.create({
        data: {
          token,
          user: {
            connectOrCreate: {
              // if the user exists, connect to the user
              where: {
                phone: result.data,
              },
              // if the user does not exist, create a new user
              create: {
                username: crypto.randomBytes(10).toString("hex"), // random username
                phone: result.data,
              },
            },
          },
        },
      });

      // send the token using twilio
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
