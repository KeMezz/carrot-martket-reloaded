import FormButton from "@/components/form-btn";
import FormInput from "@/components/form-input";
import SocialLogin from "@/components/social-login";

export default function Login() {
  // Server Action
  const handleForm = async (formData: FormData) => {
    "use server";

    await new Promise((resolve) => setTimeout(resolve, 4000));
    console.log(formData.get("email"), formData.get("password"));
    console.log("i run in the server!");
  };
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-black">로그인</h1>
        <h2 className="font-medium text-xl">
          가입할 때 사용한 정보를 입력해주세요
        </h2>
      </div>
      <form method="POST" action={handleForm} className="flex flex-col gap-5">
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
        <FormButton
          loading={false}
          text="로그인"
          loadingMessage="로그인 하는 중..."
        />
      </form>
      <SocialLogin />
    </div>
  );
}
