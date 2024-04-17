"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import SocialLogin from "@/components/social-login";
import { useFormState } from "react-dom";
import createAccount from "./action";

export default function CreateAccount() {
  const [state, action] = useFormState(createAccount, null);
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">계정 만들기</h1>
        <h2 className="font-medium text-lg">
          당근마켓에서 사용할 정보를 입력해주세요.
        </h2>
      </div>
      <form method="POST" action={action} className="flex flex-col gap-5">
        <Input
          name="username"
          type="text"
          placeholder="이름"
          required={true}
          minLength={2}
          maxLength={15}
          errors={state?.errors.fieldErrors.username}
        />
        <Input
          name="email"
          type="email"
          placeholder="이메일"
          required={true}
          errors={state?.errors.fieldErrors.email}
        />
        <Input
          name="password"
          type="password"
          placeholder="비밀번호"
          required={true}
          minLength={10}
          errors={state?.errors.fieldErrors.password}
        />
        <Input
          name="confirm_password"
          type="password"
          placeholder="비밀번호 확인"
          required={true}
          minLength={10}
          errors={state?.errors.fieldErrors.confirm_password}
        />
        <Button text="계정 만들기" loadingMessage="계정 생성 중..." />
      </form>
      <SocialLogin />
    </div>
  );
}
