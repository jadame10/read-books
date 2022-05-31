import './App.css';
import axios from 'axios';
import { useState, useCallback} from 'react';
import ReactPaginate from 'react-paginate';
import LoadingSpinner from './Spinner';

function Search(){
 
    const [phrase, setPhrase] = useState('');
    let [dot, setDot] = useState([{}]);
    const [count, setCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);


const allSearch = useCallback(async () => {
    setIsLoading(true);
    let cPage = 1;   
    let firstURL = `https://gnikdroy.pythonanywhere.com/api/book/?page=${cPage}&search=${phrase}`;
    await axios.get(firstURL).then(book => {
        setDot(book.data.results);
        setCount(book.data.count);
     });
     setIsLoading(false);
}, [phrase]); 


const changePage = async (data) => {
    let currentPage = data.selected +1;
    let baseURL = `https://gnikdroy.pythonanywhere.com/api/book/?page=${currentPage}&search=${phrase}`;
             await axios.get(baseURL).then(book => {
                setDot([...book.data.results]);
                setCount(count);
             })
  }  

const handleChange = (event) => {
        event.preventDefault();
        setPhrase(event.target.value.toLowerCase());
      }; 

 if (!dot) {
        return <div></div>;
      }

return (
    <div className="Search">
        {isLoading ? <LoadingSpinner /> : null}
        <div className='inpt1'>
        <input
            type="text"
            placeholder="Search"
            onChange={(e) => handleChange(e)}
            className ='inpt0'
          />
        <button onClick={(e) => allSearch(e)} disabled={isLoading}>Search by book title</button>
    </div>
   
    <h1>Search results : {count}</h1>
     <table>
       <thead>
       <tr><th>No on page</th><th>Id</th><th>Title</th><th>Author/s</th>
       <th>Read it</th>
       </tr>
       </thead>
       <tbody>
         {dot.map((it, i) => (
          <tr key = {it.id + i}>
            <td>{i+1}</td>
             <td>{it.id}</td>
             <td><strong>{it.title}</strong></td>
             <td>{it.agents && (it.agents.map((itm) => itm.type === 'Author' ? itm.person : null ))}</td>
             <td> <a href = {it.resources && (it.resources.filter(itd => itd.uri.endsWith('.htm')).map(itm => itm.uri))} 
             target = '_blank' rel ="noreferrer">
                  {it.resources && (it.resources.map((itm) => itm.uri.endsWith('.htm') ? itm.uri : null ))}</a></td>
            </tr>    
         ))}
       </tbody>
     </table> 
     <ReactPaginate
      previousLabel={"prev"}
      nextLabel={"next"}
      breakLabel={"..."}
      breakClassName={"break-me"}
      pageCount={Math.ceil(count/10)}
      marginPagesDisplayed={1}
      pageRangeDisplayed={4}
      onPageChange={changePage}
      containerClassName={"pagination"}
      subContainerClassName={"pages pagination"}
      activeClassName={"active"}
    />
</div>
)
}
export default Search;