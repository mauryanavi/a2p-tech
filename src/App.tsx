import React, { useCallback, useRef, useState} from 'react';
import './App.css';
import axios from 'axios';

interface User {
  id: Number,
  name: String,
  username: String,
  email: String,
  address: any,
  phone: String,
  website: String,
  company: Object
}
interface Users extends Array<User> { }

function App() {

  const [data, setData] = useState<Users>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pageNum, setPageNum] = useState(1)

  const observer = useRef(null) as any;

  const getUsers = async (page: Number) => {
    try {
      const res = await axios({
        method: "GET",
        url: `https://jsonplaceholder.typicode.com/users`
      })
      setData(users => [...users, ...res.data]);
      setIsLoading(false)
    } catch {
      setIsLoading(false)
    }
  }

  // Lazy loading logix
  const listLastElement = useCallback((node: any) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver( entries => {
      if (entries[0].isIntersecting && !isLoading) {
        setIsLoading(true)
        getUsers(pageNum)
        setPageNum(num => num + 1);
      }
    })
    if (node) observer.current.observe(node)
  }, [isLoading, pageNum]);


  return (
    <div className="App container mx-auto px-4 py-20">
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-4'>
        {
          data.map((user, i) => (
            <section style={{ fontFamily: 'Montserrat' }} className=" bg-[#071e34] flex font-medium items-center justify-center">
              <section className="w-64 mx-auto bg-[#20354b] rounded-2xl px-8 py-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm"></span>
                  <span className="text-emerald-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                    </svg>
                  </span>
                </div>
                <div className="mt-6 w-fit mx-auto">
                  <img src={`https://avatars.dicebear.com/v2/avataaars/${user.username}.svg`} className="rounded-full w-28 " alt="profile picture" />
                </div>
                <div className="mt-8 ">
                  <h2 className="text-white font-bold text-2xl tracking-wide">{user.name}</h2>
                </div>
                <p className="text-emerald-400 font-semibold mt-2.5">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 inline">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg> +{user.phone}
                </p>
                <div className="mt-3 text-white text-sm">
                  <span className="text-gray-400 font-semibold">{user.address.city}, {user.address.zipcode}</span>
                </div>
              </section>
            </section>
          ))
        }
        <div className=' col-span-full h-40 flex justify-center py-8'>
          <div role="status">
            <svg aria-hidden="true" className="mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>

        </div>
      </div>
      <div ref={listLastElement}></div>
    </div>
  );
}

export default App;
