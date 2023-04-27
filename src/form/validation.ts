import { emailRegex } from 'src/constants/service.constant';

export interface MyFormValidateProps {
  email: string;
  password: string;
  options: string[];
}

export const myFormValidate = ({ email, password, options }: MyFormValidateProps) => {
  const validateErrors = {
    email: '',
    password: '',
    options: '',
  };
  if (!email) {
    validateErrors.email = '이메일이 입력되지 않았습니다. ';
  } else if (!email.match(emailRegex)) {
    validateErrors.email = '이메일 형식으로 입력해주세요.';
  }

  if (!password) {
    validateErrors.password = '비빌번호가 입력되지 않았습니다. ';
  } else if (password.length < 8 || password.length > 20) {
    validateErrors.password = '비빌번호는 8자 이상 20자 이하이어야 합니다. ';
  }

  if (options.length === 0) {
    validateErrors.options = '옵션이 입력되지 않았습니다. ';
  }

  return validateErrors;
};
