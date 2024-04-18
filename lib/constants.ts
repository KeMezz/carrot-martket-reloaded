// Constants for validation rules
export const PASSWORD_MIN_LENGTH = 10;
export const PASSWORD_REGEX = new RegExp(
  /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{10,}$/
);
export const USERNAME_MIN_LENGTH = 2;
export const USERNAME_MAX_LENGTH = 15;

// Error messages
export const PASSWORD_MIN_ERROR_MESSAGE = `비밀번호는 최소 ${PASSWORD_MIN_LENGTH}글자 이상이어야 해요`;
export const PASSWORD_REGEX_ERROR_MESSAGE = `비밀번호는 영문, 숫자, 특수문자를 포함해야 해요`;
export const USERNAME_MIN_ERROR_MESSAGE = `이름은 최소 ${USERNAME_MIN_LENGTH}글자 이상이어야 해요`;
export const USERNAME_MAX_ERROR_MESSAGE = `이름은 최대 ${USERNAME_MAX_LENGTH}글자 이하여야 해요`;
export const EMAIL_ERROR_MESSAGE = "올바른 형식의 이메일을 입력해주세요";
