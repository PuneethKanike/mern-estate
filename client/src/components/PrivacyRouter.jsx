import { useSelector } from "react-redux"
import { Outlet, Navigate } from "react-router-dom";

function PrivacyRouter() {
    const { currentUser } = useSelector((state) => state.user);
    return currentUser ? <Outlet /> : <Navigate to='/signin' />;   //here we protected the user, if user is not signed in , and if he tries to go to the profile page then he will be redirected to the signin page itself
}

export default PrivacyRouter
