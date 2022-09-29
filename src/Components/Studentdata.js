import React, { useState } from "react";
import app from "../Components/FireBase";
import { collection} from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore"; 
import { getFirestore } from "firebase/firestore";
import { getDocs } from "firebase/firestore";
import Spinner from "./Spinner";
import { deleteDoc } from "firebase/firestore";




export default function Studentdata({username,userimageurl}) {
    
  const db = getFirestore(app);



  const [id, setid] = useState("")
  const [studentloader, setstudentloader] = useState(false);
  const [studenterror, setstudenterror] = useState("***********************");
  const [data, setdata] = useState([]);
  const [studentname, setstudentname] = useState("")
  const [student, setstudent] = useState({
    institution: "",
    department: "",
  });


  let name, value;
  const addstudent = (e) => {
    name = e.target.name;
    value = e.target.value;
    setstudent({ ...student, [name]: value });
  };


  const generateKey = (pre) => {
    return `${ pre }_${ new Date().getTime() }`;
}

// ------------Datasaving_Datareteriving-------------------

  const savedata = async (event) => {
    if ( student.name === "" || student.department === "" || student.institution === "" ) {
      event.preventDefault();
      setstudenterror("Plz enter all the details");
    } else {
      event.preventDefault();
      setstudentloader(true);
        const docRef =  await setDoc(doc(db, "students", studentname), student);
        setstudentloader(false);
        setstudenterror("your data is successfully saved");
        setstudent({
          institution: "",
          department: "",
        });
        setstudentname("");
  }};

  const showdata = async (event) => {
    event.preventDefault();
    setstudentloader(true);
    const querySnapshot = await getDocs(collection(db, "students"));
    setstudentloader(false);
    const items = [];
    querySnapshot.forEach((doc) => {
      items.push(doc.data());
      setdata(items);
      console.log(doc.id, " => ", doc.data());
    });
    if(items.length === 0){
      setstudenterror("no saved data");
      
    }else{
      setstudenterror("Here is your all saved data!");
    }
  };

 const deletedata = async(event) =>{
  event.preventDefault();
  setstudentloader(true);

  await deleteDoc(doc(db, "students", id));
  setstudentloader(false);
 
  setdata([]);
  setid("");
  setstudenterror("Data deleted!");

 }


  return (
    <>

    {/* ------------students data---------------- */}
    
          <form className="container mt-4 w-50 bg-dark text-white p-4">
            <img style={{width: "82px", height:"82px" , objectFit: "cover", display: "block" , margin: "10px auto" , borderRadius: "50%"}} src={userimageurl? userimageurl:"https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small_2x/profile-icon-design-free-vector.jpg"} alt="userimage" />
            <h2 className="text-center text-info fs-3 mb-3">Welcome <b>{username}</b> to your profile </h2>
            <hr/>
            <h2 className="text-center fs-1 mb-3">student Details</h2>
            <div className="mb-3 ">
              <label htmlFor="exampleInputEmail1" className="form-label">
                Name
              </label>
              <input
                required
                name="name"
                value={studentname}
                onChange={(e)=>setstudentname(e.target.value)}
                type="email"
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="exampleInputPassword1" className="form-label">
                Institution
              </label>
    
              <input
                required
                name="institution"
                type="text"
                value={student.institution}
                onChange={addstudent}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="exampleInputPassword1" className="form-label">
                Department
              </label>
    
              <input
                required
                name="department"
                type="text"
                value={student.department}
                onChange={addstudent}
                className="form-control"
              />
            </div>
            <span>
              <button
                type="submit"
                onClick={savedata}
                className="btn btn-primary m-2"
              >
                Add student
              </button>
              <button
                type="submit"
                onClick={showdata}
                className="btn btn-primary m-2"
              >
                Show all Students
              </button>
            </span>
        
    
    {/* ------------delete using key---------------- */}
    <hr/>
            <input
                required
                name="department"
                type="text"
                value={id}
                onChange={(event)=>setid(event.target.value)}
                className="form-control my-2"
                placeholder="Name"
              />
              <div className="text-secondary mx-2"> Type the Name of Student from console 😉</div>
            <button
                type="submit"
                onClick={deletedata}
                className="btn btn-primary m-2"
              >
                Delete
            </button>
    
    <hr/>
            <span id="emailHelp" className="text-success m-2">
              {studenterror}
            </span>
            <span className="mx-4 ">{studentloader && <Spinner />}</span>
    {/* -------------------Saves data------------------- */}
    
            <div className="m-4">
              <h2 className="fs-2 text-center my-4">Our Data</h2>
              <table className="m-auto">
                <thead>
                  <tr>
                    <td className="p-3 border border-info  fs-3">Institution</td>
                    <td className="p-3 border border-info  fs-3">department</td>
                  </tr>
                </thead>
                <tbody>
                  {data.map((i) => {
                    return (
                      <tr key={ generateKey(i.institution) }>
                        <td className="p-3 fs-4 border border-info">{i.institution}</td>
                        <td className="p-3 border border-info">{i.department}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </form>


         
        </>
  )
}
