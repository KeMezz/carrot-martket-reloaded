import FormButton from "@/components/form-btn";
import FormInput from "@/components/form-input";
import SocialLogin from "@/components/social-login";
import { ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function CreateAccount() {
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-black">계정 만들기</h1>
        <h2 className="font-medium text-xl">
          당근마켓에서 사용할 정보를 입력할 수 있어요.
        </h2>
      </div>
      <form className="flex flex-col gap-5">
        <FormInput
          name="username"
          type="text"
          placeholder="이름"
          required={true}
          errors={[]}
        />
        <FormInput
          name="email"
          type="email"
          placeholder="이메일"
          required={true}
          errors={[]}
        />
        <FormInput
          name="password"
          type="password"
          placeholder="비밀번호"
          required={true}
          errors={[]}
        />
        <FormInput
          name="confirm_password"
          type="password"
          placeholder="비밀번호 확인"
          required={true}
          errors={[]}
        />
        <FormButton
          loading={false}
          text="계정 만들기"
          loadingMessage="계정 생성 중..."
        />
      </form>
      <SocialLogin />
    </div>
  );
}
