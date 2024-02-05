import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hook';
import { allUsersSelector } from '../../features/all_users_admin/allUsersSlice';
import { loggedInUserSelector } from '../../features/logged_in_user/loggedInUserSlice'; 
import  {getAllUsersApi}  from '../../features/all_users_admin/allUsersAPI';

const AdminMainPage = () => {
    const [isUsersShown, setIsUsersShown] = useState(false);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const loggedInUser = useAppSelector(loggedInUserSelector);
    const allUsers = useAppSelector(allUsersSelector);  
    useEffect(() => {
        
        dispatch(getAllUsersApi());
    }, []);
 const showAllUsers = () => {
        setIsUsersShown(true);
       
 }
 const AddNewProductPressed = () => {
        navigate('/add_new_product');
 }
    return (
        <div>
            <h1>איזור מנהלים</h1>
            {loggedInUser && <h2>ברוך הבא בוס גדול  {loggedInUser.first_name}</h2>  }
            <button onClick={showAllUsers}>Manage Users</button>
            <button onClick={AddNewProductPressed}>Add New Product</button>
            <button>Manage Products</button>
            <button onClick={() => navigate('/')}>חזור</button>

            {isUsersShown && allUsers && allUsers.map((user) => {
                return (
                    <div key={user.email}>
                        <h3>{user.email}</h3>
                        <button>Block</button>
                        <button>Unblock</button>
                    </div>
                )
            })}
            
        </div>
    )
}

export default AdminMainPage