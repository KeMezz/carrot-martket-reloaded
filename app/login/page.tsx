import FormButton from "@/components/form-btn";
import FormInput from "@/components/form-input";
import SocialLogin from "@/components/social-login";

export default function Login() {
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-black">로그인</h1>
        <h2 className="font-medium text-xl">
          가입할 때 사용한 정보를 입력해주세요
        </h2>
      </div>
      <form className="flex flex-col gap-5">
        <FormInput
          type="email"
          placeholder="이메일"
          required={true}
          errors={[]}
        />
        <FormInput
          type="password"
          placeholder="비밀번호"
          required={true}
          errors={[]}
        />
        <FormButton loading={false} text="로그인" />
      </form>
      <SocialLogin />
    </div>
  );
}
