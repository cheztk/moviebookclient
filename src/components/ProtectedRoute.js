import { useEffect } from "react";
import { GetCurrentUser, GetUser } from "../apicalls/users";
import { message } from "antd";
import {useNavigate} from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { SetUser } from "../redux/usersSlice";

function ProtectedRoute({children}) {

    const {user} =  useSelector(state => state.user);
    const dispatch = useDispatch();

    const navigate = useNavigate();

    const getCurrentUser = async () => {
        try{
            const response = await GetUser();
            if(response.success){
                dispatch(SetUser(response.data))
            }else{
               dispatch(SetUser(null))
                message.error(response.message)
            }

        }catch(error){
            dispatch(SetUser(null));
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