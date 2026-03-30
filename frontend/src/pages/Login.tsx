import { LockPasswordIcon, Mail02Icon } from 'hugeicons-react'
import { useState } from 'react'

function Login() {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')

  return (
    <div className='flex w-full h-screen'>
      <div className='w-1/2 flex flex-col justify-center items-center'>
        <div className='font-bold text-3xl absolute top-10'>LBMS</div>
        <div>
          <h1 className='text-4xl font-semibold text-center'>Welcome Back</h1>
          <p className='text-center text-gray-600 text-[13px]'>Welcome back, please enter your details.</p>
        </div>
        <div className='mt-5'>
          <div className='relative w-[350px] rounded-2xl bg-gray-100 p-2'>
            <div
              className={`absolute left-2 top-2 h-[calc(100%-16px)] w-[calc(50%-8px)] rounded-2xl bg-white shadow-sm transition-transform duration-300 ease-out ${
                authMode === 'signin' ? 'translate-x-0' : 'translate-x-full'
              }`}
            />
            <div className='relative z-10 grid grid-cols-2 gap-2 text-md'>
              <button
                type='button'
                onClick={() => setAuthMode('signin')}
                className={`rounded-2xl px-9 py-3 w-full transition-colors duration-300 ${
                  authMode === 'signin' ? 'text-black' : 'text-gray-600'
                }`}
              >
                Sign In
              </button>
              <button
                type='button'
                onClick={() => setAuthMode('signup')}
                className={`rounded-2xl px-9 py-3 w-full transition-colors duration-300 ${
                  authMode === 'signup' ? 'text-black' : 'text-gray-600'
                }`}
              >
                Sign Up
              </button>
            </div>
          </div>
          <div className='mt-5 space-y-3'>
            <div className='flex items-center gap-2 border border-gray-300 rounded-2xl px-4 py-2 w-[350px]'>
              <Mail02Icon/>
              <input
              type="email"
              placeholder="example@lbms.com"
              className='outline-none flex-1 py-1'
              />
            </div>
            <div className='flex items-center gap-2 border border-gray-300 rounded-2xl px-4 py-2 w-[350px]'>
              <LockPasswordIcon/>
              <input
                type="password"
                placeholder="*******"
                className='outline-none flex-1 py-1'
              />
            </div>
            <button className='bg-black text-white px-9 py-3 rounded-2xl border-none w-full'>
              {authMode === 'signin' ? 'Sign In' : 'Sign Up'}
            </button>
          </div>
        </div>
      </div>
      <div className='w-1/2 overflow-hidden '>
        <img src="/library gif.gif" alt="Login Background" className='w-full h-full object-cover rounded-l-5xl' />
      </div>
    </div>
  )
}

export default Login