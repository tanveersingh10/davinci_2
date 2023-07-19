import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';

import { preview } from '../assets';
import { getRandomPrompt } from '../utils';
import { FormField, Loader} from '../components'

const CreatePost = () => {
    const  navigate = useNavigate();
    const[form, setForm] = useState({
        name: '',
        prompt: '',
        photo: ''
    })
    
    const [generatingImg, setGeneratingImg] = useState(false);
    const [loading, setLoading] = useState(false);


    const generateImage = async () => {
        if (form.prompt) {
            try {
                setGeneratingImg(true);
                const response = await fetch("https://davinci-2.onrender.com/api/v1/dalle", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({prompt: form.prompt}) //fetch can only send string data
                })

                //added this because when there was an error the response from server is 
                //a string and not in json format
                if (!response.ok) {
                    const message = await response.text();
                    throw new Error(message);
                }
                

                const data = await response.json();
                setForm({... form, photo: `data:image/jpeg;base64,${data.photo}`})
            } catch(error) {
                console.log(error);
                alert(error);
            } finally {
                setGeneratingImg(false);
            }
        } else {
            alert("Please enter a prompt")
        }
    }

    const handleSubmit = async(event) => {
        event.preventDefault();
        if (form.prompt && form.photo) {
            setLoading(true);
            try {
                const response = await fetch("https://davinci-2.onrender.com/api/v1/posts", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(form)
                })
                console.log("received response from backend")

                await response.json();
                navigate("/");
            } catch(error) {
                console.log(error);
                alert(error);
            } finally {
                setLoading(false);
            }
        } else {
            alert("Please enter a prompt and submit an image");
        }
    }

    const handleChange = (event) => {
        setForm({...form, [event.target.name]: event.target.value})
    }

    const handleSurpriseMe = () => {
        const randomPrompt = getRandomPrompt(form.prompt);
        setForm({...form, prompt: randomPrompt})
    }

    return (
        <section className="max-w-5xl mx-auto"> 
            <div>
                <h1 className="font-extrabold text-2xl text-white">Create</h1>
                <p className="mt-2 text-white text-[14px] max-w[500px]">Create imaginative images through DALL-E AI and share them with the community.</p>
            </div>

            <form className = "mt-12 max-w-3xl" onSubmit={handleSubmit}> 
                <div className="flex flex-col gap-5">
                    <FormField labelName="Your name" type="text" name="name" placeholder="John Doe" 
                        value={form.name} handleChange={handleChange}/>
                    <FormField labelName="Prompt" type="text" name="prompt" placeholder="A handsome Punjabi programmer" 
                        value={form.prompt} handleChange={handleChange} isSurpriseMe handleSurpriseMe={handleSurpriseMe}/>
                    <div className="relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                                    focus:ring-blue-500 focus:border-blue-500 w-64 p-3 h-64 flex justify-center items-center">
                        {form.photo ? (
                            <img src={form.photo} alt={form.prompt} className="w-full h-full"/>

                            ) : (
                            <img src={preview} alt="preview" className="w-9/12 h-9/12 object-contain opacity-49" />
                            )        
                        }

                        {generatingImg && (
                            <div className="absolute top-0 bottom-0 left-0 right-0 z-0 flex justify-center 
                                items-center bg-[rgba(0,0,0,0.5)] rounded-lg">
                                <Loader />
                            </div>
                        )}
                    </div>
 
                </div>

                <div className="mt-5 flex gap-5">
                    <button type="button" onClick={generateImage}
                         className="text-white bg-gray-600 font-medium rounded-md text-sm px-5 py-2.5 text-center" >
                        {generatingImg ? "Generating..." : "Generate"}
                    </button>
                </div>

                <div className="mt-10"> 
                    <p className="mt-2 text-white text-[14px]"> 
                        Once you have created your image, you can share it with the community!
                    </p>
                    <button onClick={handleSubmit} type="submit" className="mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full px-5 py-2.5 text-center">
                        {loading ? "Sharing..." : 'Share with community'}
                    </button>
                </div>
            </form>
        </section>
    )
}

export default CreatePost;
