import TextInput from 'src/components/TextInput'
import Button from 'src/components/Button'
import useNotifyRender from 'src/hooks/useNotifyRender'
import SelectInput from 'src/components/SelectInput'
import { MyFormValidateProps, rhfSchema } from 'src/service/service.validation'
import { Controller, useForm } from 'react-hook-form'

const options = [
  { value: 'a', label: 'a' },
  { value: 'b', label: 'b' },
  { value: 'c', label: 'c' },
]

const RHF = () => {
  const notifyRenderRef = useNotifyRender()
  const submitCallback = async ({ email, password, options }: MyFormValidateProps) => {
    try {
      const message = `Email: ${email} & Password: ${password} & Options ${options.join(',')}`
      alert(message)
    } catch (error) {
      alert(error)
    }
  }
  const {
    register,
    handleSubmit,
    formState,
    control,
    formState: { errors },
  } = useForm<MyFormValidateProps>({
    defaultValues: {
      email: '',
      password: '',
      options: [],
    },
    mode: 'onChange',
    resolver: rhfSchema,
  })
  const isSignUpValidate = !formState.isValid
  return (
    <div
      ref={notifyRenderRef}
      className="mx-auto my-auto flex w-1/2 min-w-max flex-col items-center justify-center rounded-lg bg-white p-6 shadow-md "
    >
      <h1 className="text-3xl font-bold">My custom hooks Form</h1>
      <form
        onSubmit={handleSubmit(submitCallback)}
        className="mx-auto my-auto mt-12 flex w-full flex-col items-center justify-center gap-4"
      >
        <TextInput
          id="email"
          label="Email"
          placeholder="Email address *"
          errorMessage={errors.email?.message}
          {...register('email')}
        />
        <TextInput
          id="password"
          label="Password"
          placeholder="Password *"
          errorMessage={errors.password?.message}
          {...register('password')}
        />
        <Controller
          name="options"
          control={control}
          render={({ field: { onChange, onBlur, value, name }, fieldState: { error } }) => (
            <SelectInput
              id={name}
              options={options}
              value={value}
              label="Options"
              placeholder="Options *"
              errorMessage={error?.message}
              onBlur={onBlur}
              onChange={onChange}
            />
          )}
        />

        <Button text="SUBMIT" disabled={isSignUpValidate} />
      </form>
    </div>
  )
}

export default RHF
