import { useEffect, useState } from "react";
import { GetCurrentUser, GetUser } from "../apicalls/users";
import { message } from "antd";
import {useNavigate} from 'react-router-dom';

function ProtectedRoute({children}) {

    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const getCurrentUser = async () => {
        try{
            const response = await GetUser();
            if(response.success){
                setUser(response.data)
            }else{
                setUser(null)
                message.error(response.message)
            }

        }catch(error){
            setUser(null);
            message.error(error.message);
        }
    }

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            navigate("/login");
          } else {
            getCurrentUser();
          }
    },[])
    return(
        user && <div>
            {user.name}
            {children}
        </div>
    )
}
export default ProtectedRoute;