import { useState, useRef } from "react"
import { getRandomInteger as Random } from "./ExtraFunction"
import './demo.css'


function Demo() {
  const [count, setCount] = useState(0)
  const [text, setText] = useState(["Like", "success"])
  const [css1, setCss1] = useState("sec3")

  let img1 = useRef(null)
  let img2 = useRef(null)

  // console.log(Random(0,2));

  let green = [
    "https://img.freepik.com/free-photo/handsome-bearded-smiling-happy-young-man-looking-pointing-camera-isolated-vivid-trendy-green-studio_155003-18028.jpg",
    "https://img.freepik.com/free-photo/handsome-bearded-smiling-happy-young-man-looking-front-isolated-vivid-trendy-green-studio_155003-29272.jpg",
    "https://img.freepik.com/free-photo/handsome-bearded-smiling-happy-young-man-looking-left-isolated-vivid-trendy-green-studio-concept-autumn-cold-time_155003-29098.jpg",
    "https://img.freepik.com/free-photo/handsome-bearded-young-man-isolated-green_155003-3123.jpg",
    "https://img.freepik.com/free-photo/handsome-bearded-smiling-happy-young-man-looking-front-isolated-vivid-trendy-green-studio_155003-29270.jpg",
    "https://img.freepik.com/free-photo/handsome-bearded-smiling-happy-young-man-looking-camera-isolated-vivid-trendy-green-studio-concept-autumn-cold-time-human-emotions-concepts_155003-34177.jpg",
  ]

  let red = [
    "https://img.freepik.com/free-photo/upset-woman-with-painted-palms_23-2148487287.jpg",
    "https://img.freepik.com/free-photo/medium-shot-upset-woman_23-2148506430.jpg",
    "https://img.freepik.com/free-photo/medium-shot-model-eating-fruit_23-2148487134.jpg",
    "https://img.freepik.com/free-photo/medium-shot-model-eating-fruit_23-2148487134.jpg",
    "https://img.freepik.com/free-photo/portrait-young-woman-standing-looking-yellow_114579-80067.jpg",
    "https://img.freepik.com/premium-photo/annoyed-irritated-woman-covering-ears-gesturing-no-avoiding-advice-ignoring-noise-loud-voices_191803-3971.jpg",
    "https://img.freepik.com/premium-photo/caucasian-woman-with-open-mouth-raised-arms-conveying-anger-negativity-annoyed-lady-casual-clothing-stands-studio-with-orange-background-screaming-camera_482257-73890.jpg",
    "https://img.freepik.com/premium-photo/young-beautiful-blonde-woman-dark-yellow-dress-posing-yellow-wall-indoor_166222-472.jpg",
    "https://img.freepik.com/free-photo/front-view-beautiful-smiling-woman_23-2148489598.jpg",
    "https://img.freepik.com/free-photo/vertical-shot-female-hipster-meloman-with-dyed-hair-tilts-head-sings-song-along-listens-music-wireless-headphones-wears-fashionable-outfit-enjoys-rock-playlist-isolated-yellow-wall_273609-53804.jpg",
    // "https://img.freepik.com/free-photo/caucasian-young-woman-s-close-up-portrait-red-studio_155003-18980.jpg",
    // "https://img.freepik.com/free-photo/caucasian-young-woman-s-close-up-portrait-red-studio_155003-18982.jpg",
    // "https://img.freepik.com/premium-photo/very-angry-woman-breaking-his-neighbors-stereo-two_920019-10612.jpg",
    // "https://img.freepik.com/premium-photo/man-european-appearance-who-appears-be-furious_731930-151723.jpg",
    // "https://img.freepik.com/free-photo/reject-rejection-doubt-concept_155003-24974.jpg?t=st=1736347031~exp=1736350631~hmac=cd9aa573aa2b9374cbd16b392bbd83e7fa790053f794e92147a245616cca2cb7"
  ]
  

  const increase = () =>{
    setCount(count+1)
    setCss1((prevCss) => {
      let newCss = [...prevCss]
      newCss = 'sec2'
      return newCss
    })
    setText((prevText) => {
      const newText = [...prevText];
      newText[0] = "Like";
      newText[1] = "success";
      return newText;
    })
    img1.current.src = green[ Random(0, green.length-1) ]
    img2.current.src = green[ Random(0, green.length-1) ]
  }

  const decrease = () =>{
    if(count)
    {
      setCount(count-1)
      setCss1((prevCss) => {
        let newCss = [...prevCss]
        newCss = 'sec'
        return newCss
      })
      setText((prevText) => {
        const newText = [...prevText];
        newText[0] = "DisLike";
        newText[1] = "warning";
        return newText;
      })
      // console.log(srcref.current.src)
      img1.current.src = red[Random(0, red.length-1)]
      img2.current.src = red[Random(0, red.length-1)]
    }
    else{
      alert("Can not be negative!")
    }
  }
  // console.log({text});
  return (
    <>
    <div className={`container-fluid ${css1}`}>
    <div className="row gx-2 h-100">
      <div className="col-4 d-flex justify-content-center align-items-center">
      <img ref={img1} className="img-fluid like" src="https://img.freepik.com/free-photo/handsome-bearded-smiling-happy-young-man-looking-front-isolated-vivid-trendy-green-studio_155003-29272.jpg" alt="" />
      </div>
      <div className="col-4 d-flex justify-content-center align-items-center">
        <div>
          <div className={`my-3 text-${text[1]} text-center text-4xl`}>{text[0]} is active : {count}</div>
          <center className="">
            <button className="btn btn-outline-success" onClick={increase}>Like</button>
            <button className="ms-2 btn btn-outline-warning" onClick={decrease}>Dislike</button>
          </center>
        </div>
      </div>
      <div className="col-4 d-flex justify-content-center align-items-center">
        <img ref={img2} className="img-fluid dislike" src="https://img.freepik.com/premium-photo/annoyed-irritated-woman-covering-ears-gesturing-no-avoiding-advice-ignoring-noise-loud-voices_191803-3971.jpg" alt="" />
      </div>
    </div>
    </div>
    
    
    </>
  )
}

export default Demo