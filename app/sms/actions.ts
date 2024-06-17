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

/**
 * Performs SMS login based on the provided form data.
 * @param prevState The previous state of the action.
 * @param formData The form data containing the phone and verification token.
 * @returns The updated state of the action.
 */
export async function smsLogin(prevState: ActionState, formData: FormData) {
  const phone = formData.get("phone");
  // TODO: 휴대폰 번호가 실존하는지 검증하고, 존재하지 않는 번호라면 에러를 반환합니다.
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

      const twilioClient = twilio(
        process.env.TWILIO_SID,
        process.env.TWILIO_TOKEN
      );
      await twilioClient.messages.create({
        body: `Your verification code is ${token}`,
        from: process.env.TWILIO_PHONE!,
        // to: result.data,
        to: process.env.MY_PHONE!,
      });

      // send the token using twilio
      return {
        vertification_token: true,
      };
    }
  } else {
    const result = await tokenSchema.spa(vertification_token);
    if (!result.success) {
      return {
        vertification_token: true,
        error: result.error.flatten(),
      };
    } else {
      // TODO: 토큰을 검증할 때, 전화번호도 함께 검증하여 일치하지 않는 경우 에러를 반환합니다.

      // get the userId of token
      const token = await db.sMSToken.findUnique({
        where: {
          token: result.data.toString(),
        },
        select: {
          id: true,
          userId: true,
        },
      });

      // log the user in and delete the token
      if (token) {
        await loginByUserId(token.userId);
        await db.sMSToken.delete({
          where: {
            id: token.id,
          },
        });
      }

      // redirect to the homepage
      redirect("/profile");
    }
  }
}
