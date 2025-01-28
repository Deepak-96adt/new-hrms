import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector,useDispatch } from 'react-redux';
import { updateTokens } from "./Store/authSlice";
import axios from "axios";

export const RefreshToken = () => {
        const navigate = useNavigate();
        const  token = useSelector((state) => state.auth.token);
        const  refreshToken = useSelector((state) => state.auth.refreshToken);
        const  tokenExpiry = useSelector((state) => state.auth.tokenExpiry);
        const dispatch = useDispatch();

    useEffect(() => {
      const intervalId = setInterval(() => {
        console.log(token);
        console.log(tokenExpiry-60000);

        axios
           .post('apigateway/api/auth/refresh', 
            {
                refreshToken: refreshToken,                    
            }
           ) 
           .then((res) => {
             console.log("then block");
            //  console.log(res);
             const newToken = res.data.accessToken;
             const newRefreshToken = res.data.refreshToken;
             const newTokenExpiry = res.data.expiryDuration;
             dispatch(updateTokens({
                ntoken: newToken,
                nrefreshToken: newRefreshToken, // Optional, if you want to update refreshToken as well
                ntokenExpiry : newTokenExpiry
              }));
            //  console.log(newToken);  
        })
        .catch((refreshError) => {
          // console.log("catch block");
          // console.log(refreshError);
          
           axios
                .post(
                  `/apigateway/api/user/logout`,
                  {
                    deviceInfo: {
                      deviceId: "D1",
                      deviceType: "DEVICE_TYPE_ANDROID",
                      notificationToken: null,
                    },
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                )
                .then((res) => {
                  if (res.status === 200) {
                      navigate("/");
                      window.location.reload();
                      localStorage.clear();
                  }
                })
        });
      }, tokenExpiry-60000); 
  
      return () => clearInterval(intervalId);
    }, [token,refreshToken]);
  
    return <></>;
  };
  