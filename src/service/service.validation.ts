import { yupResolver } from '@hookform/resolvers/yup'
import { emailRegex } from 'src/service/service.constant'
import * as yup from 'yup'

export interface MyFormValidateProps {
  email: string
  password: string
  options: Array<{ label: string; value: string }>
}

export const myFormValidate = ({ email, password, options }: MyFormValidateProps) => {
  const validateErrors = {
    email: '',
    password: '',
    options: '',
  }
  if (!email) {
    validateErrors.email = '이메일이 입력되지 않았습니다.'
  } else if (!email.match(emailRegex)) {
    validateErrors.email = '이메일 형식으로 입력해주세요.'
  }

  if (!password) {
    validateErrors.password = '비빌번호가 입력되지 않았습니다.'
  } else if (password.length < 8 || password.length > 20) {
    validateErrors.password = '비빌번호는 8자 이상 20자 이하이어야 합니다. '
  }

  if (options.length === 0) {
    validateErrors.options = '옵션이 입력되지 않았습니다. '
  }

  return validateErrors
}

export const fastFormValidate = {
  email(email: string): string {
    if (!email) {
      return '이메일이 입력되지 않았습니다.'
    } else if (!email.match(emailRegex)) {
      return '이메일 형식으로 입력해주세요.'
    }
    return ''
  },
  password(password: string): string {
    if (!password) {
      return '비빌번호가 입력되지 않았습니다.'
    } else if (password.length < 8 || password.length > 20) {
      return '비빌번호는 8자 이상 20자 이하이어야 합니다. '
    }
    return ''
  },
  options(options: Array<{ label: string; value: string }>): string {
    if (options.length === 0) {
      return '옵션이 입력되지 않았습니다. '
    }
    return ''
  },
}

export const rhfSchema = yupResolver(
  yup
    .object({
      email: yup
        .string()
        .required('이메일이 입력되지 않았습니다.')
        .matches(emailRegex, '이메일 형식으로 입력해주세요.'),
      password: yup
        .string()
        .required('비밀번호가 입력되지 않았습니다.')
        .min(8, '비밀번호는 8자 이상이어야 합니다.')
        .max(20, '비밀번호는 20자 이하이어야 합니다.'),
      options: yup
        .array()
        .of(
          yup.object().shape({
            label: yup.string().required('옵션 레이블이 입력되지 않았습니다.'),
            value: yup.string().required('옵션 값이 입력되지 않았습니다.'),
          }),
        )
        .min(1, '옵션을 최소 한 개 이상 입력해야 합니다.')
        .required('옵션이 입력되지 않았습니다.'),
    })
    .required(),
)
