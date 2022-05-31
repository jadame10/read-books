import './App.css';

function Filter(props){
return (
    <div>
       <select onChange={(e) => props.onChange(e.target.value) }
            aria-label="Filter Book by language">
                <option value="all">Filter By language</option>
                <option value="en">english</option>
                <option value="fr">french</option>
                <option value="de">german</option>
                <option value="es">spanish</option>
                <option value="it">italian</option>
                <option value="ru">russian</option>
                <option value="pl">polish</option>
                <option value="zh">chinese</option>
        </select>
  
</div>
)
}
export default Filter;