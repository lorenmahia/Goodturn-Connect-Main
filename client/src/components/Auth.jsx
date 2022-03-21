import React ,{useState} from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';

import signinImage from '../assets/worker1.jpeg'
import GoodturnLogo from '../assets/GoodturnLogo.png'


const cookies = new Cookies();
const initialState = {
    fullName: '',
    username: '', 
    password: '',
    confirmPassword: '',
    email: '',
    jobsId: '',
}

const Auth =() => {
const [form, setForm] = useState(initialState);

    const[isSignup, setIsSignup] = useState(true);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        //DEBUGGING STEP 
        //console.log(form)
    }

    const switchMode =() =>{
        setIsSignup((previsSignup) => !previsSignup);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            //Passing form data to backend
       
        const { username, password, email, jobsId  } = form;

        // //will change upon deployment
        const URL = 'https://goodturn-connect.herokuapp.com/auth';

        //data from the backend 
       
        const { data: { token, userId, hashedPassword, fullName } } = await axios.post(`${URL}/${isSignup ? 'signup' : 'login'}`, {
            username, password, fullName: form.fullName, email, jobsId
        },
        {  headers: {
            "Access-Control-Allow-Origin" : `${URL}`,
            'Content-Type': 'application/json'
          },
        });
   
        cookies.set('token', token);
        cookies.set('username', username);
        cookies.set('fullName', fullName);
        cookies.set('userId', userId);
       

        if(isSignup) {
            cookies.set('email', email);
            cookies.set('hashedPassword', hashedPassword);
        }

        window.location.reload();

            
        } catch (error) {
            console.log("Error accessing URL " + error.toString());
        }
      
        
    }

    return (
        <div className='auth__form-container'>
            <div className='auth__form-container_fields'>
                <div className='auth__form-container_fields-content'>
                    <div className='auth__form-container_fields_logo'>
                        <img src={GoodturnLogo} alt="Goodturn" />
                    </div>
                    <p>
                        {isSignup ? 'Sign Up With Goodturn Info' : 'Sign in'}</p>
                    <form onSubmit={handleSubmit}>
                    {isSignup && (
                            <div className="auth__form-container_fields-content_input">
                                <label htmlFor="fullName">fullName</label>
                                <input 
                                    name="fullName" 
                                    type="text"
                                    placeholder="Full Name as Registered in Goodturn Jobs"
                                    onChange={handleChange}
                                    required
                                /> 
                            </div>
                        )}
                          {isSignup && (
                            <div className="auth__form-container_fields-content_input">
                                <label htmlFor="email">email</label>
                                <input 
                                    name="email" 
                                    type="email"
                                    placeholder="Same email as your Jobs account"
                                    onChange={handleChange}
                                    required
                                /> 
                            </div>
                        )}
                        <div className="auth__form-container_fields-content_input">
                                <label htmlFor="username">username</label>
                                <input 
                                    name="username" 
                                    type="text"
                                    placeholder="Create userName for faster log ins"
                                    onChange={handleChange}
                                    required
                                /> 
                        </div>
                          {isSignup && (
                            <div className="auth__form-container_fields-content_input">
                                <label htmlFor="jobsId">jobsId</label>
                                <input 
                                    name="jobsId" 
                                    type="jobsId"
                                    placeholder="Goodturn User ID found on the Account Page"
                                    onChange={handleChange}
                                    required
                                /> 
                            </div>
                        )}
                        <div className="auth__form-container_fields-content_input">
                                <label htmlFor="password">Password</label>
                                <input 
                                    name="password" 
                                    type="password"
                                    placeholder="Create Password for future logins"
                                    onChange={handleChange}
                                    required
                                /> 
                            </div>
                        {isSignup && (
                            <div className="auth__form-container_fields-content_input">
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <input 
                                    name="confirmPassword" 
                                    type="password"
                                    placeholder="Confirm Password"
                                    onChange={handleChange}
                                    required 
                                /> 
                            </div>
                        )}
                         <div className="auth__form-container_fields-content_button">
                            <button>{isSignup ? "Sign Up" : "Sign In"}</button>
                        </div>
                    </form>
                    <div className="auth__form-container_fields-account">
                        <p>
                            {isSignup
                             ? "Already have an account? " 
                             : "Sign up here to create Username and Password? To reset password please sign up with your Accound ID from Goodturn "
                             }
                             <span onClick={switchMode}>
                             {isSignup ? ' Sign In' : ' Sign Up'}
                             </span>
                        </p>
                    </div>
                </div>
            </div>
            <div className="auth__form-container_image">
                <img src={signinImage} alt="sign in" />
            </div>
        </div>
    )

}

export default Auth