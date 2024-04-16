import FormButton from "@/components/button";
import FormInput from "@/components/input";

export default function SMSLogin() {
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-black">문자 인증으로 로그인</h1>
        <h2 className="font-medium text-xl">
          휴대폰 번호를 이용해서 로그인 할 수 있어요
        </h2>
      </div>
      <form className="flex flex-col gap-5">
        <FormInput
          name="phone"
          type="number"
          placeholder="휴대폰 번호"
          required={true}
        />
        <FormInput
          name="vertification_code"
          type="number"
          placeholder="인증 코드"
          required={true}
        />
        <FormButton text="인증하기" />
      </form>
    </div>
  );
}
