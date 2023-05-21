import React from 'react'
import {Link} from 'react-router-dom'

function RegisterPage() {
  return (
    <div className='flex justify-center items-center h-screen '>
      <div className='bg-secondary px-10 py-6  rounded-2xl w-[450px] flex flex-col gap-3 justify-center items-center'>
        <div className='text-2xl'>Create an acoount</div>
        <div className=' w-full  flex flex-col gap-2'>
            Your email
            <input type="email" name='email' placeholder='abc123@gmail.com'/>
        </div>
        <div className=' w-full  flex flex-col gap-2'>
            Your name
            <input type="text" name='name' placeholder='Ram'/>
        </div>
        <div className=' w-full  flex flex-col gap-2'>
            Your password
            <input type="password" name='password' placeholder='Password'/>
        </div>
        <button className='mt-3 hover:scale-95 hover:transition-all duration-75'>
            Create an account
        </button>
        <div>
        Already have an account? <Link to={'/login'} className='text-myBlue'>Login here</Link>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
