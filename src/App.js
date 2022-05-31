import './App.css';
import axios from 'axios';
import { useState, useEffect} from 'react';
import ReactPaginate from 'react-paginate';
import Search from './Search';
import Filter  from './Filter';

function App() {
  const [data, setData] = useState([{}]);
  let [filter, setFilter] = useState([]);
  const [count, setCount] = useState(0);

 useEffect(() => {
   async function fetchData(){
    let cPage = 1; 
    let firstURL = `https://gnikdroy.pythonanywhere.com/api/book/?languages=${filter}&page=${cPage}`;
    await axios.get(firstURL).then(book => {
        setData(book.data.results);
        setCount(book.data.count);
     });
    }
    fetchData();   
}, [filter]); 



  const doFilter = async (data) => { 
    let currentPage = data.selected +1; 
    let baseURL = `https://gnikdroy.pythonanywhere.com/api/book/?languages=${filter}&page=${currentPage}`;
             await axios.get(baseURL).then(book => {
                setData([...book.data.results]);
                setCount(count);
             })
  }  

const selectFav = (e, id) => {
    if(e.target.checked){
        sessionStorage.setItem(id, e.target.checked);
    }else{
      sessionStorage.removeItem(id)
    }
  }

  if (!data) {
    return <div>Loadding...</div>;
  }


  return (
    <div className="App">
   
    <Search data = {data} />
     <h1>Read books, results : {count}</h1>
     <div className='filter'>
      <Filter onChange={(e)=> setFilter(e)} />
      </div>
     <table>
        <thead>
        <tr><th>No on page</th><th>Id</th><th>Title</th><th>Author/s</th>
        <th>Read it</th><th>Mark as favorite</th></tr>
        </thead>
        <tbody>
          {data.filter((itm) => itm.languages ? itm.languages[0] === 'all' || filter : null).map((it, i) => (
              <tr key = {it.id + i}>
                <td>{i+1}</td>
                <td>{it.id}</td>
                <td><strong>{it.title}</strong></td>
                <td>{it.agents && (it.agents.map((itm) => itm.type === 'Author' ? itm.person : null ))}</td>
                <td> <a href = {it.resources && (it.resources.filter(itd => itd.uri.endsWith('.htm')).map(itm => itm.uri))} 
                target = '_blank' rel ="noreferrer">
                  {it.resources && (it.resources.map((itm) => itm.uri.endsWith('.htm') ? itm.uri : null ))}</a></td>
                <td><input type ='checkbox'
                defaultChecked = {sessionStorage.getItem(it.id)} onChange={(e) => selectFav(e, it.id)} /></td>
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
      onPageChange={doFilter}
      containerClassName={"pagination"}
      subContainerClassName={"pages pagination"}
      activeClassName={"active"}
    />
    </div>
  );
}

export default App;
