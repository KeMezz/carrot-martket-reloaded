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
    return createToken();
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

      // create token
      const token = await getToken();
      await db.sMSToken.create({
        data: {
          token,
          user: {
            connectOrCreate: {
              where: {
                phone: result.data,
              },
              create: {
                username: crypto.randomBytes(10).toString("hex"),
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
