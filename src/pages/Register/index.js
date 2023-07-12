import { useEffect } from 'react';
import { Form, message,Input} from 'antd';
import Button from '../../components/Button';
import {Link, useNavigate} from 'react-router-dom';
import { RegisterUser } from '../../apicalls/users';
function Register() {
  const navigate = useNavigate();
  const onFinish = async(value) => {
    try{
        const response = await RegisterUser(value)
        if(response.success){
            message.success(response.message)
        } else {
            message.error(response.message)
        }
    }catch(err){
        console.log(err);
        message.error(err.message);
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
            Regitration
        </h1>
        <hr/>
        <Form
            layout='vertical'
            className='mt-1'
            onFinish={onFinish}
        >
            <Form.Item
                label="Name"
                name="name"
                rules={[{required: true, message: "Please input your name"}]}>
                <Input type='text'/>
            </Form.Item>
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
                        message: "Please input your email"
                    }]}>
                <Input />
            </Form.Item>
            <Form.Item
                label="Password"
                name="password"
                rules={[{required: true, message: "Please input your password"}]}>
                    <Input.Password/>
                </Form.Item>
                <div className='flex flex-col mt-2 gap-1'>
                    <Button title='Register'  type='submit'  fullWidth/>
                    <Link className='text-primary' to="/login">Already have account</Link>
                </div>

        </Form>
     </div>
    </div>


  )
}
export default Register;
