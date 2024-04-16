"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import SocialLogin from "@/components/social-login";
import { useFormState } from "react-dom";
import { handleForm } from "./actions";

export default function Login() {
  const [state, action] = useFormState(handleForm, null);
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-black">로그인</h1>
        <h2 className="font-medium text-xl">
          가입할 때 사용한 정보를 입력해주세요
        </h2>
      </div>
      <form method="POST" action={action} className="flex flex-col gap-5">
        <Input name="email" type="email" placeholder="이메일" required={true} />
        <Input
          name="password"
          type="password"
          placeholder="비밀번호"
          required={true}
          errors={state?.errors}
        />
        <Button text="로그인" loadingMessage="로그인 중..." />
      </form>
      <SocialLogin />
    </div>
  );
}
