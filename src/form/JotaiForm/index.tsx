import TextInput from 'src/components/TextInput'
import Button from 'src/components/Button'
import useNotifyRender from 'src/hooks/useNotifyRender'
import SelectInput from 'src/components/SelectInput'
import { MyFormValidateProps, myFormValidate } from 'src/service/service.validation'
import useJotaiForm from 'src/form/JotaiForm/useJotaiForm'

const options = [
  { value: 'a', label: 'a' },
  { value: 'b', label: 'b' },
  { value: 'c', label: 'c' },
]

const JotaiForm = () => {
  const notifyRenderRef = useNotifyRender()
  const submitCallback = async ({ email, password, options }: MyFormValidateProps) => {
    try {
      const message = `Email: ${email} & Password: ${password} & Options ${options.join(',')}`
      alert(message)
    } catch (error) {
      alert(error)
    }
  }
  const { register, submitHandler, isTargetSatisfyValidate } = useJotaiForm({
    initialValues: { email: '', password: '', options: [] as string[] },
    validate: myFormValidate,
    submitCallback,
    mode: 'onBlur',
  })
  const isSignUpValidate = isTargetSatisfyValidate('email', 'password')
  return (
    <div
      ref={notifyRenderRef}
      className="mx-auto my-auto flex w-1/2 min-w-max flex-col items-center justify-center rounded-lg bg-white p-6 shadow-md "
    >
      <h1 className="text-3xl font-bold">My custom hooks Form</h1>
      <form
        onSubmit={submitHandler}
        className="mx-auto my-auto mt-12 flex w-full flex-col items-center justify-center gap-4"
      >
        <TextInput label="Email" placeholder="Email address *" {...register('email')} />
        <TextInput label="Password" placeholder="Password *" {...register('password')} />
        <SelectInput label="Options" placeholder="Options *" options={options} {...register('options')} />
        <Button text="SUBMIT" disabled={!isSignUpValidate} />
      </form>
    </div>
  )
}

export default JotaiForm
