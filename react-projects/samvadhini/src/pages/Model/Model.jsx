import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation }  from 'react-router-dom'
// import './App.css'
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  const mic = new SpeechRecognition()
  mic.continuous = true
  mic.interimResults = true


function Model() {
  const [isListening, setIsListening] = useState(false)
  const [text, setText] = useState(null)
  const [savedTexts, setSavedTexts] = useState([])
  const[answer, setAnswer] = useState('');
  const[meta, setMeta] = useState('');
  const location = useLocation();
  const navigation = useNavigate();
  mic.lang = location.state.language;
  useEffect(() => {
    handleListen();
  }, [isListening])

  const handleListen = () => {
    if (isListening) {
      mic.start()
      mic.onend = () => {
        console.log('continue..')
        mic.start()
      }
    } else {
      mic.stop()
      mic.onend = () => {
        console.log('Stopped Mic on Click')
      }
    }
    mic.onstart = () => {
      console.log('Mics on')
    }

    mic.onresult = event => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('')
      console.log(transcript)
      setText(transcript)
      mic.onerror = event => {
        console.log(event.error)
      }
    }
  }
  
  const api_response = async () => {

    const requestoptions ={
      method: 'POST',
      headers: {'Content-Type': 'application/json',
                 'Access-Control-Allow-Origin': "*",
                },
      body: JSON.stringify({'msg':text})
    }
    const response = await fetch("/query",requestoptions);
    const data = await response.json();
    console.log(data);
    setTimeout(() => {
        navigation('/thankyou')
    },10000 );
    setAnswer(data.documents[0].content);
    setMeta(data.documents[0].meta.answer);
  } 

  /*const api_response = () =>{

    var jstr = JSON.stringify({'msg':'पिता का नाम गलत'})
            axios.post('http://localhost:5000/query',
                        jstr,
                        {headers: { 'Content-Type':'application/json' }}   
            ).then((response) =>{
              console.log(response.json);
            })
    
  }*/

  const handleSaveText = () => {
    setSavedTexts([...savedTexts, text])
    api_response();
   /* setTimeout(()=>{
      navigation('/thankyou');
    },60000);*/
    
  }

  const navtu=()=>{
    navigation('/thankyou');
}

  return (
    <>
      <h1>Speech to text</h1>
      <div className="container">
        <div className="box">
          <h2>text</h2>
          {isListening ? <span></span> : <span></span>}
          <button onClick={handleSaveText} disabled={!text}>
            Submit
          </button>
          <button onClick={() => setIsListening(prevState => !prevState)}>
            Start/Stop
          </button>
          <p>{text}</p>
        </div>
        <div className="box">
          <h2>Result</h2>
          <p>{answer}</p>
          <p>{meta}</p>
        </div>
        <div>
            <button onClick={navtu}>Finish</button>
        </div>
      </div>
    </>
  )
}

export default Model
