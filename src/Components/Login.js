import React, {useState} from 'react'
import Spinner from "./Spinner";
import app from "../Components/FireBase";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { signOut } from "firebase/auth";
import Studentdata from './Studentdata'

export default function Login() {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
  
  
  
    const [username, setusername] = useState("");
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    const [loginerror, setloginerror] = useState("");
    const [googleimage, setgoogleimage] = useState("");
    const [signinloader, setsigninloader] = useState(false);
    const [user, setuser] = useState(false)

// ------------signin_signout_signup_Googlesignin-------------------



const signup = (event) => {
    event.preventDefault();
    setsigninloader(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setemail("");
        setpassword("");
        setsigninloader(false);
        setemail("");
        setpassword("");
        setloginerror( `${user.email} Your account is successfully created`);
      })
      .catch((error) => {
        // const errorCode = error.code;
        const errorMessage = error.message;
        setloginerror(errorMessage);
        setsigninloader(false);
        setemail("");
        setpassword("");
      });
  };

  const signin = (event) => {
    event.preventDefault();
    setsigninloader(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setsigninloader(false);

        if (user) {
          setuser(true);
          setusername(user.email)
          setemail("");
          setpassword("");
        }
      })
      .catch((error) => {
        const errorMessage = error.message;
        setloginerror(errorMessage);
        setsigninloader(false);
        setemail("");
        setpassword("");
      });
  };

  const logout = (event) => {
    event.preventDefault();
    setsigninloader(true);
    signOut(auth)
      .then((result) => {
        setsigninloader(false);
        setloginerror("Your are successfully logged out");
        setgoogleimage("");
        setuser(false);
      })
      .catch((error) => {
        const errorMessage = error.message;
        setloginerror(errorMessage);
        setsigninloader(false);
      });
  };

  const signinwithgoogle = (event) => {
    event.preventDefault();

    signInWithPopup(auth, provider)
    .then((result) => {
          setsigninloader(true);
        const user = result.user;
        if (user) {
            setuser(true);
          setusername(user.displayName)

          }
        setsigninloader(false);
        setemail("");
        setpassword("");
        setgoogleimage(user.photoURL);
      })
      .catch((error) => {
        const errorMessage = error.message;
        setloginerror(errorMessage);
        setsigninloader(false);
        setemail("");
        setpassword("");
      });
  };


  return (
    <>
      {/* ------------Login form---------------- */}

      <form className="container mt-4 w-50 bg-dark text-white p-4">
        <div className="mb-3 ">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Email address
          </label>
          <input
            required
            value={email}
            onChange={(e) => setemail(e.target.value)}
            type="email"
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Password
          </label>

          <input
            required
            type="password"
            value={password}
            onChange={(e) => setpassword(e.target.value)}
            className="form-control"
          />
        </div>

        <button type="submit" onClick={signup} className="btn btn-primary m-2">
          SignUp
        </button>
        <button type="submit" onClick={signin} className="btn btn-primary m-2">
          SignIn
        </button>
        <button type="submit" onClick={logout} className="btn btn-primary m-2">
          LogOut
        </button>
        <span className="mx-4 ">{signinloader && <Spinner />}</span>
        <img
          src="https://www.drupal.org/files/issues/2020-01-19/google_logo.png"
          alt="signin with google "
          role="button"
          className="w-25 m-2"
          onClick={signinwithgoogle}
        />

        <div id="emailHelp" className="text-success">
          {loginerror}
        </div>
        <div className='fs-7 m-4 text-center'>
            <div>Email: bbb@bbb.com</div>
            <div>pasword: 666666</div>
        </div>
      </form>

      {user && <Studentdata username={username} userimageurl={googleimage} /> }
    </>
  )
}
