import React, { useRef } from 'react'
import { useCallback,useState,useEffect} from 'react'
import PostCard from './PostCard';

const InfiniteScroll = () => {
    const[posts,setPosts]=useState([]);
    const[page,setPage]=useState(0);
    const[loading,setLoading]=useState(false);
    const ref=useRef();
    const fetchPosts=useCallback(async()=>{
        setLoading(true);
        try{
            const response=await fetch(`https://dummyjson.com/posts?limit=5&skip=${page*5}`)
            const data=await response.json();
            setPosts((prev)=>[...prev, ...data.posts]);
            setLoading(false);

        }
        catch(error){ 
            console.log("Error fetching posts",error);
            setLoading(false)
        }
    },[page]);
    useEffect(()=>{
        fetchPosts();
    },[fetchPosts]);

useEffect(()=>{
    const options={
        root:null,
        rootMargin:"20px",
        threshold:1.0,
    };
    const observer=new IntersectionObserver((entry)=>{
        if(entry.isIntersecting && !loading){
            setPage((prev)=>prev-1);
        }

    },options)
    if(ref.current){
        observer.observe(ref.current);
    }
    return()=>{
        if(ref.current){
            observer.unobserve(ref.current)
        };
    };
},[ref,loading]);

    return (
    <div className='container mx-auto p-4'>
        <h1 className='text-2xl font-bold mb-4'>Infinite Scroll</h1>
        <div className='grid grid-cols-1 gap-4'>
                    {
                    posts.map(post=>(
                        <PostCard key={post.id} post={post}/>
                    ))}        

</div>
      {loading &&<div>Loading....</div>}
        <div ref={ref}/>
    </div>
  );
};

export default InfiniteScroll
