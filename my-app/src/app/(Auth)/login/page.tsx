import React from 'react'

import Form from '../_components/Form'

const Login = () => {
  return (
    <section className='w-full min-h-screen py-14'>
        <div className='container mx-auto'>
            <div className='w-full flex items-center justify-center'>
                <Form FormType="Login"/>
            </div>
        </div>
    </section>
  )
}

export default Login