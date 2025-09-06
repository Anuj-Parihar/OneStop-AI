import { useUser, useAuth } from '@clerk/clerk-react';
import React, { useEffect, useState } from 'react'
import { Heart } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Community = () => {
  const [creations, setCreations] = useState([]);
  const {user} = useUser();
  const [loading, setLoading] = useState(true);
  const {getToken} = useAuth();  

  const fetchCreations = async () => {
    try {
      const {data} = await axios.get('/api/user/get-published-creations', {
        headers:{Authorization: `Bearer ${await getToken()}`}
      });
      if(data.success){
        setCreations(data.creations)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  }

  const imageLikeToggle = async (id) =>{
    try {
      const {data} = await axios.post('/api/user/toggle-like-creation', 
        {id}, 
        {headers:{Authorization: `Bearer ${await getToken()}`}}
      );
      if(data.success){
        toast.success(data.message);
        await fetchCreations();
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    if(user){
      fetchCreations();
    } 
  }, [user])

  return !loading ? (
    <div className='flex-1 h-full flex flex-col gap-4 p-6 relative z-0'>
      <h2 className="font-semibold text-lg">Creations</h2>
      <div className='bg-white h-full w-full rounded-xl overflow-y-auto p-4'>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {creations.map((creation, index)=> (
            <div key={index} className='relative group rounded-lg overflow-hidden shadow'>
              <img src={creation.content} alt="" className='w-full h-auto object-cover'/>
              <div className='absolute inset-0 flex flex-col justify-end p-3 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition text-white'>
                <p className='text-sm mb-2'>{creation.prompt}</p>
                <div className='flex gap-1 items-center'>
                  <p>{creation.likes.length}</p>
                  <Heart 
                    onClick={()=> imageLikeToggle(creation.id)} 
                    className={`min-w-5 h-5 hover:scale-110 cursor-pointer transition ${
                      creation.likes.includes(user.id) 
                        ? 'fill-red-500 text-red-600' 
                        : 'text-white'
                    }`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ) : (
    <div className='flex justify-center items-center h-full'>
      <span className='w-10 h-10 my-1 rounded-full border-3 border-primary border-t-transparent animate-spin'></span>
    </div>
  )
}

export default Community;
