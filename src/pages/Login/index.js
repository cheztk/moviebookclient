import { Form, message, Input} from 'antd';
import Button from '../../components/Button';
import {Link, useNavigate} from 'react-router-dom';
import { LoginUser } from '../../apicalls/users';
import { useEffect, useState } from 'react';


function Login() {

    
    const navigate = useNavigate();

    const onFinish = async (value) => {
        try{
            const response = await LoginUser(value);

            if(response.success){

                localStorage.setItem("token", response.data);
                console.log('token', response.data);
                message.success(response.message)
                //window.location.href = "/";
                navigate("/",{replace: true});
            }else{
                message.error(response.message)
            }
        }catch(err){
            message.error(err.message)
        }
      }

      useEffect(() => {
        if(localStorage.getItem('token')){
            navigate('/');
        }
      },[])

      return (

        <div className='flex justify-center h-screen items-center bg-primary' >
         <div className='card p-3 w-400'>
            <h1 className='text-xl mb-1'>
                Login
            </h1>
            <hr/>
            <Form
                layout='vertical'
                className='mt-1'
                onFinish={onFinish}
            >
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        {
                            type: 'email',
                            message: 'Please input valid email'
                        },
                        {
                            required: true, 
                            message: "Please input your email"}
                    ]}>
                    <Input/>
                </Form.Item>
                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{required: true, message: "Please input your password"}]}>
                        <Input.Password />
                    </Form.Item>
                    <div className='flex flex-col mt-2 gap-1'>
                        <Button title='Login'  type='submit'  fullWidth/>
                        <Link className='text-primary' to="/register">Don't have account, Register</Link>
                    </div>

            </Form>
         </div>
        </div>


      )
  }
  export default Login;
