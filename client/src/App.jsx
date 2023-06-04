import React from 'react'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { davinci } from "./assets"
import { Home, CreatePost, Welcome } from './pages';

export const App = () => {
  return (
    <BrowserRouter>
      <div className="bg-gray-900">
          <header className="w-full flex justify-between items-center text-white
        sm:px-8 px-4 py-4 border-b border-b-[#e6ebf4]" >
          <Link to="/">
            <img src = {davinci} alt ="logo" className="w-28 object-contain" />
          </Link>

          <div>
            <Link to="/community" className="font-inter font-medium bg-white
              text-gray-800 px-4 py-2 rounded-md mr-2">Community
            </Link> 

            <Link to="/create-post" className="font-inter font-medium bg-[#6469ff]
              text-white px-4 py-2 rounded-md">Create
            </Link> 
          </div>
      </header>

      <main className="sm:p-8 px-4 py-8 w-full bg-[$f9fafe] min-h-[calc(100vh -73px)]"> 
        <Routes>
          <Route path = "/" element={<Welcome/>} />
          <Route path = "/community" element={<Home/>} />
          <Route path="/create-post" element={<CreatePost/>}/>
        </Routes>
      </main>
      </div>
    
    </BrowserRouter>
  


  )
}

export default App;