import React, { useState, useEffect } from 'react';
import {
    useNavigate
} from "react-router-dom";
import { useSelector } from 'react-redux';
function UserHomePage() {
    const navigate = useNavigate();
    const loginState = useSelector((state) => state.loginReducer._isLogin);
    useEffect(() => {
        if (!localStorage.getItem("session_token") && loginState === false) {
            navigate("/")
        }
    });
    return (
        <div>
            {/* <h1>Pied</h1> */}
        </div>
    );
}

export default UserHomePage;
