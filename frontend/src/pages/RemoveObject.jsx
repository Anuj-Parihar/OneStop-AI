


import { Scissors, Sparkles, Expand } from 'lucide-react';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RemoveObject = () => {
  const [input, setInput] = useState("");
  const [object, setObject] = useState("")
  const [loading, setLoading] = useState(false);
  const [content, setContent]  = useState('');
      
  const {getToken} = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if(object.split(' ').length > 1){
        return toast('Please enter only one object name');
      }
      const formData = new FormData();
      formData.append('image', input);
      formData.append('object', object);

      const {data} = await axios.post(
        '/api/ai/remove-image-object',
        formData,
        {headers: {Authorization: `Bearer ${await getToken()}`}}
      ) 
      if(data.success){
        setContent(data.content);
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  const downloadImage = () => {
  const link = document.createElement('a');
  link.href = content;
  link.target = '_blank';  // open in new tab
  link.rel = 'noopener noreferrer'; // security best practice
  link.click();
};

  return (
   <div className="p-6 h-full overflow-y-scroll gap-4 flex items-start flex-wrap text-slate-700">
      {/* left-col */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg p-4 bg-white rounded-1g border border-gray-200"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#4A7AFF]" />
          <h1 className="text-xl font-semibold">  Object Removal  </h1>
        </div>
        <p className="mt-6 text-sm font-medium">Upload Image</p>
        <input
          onChange={(e) => setInput(e.target.files[0])}
          type="file"
          accept='image/*'
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-600"
          required
        />
        
        <p className="mt-6 text-sm font-medium">Describe Object Name to Remove </p>
        <textarea
          onChange={(e) => setObject(e.target.value)}
          rows={4}
          value={object}
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300"
          placeholder="e.g., watch or spoon , Only single object name"
          required
        />

        <button disabled={loading} className="mt-6 w-full  text-white px-4 py-2 rounded-lg bg-gradient-to-r from-[#417DF6] to-[#8E37EB] flex items-center justify-center gap-2 text-sm cursor-pointer">
          {loading ? <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span> : <Scissors className="w-5" />}
          Remove Object 
        </button>
      </form>

      {/* right-col */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96">
        <div className="flex items-center gap-3">
          <Scissors className="w-5 h-5 text-[#4A7AFF]" />
          <h1 className="text-xl font-semibold">Processed Image</h1>
        </div>
        {!content ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
              <Scissors className="w-9 h-9" /> 
              <p>Upload an Image and click "Remove object" to get started</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <img src={content} alt="image" className='mt-3 h-full w-full'/>
            <button
              onClick={downloadImage}
              className="mt-2 flex items-center justify-center gap-2 px-4 py-2 cursor-pointer rounded-lg bg-gradient-to-r from-[#417DF6] to-[#8E37EB] text-white text-sm"
            >
              <Expand className="w-4 h-4" /> Expand the Image
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default RemoveObject;

