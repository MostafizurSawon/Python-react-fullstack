import axios from "axios";
import { useState, useEffect } from "react";

function Demo2() {

  const [load, setLoad] = useState('https://cdn.pixabay.com/animation/2022/10/11/03/16/03-16-39-160_512.gif')
  const [image, setImage] = useState("")

  useEffect(() => {
    axios.get('https://dog.ceo/api/breeds/image/random')
  .then(function (response) {
    // handle success
    // console.log(response.data);
    setImage(response.data.message)
    setLoad(null)
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .finally(function () {
    // always executed
  });
  
    
  }, [])
  
  

  return (
    <>
      <div className="container mt-3">
        {/* <img className="img-fluid" src="https://pic.re/image" alt="" /> */}
        <center>
        <img src={load} alt="" />
          
          
        </center>
        <img className="img-fluid w-100" src={image} alt="" />
        
      </div>
    </>
  )
}

export default Demo2