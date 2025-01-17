import imgBg from "@/assets/images/img_bg.png"
import { axiosInstance } from "@/libs/axios"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

type ValidationError = {
  type: string
  value: string
  msg: string
  path: string
  location: string
}

export default function LoginPage() {
  const navigate = useNavigate()

  const [isError, setIsError] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [errors, setErrors] = useState<ValidationError[]>([])

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const { data } = await axiosInstance.post("/auth/sign-in", {
        email,
        password,
      })

      if (data.status === "OK") {
        setIsError(false)

        localStorage.setItem("user", JSON.stringify(data.data.user))
        localStorage.setItem("token", data.data.token)

        navigate("/dashboard")
      }
    } catch (error: any) {
      setIsError(true)
      setErrorMsg(error.response.data.message)
      setErrors(error.response.data?.errors)
    }
  }

  return (
    <div className='container-fluid px-0'>
      <div className='row min-vh-100'>
        <div className='col-xl-8 col-lg-7 d-lg-block d-none'>
          <img src={imgBg} className='w-100 h-100 object-fit-cover' alt='' />
        </div>
        <div className='login__content col-xl-4 col-lg-5 d-flex flex-column justify-content-center'>
          <Link className='navbar-brand login__title' to='/'>
            Binar Car Rental
          </Link>
          <h1 className='login__title fs-4 fw-bold'>Welcome Back!</h1>
          {isError && (
            <div className='alert alert-danger' role='alert'>
              <p>{errorMsg}</p>
              {errors.map((error, index) => (
                <li key={index}>{error.msg}</li>
              ))}
            </div>
          )}
          <form onSubmit={(e) => handleSubmit(e)}>
            <div className='mb-3'>
              <label className='form-label'>Email</label>
              <input
                type='email'
                className='form-control'
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className='mb-3'>
              <label className='form-label'>Password</label>
              <input
                type='password'
                className='form-control'
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              type='submit'
              className='login__btn btn btn-primary fw-medium'
            >
              Sign In
            </button>
          </form>

          <div className='mt-4'>
            Don't have an account?{" "}
            <Link to='/sign-up' className='fw-medium'>
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
