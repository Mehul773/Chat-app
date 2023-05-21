import React from 'react'
import {Link} from 'react-router-dom'


function LoginPage() {
  return (
    <div className='flex justify-center items-center h-screen '>
      <div className='bg-secondary px-10 py-6  rounded-2xl w-[450px] flex flex-col gap-3 justify-center items-center'>
        <div className='text-2xl'>Login</div>
        <div className=' w-full  flex flex-col gap-2'>
            Your email
            <input type="email" name='email' placeholder='abc123@gmail.com'/>
        </div>
        <div className=' w-full  flex flex-col gap-2'>
            Your password
            <input type="password" name='password' placeholder='Password'/>
        </div>
        <button className='mt-3 hover:scale-95 hover:transition-all duration-75'>
            Login
        </button>
        <div>
        Don't have an account yet? <Link to={'/register'} className='text-myBlue'>Create account</Link>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
