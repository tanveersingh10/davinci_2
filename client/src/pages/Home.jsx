import React, { useState, useEffect }from 'react';
import { FormField, Loader} from '../components'
import Card from '../components/Card';


const RenderCards = ({data, title}) => {
    if (data?.length > 0) {
        return data.map((post) => <Card key={post._id} {...post} />)
    } 
    return (
        <h2 className="mt-5 font-bold text-[#6449ff] text-xl uppercase">
            {title}
        </h2>
    )   
}

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [allPosts, setAllPosts] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [searchedResults, setSearchedResults] = useState(null);
  const [searchTimeout, setSearchTimeout] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
        setLoading(true);
        try {
            const response = await fetch("https://davinci-2.onrender.com/api/v1/posts", {
                method: "GET",
                headers: {
                    "Content-Type": "appliction/json"
                }
            });
            if (response.ok) {
                const result = await response.json();
                setAllPosts(result.data.reverse()); // reverse in order to show newer posts first
            }

        } catch(error) {
            alert(error);
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    fetchPosts()
  }, []);

 

  const handleSearchChange = event => {
    clearTimeout(searchTimeout);
    setSearchText(event.target.value);

    setSearchTimeout(
        setTimeout(() => {
            const searchResult = allPosts.filter((post) => post.name.toLowerCase().includes(searchText.toLowerCase())
                || post.prompt.toLowerCase().includes(searchText.toLowerCase()));

            setSearchedResults(searchResult);

        }, 500)
    );
  }

return (
    <section className="max-w-8xl max-auto bg-gray-900 text-white"> 

        <div>
            <h1 className="text-xl mt-3 font-extrabold text-white">Community Posts</h1>
            <p className="mt-2 text-gray-400 text-[14px] max-w[500px]">View the beautiful artwork by other users from the community!</p>
        </div>
        <div className="mt-10"> 
            <FormField labelName="Search Posts" type="text" name="text" placeholder="search" 
                value={searchText} handleChange={handleSearchChange}/>
        </div>

        <div className="mt-6"> 
            {loading ? (
                <div className="flex justify-center items-center"> 
                    <Loader />
                </div>
            ) : (
                <>
                    {searchText && (
                        <h2 className="font-medium text-gray-400 text-xl mb-3">
                            Showing results for <span className="text-gray-300">{searchText}</span>
                        </h2>
                    )}
                    <div className="grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3">
                        {searchText ? (
                            <RenderCards data={searchedResults} title="No search results found" />
                            ) : (
                            <RenderCards data={allPosts} title="No posts found" />
                            )
                        }
                    </div>
                </>
            )} 
        </div>

    </section>
    )
}

export default Home;
