"use server";

import twilio from "twilio";
import { z } from "zod";
import validator from "validator";
import { redirect } from "next/navigation";
import { PHONE_ERROR_MESSAGE } from "@/lib/constants";
import db from "@/lib/db";
import crypto from "crypto";
import { loginByUserId } from "@/lib/session";

const phoneSchema = z
  .string()
  .trim()
  .refine(
    (phone) => validator.isMobilePhone(phone, "ko-KR"),
    PHONE_ERROR_MESSAGE
  );

/**
 * 토큰이 존재하는지 확인합니다.
 * @param token 유저가 입력한 토큰
 * @returns 토큰이 존재하는지 여부
 */
async function tokenExists(token: number) {
  const exists = await db.sMSToken.findUnique({
    where: {
      token: token.toString(),
    },
    select: {
      id: true,
    },
  });
  return Boolean(exists);
}

/**
 * 토큰을 검증합니다.
 */
const tokenSchema = z.coerce
  .number()
  .min(100000)
  .max(999999)
  .refine(tokenExists, "토큰이 올바르지 않습니다.");

interface ActionState {
  vertification_token: boolean;
}

/**
 * Performs SMS login based on the provided form data.
 * @param prevState The previous state of the action.
 * @param formData The form data containing the phone and verification token.
 * @returns The updated state of the action.
 */
export async function smsLogin(prevState: ActionState, formData: FormData) {
  const phone = formData.get("phone");
  const vertification_token = formData.get("vertification_token");

  const phoneExists = await checkPhoneExists(phone);
  if (!phoneExists) {
    return {
      vertification_token: false,
      error: {
        phone: PHONE_ERROR_MESSAGE,
      },
    };
  }

  if (!prevState.vertification_token) {
    const result = validatePhone(phone);
    if (!result.success) {
      return {
        vertification_token: false,
        error: result.error.flatten(),
      };
    } else {
      await deletePreviousTokens(result.data);

      const token = await generateToken();
      await saveToken(token, result.data);

      await sendVerificationCode(token, result.data);

      return {
        vertification_token: true,
      };
    }
  } else {
    const result = await validateToken(vertification_token);
    if (!result.success) {
      return {
        vertification_token: true,
        error: result.error.flatten(),
      };
    } else {
      const token = await getTokenById(result.data.toString());
      const phoneMatches = await checkPhoneMatches(
        token?.userId!,
        phone as string
      );
      if (!phoneMatches) {
        return {
          vertification_token: true,
          error: {
            phone: "전화번호가 일치하지 않습니다.",
          },
        };
      }

      await loginUserAndDeleteToken(token);

      redirect("/profile");
    }
  }
}

async function checkPhoneExists(
  phone: FormDataEntryValue | null
): Promise<boolean> {
  const phoneExists = await db.user.findFirst({
    where: {
      phone: phone as string,
    },
    select: {
      id: true,
    },
  });
  return Boolean(phoneExists);
}

function validatePhone(
  phone: FormDataEntryValue | null
): z.SafeParseReturnType<string, string> {
  return phoneSchema.safeParse(phone);
}

async function deletePreviousTokens(phone: string): Promise<void> {
  await db.sMSToken.deleteMany({
    where: {
      user: {
        phone,
      },
    },
  });
}

async function generateToken(): Promise<string> {
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
    return generateToken();
  } else {
    return token;
  }
}

async function saveToken(token: string, phone: string): Promise<void> {
  await db.sMSToken.create({
    data: {
      token,
      user: {
        connectOrCreate: {
          where: {
            phone,
          },
          create: {
            username: crypto.randomBytes(10).toString("hex"),
            phone,
          },
        },
      },
    },
  });
}

async function sendVerificationCode(
  token: string,
  phone: string
): Promise<void> {
  const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
  await twilioClient.messages.create({
    body: `Your verification code is ${token}`,
    from: process.env.TWILIO_PHONE!,
    to: process.env.MY_PHONE!,
  });
}

async function validateToken(
  token: FormDataEntryValue | null
): Promise<z.SafeParseReturnType<number, number>> {
  return tokenSchema.safeParse(token);
}

async function getTokenById(
  token: string
): Promise<{ id: number; userId: number } | null> {
  return db.sMSToken.findUnique({
    where: {
      token,
    },
    select: {
      id: true,
      userId: true,
    },
  });
}

async function checkPhoneMatches(
  userId: number | null,
  phone: string
): Promise<boolean> {
  const phoneMatches = await db.user.findFirst({
    where: {
      id: userId!,
      phone,
    },
    select: {
      id: true,
    },
  });
  return Boolean(phoneMatches);
}

async function loginUserAndDeleteToken(
  token: { id: number; userId: number } | null
): Promise<void> {
  if (token) {
    await loginByUserId(token.userId);
    await db.sMSToken.delete({
      where: {
        id: token.id,
      },
    });
  }
}
