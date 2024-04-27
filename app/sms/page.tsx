"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { smsLogin } from "./actions";
import { useFormState } from "react-dom";

const initialState = {
  vertification_token: false,
  error: undefined,
};

export default function SMSLogin() {
  const [state, action] = useFormState(smsLogin, initialState);

  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-black">문자 인증으로 로그인</h1>
        <h2 className="font-medium text-xl">
          휴대폰 번호를 이용해서 로그인 할 수 있어요
        </h2>
      </div>
      <form className="flex flex-col gap-5" action={action}>
        {state?.vertification_token ? (
          <Input
            key="vertification_token"
            name="vertification_token"
            type="number"
            placeholder="인증 코드"
            errors={state.error?.formErrors}
            required={true}
            min={100000}
            max={999999}
          />
        ) : (
          <Input
            key="phone"
            name="phone"
            type="text"
            placeholder="휴대폰 번호"
            errors={state?.error?.formErrors}
            required={true}
          />
        )}
        <Button
          text={state.vertification_token ? "인증하기" : "인증 문자 보내기"}
        />
      </form>
    </div>
  );
}
