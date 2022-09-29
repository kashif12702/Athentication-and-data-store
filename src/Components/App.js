import "./App.css";
import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { signOut } from "firebase/auth";
import app from "../Components/FireBase";
import { collection, addDoc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { getDocs } from "firebase/firestore";
import Spinner from "./Spinner";
import { doc, deleteDoc } from "firebase/firestore";


function App() {

  const db = getFirestore(app);
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();




  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [loginerror, setloginerror] = useState("");
  const [googleimage, setgoogleimage] = useState("");
  const [signinloader, setsigninloader] = useState(false);

  const [id, setid] = useState("")
  const [carloader, setcarloader] = useState(false);
  const [carerror, setcarerror] = useState("");
  const [data, setdata] = useState([]);
  const [car, setcar] = useState({
    name: "",
    color: "",
  });


  let name, value;
  const addcar = (e) => {
    name = e.target.name;
    value = e.target.value;
    setcar({ ...car, [name]: value });
  };


  const generateKey = (pre) => {
    return `${ pre }_${ new Date().getTime() }`;
}

// ------------Datasaving_Datareteriving-------------------

  const savedata = async (event) => {
    event.preventDefault();
    if (car.name === "" || car.color === "") {
      setcarerror("Plz enter all the details");
    } else {
      try {
        setcarloader(true);
        const querySnapshot =  await addDoc(collection(db, "cars"), car);
        setcarloader(false);
        setcarerror("your data is successfully saved");
        setcar({
          name: "",
          color: "",
        });
        console.log(querySnapshot.id)

      } catch (e) {
        setcarerror(e);
      }
    }
  };

  const showdata = async (event) => {
    event.preventDefault();
    setcarloader(true);
    const querySnapshot = await getDocs(collection(db, "cars"));
    setcarloader(false);
    setcarerror("Here is your all saved data!");
    const items = [];
    querySnapshot.forEach((doc) => {
      items.push(doc.data());
      setdata(items);
      console.log(doc.id, " => ", doc.data());
    });
  };

 const deletedata = async(event) =>{
  event.preventDefault();
  setcarloader(true);

  await deleteDoc(doc(db, "cars", id));
  setcarloader(false);

  setid("");
  setcarerror("deleted");

 }


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

        setloginerror( `${user.email} Your account is successfully created`);
      })
      .catch((error) => {
        // const errorCode = error.code;
        const errorMessage = error.message;
        setloginerror(errorMessage);
        setsigninloader(false);
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
          setloginerror(`welcome ${user.email} to your profile`);
        }
      })
      .catch((error) => {
        const errorMessage = error.message;
        setloginerror(errorMessage);
        setsigninloader(false);
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
      })
      .catch((error) => {
        const errorMessage = error.message;
        setloginerror(errorMessage);
        setsigninloader(false);
      });
  };

  const signinwithgoogle = (event) => {
    event.preventDefault();

    setsigninloader(true);
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        setsigninloader(false);
        setloginerror(`welcome ${user.displayName} to your profile`);
        setgoogleimage(user.photoURL);
      })
      .catch((error) => {
        const errorMessage = error.message;
        setloginerror(errorMessage);
        setsigninloader(false);
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
        <div className="m-2">
          <img className="m-2 rounded" src={googleimage} alt="" />
        </div>
      </form>
{/* ------------cars data---------------- */}

      <form className="container mt-4 w-50 bg-dark text-white p-4">
        <h2 className="text-center fs-1 mb-3">Car Details</h2>
        <div className="mb-3 ">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Car name
          </label>
          <input
            required
            name="name"
            value={car.name}
            onChange={addcar}
            type="email"
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Car color
          </label>

          <input
            required
            name="color"
            type="text"
            value={car.color}
            onChange={addcar}
            className="form-control"
          />
        </div>
        <span>
          <button
            type="submit"
            onClick={savedata}
            className="btn btn-primary m-2"
          >
            Submit
          </button>
          <button
            type="submit"
            onClick={showdata}
            className="btn btn-primary m-2"
          >
            Show all data
          </button>
        </span>
        <span className="mx-4 ">{carloader && <Spinner />}</span>

{/* ------------delete using key---------------- */}
        <input
            required
            name="color"
            type="text"
            value={id}
            onChange={(event)=>setid(event.target.value)}
            className="form-control m-2"
            placeholder="Id"
          />
        <button
            type="submit"
            onClick={deletedata}
            className="btn btn-primary m-2"
          >
            Delete
        </button>

        <div id="emailHelp" className="text-success m-2">
          {carerror}
        </div>
{/* -------------------Saves data------------------- */}

        <div className="m-4">
          <h2 className="fs-2 text-center my-4">Our Data</h2>
          <table className="m-auto">
            <thead>
              <tr>
                <td className="p-3 border border-info  fs-3">Name</td>
                <td className="p-3 border border-info  fs-3">Color</td>
              </tr>
            </thead>
            <tbody>
              {data.map((i) => {
                return (
                  <tr key={ generateKey(i.name) }>
                    <td className="p-3 fs-4 border border-info">{i.name}</td>
                    <td className="p-3 border border-info">{i.color}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </form>
    </>
  );
}

export default App;
