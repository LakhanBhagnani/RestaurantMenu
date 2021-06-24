import {
  React,
  useState,
  useEffect
} from 'react'
import { renderToString } from 'react-dom/server'
const List2 = () => {
    const [details, setDetails] = useState({});

    useEffect(() => {
      fetch("https://api.npoint.io/93bed93a99df4c91044e")
        .then((response) => response.json())
        .then((data) => {
          setDetails(data.body.Recommendations);
        });
    }, []);
    const traverseChildjson=(object)=>{
        let innerchild=[];
        object.forEach((obj)=>{
                if(obj.selected==1)
                    {
                    debugger;
                     innerchild.push(<li>{obj.name}</li>)
                     if(obj.chidren!==undefined)
                     {
                     traverseChildjson(obj.children);
                     }
                    }
        })
        return innerchild;
    }

    const traverseJson=(obj)=>{
        
        let myjsx2=[];
       
        obj.forEach(element => {
            if(element.type=="item" && element.selected==1)
            {
                         myjsx2.push(<li><span className="caret" onClick={(e)=>toggleFunction(e)}>{element.name}</span><ul className="nested">{traverseChildjson(element.children)}</ul></li>);
                         
                        
            }
                   
        });
        
        return myjsx2;
        
    }

    const toggleFunction=(e)=>{
        debugger;
        e.target.parentElement.querySelector(".nested").classList.toggle("active");
    e.target.classList.toggle("caret-down");
    }
    const displayRes=Object.entries(details)
        .map((res) => {
            let myjsx=<li><span className="caret" onClick={(e)=>toggleFunction(e)}>{res[1].RestaurantName}</span>
                        {res[1].menu[0].type=="sectionheader"? <ul class="nested">{traverseJson(res[1].menu[0].children)}</ul>:<></>}</li> 
        
                return (
                    myjsx
                  ); 
           });


          return (
            <div>
                <h1>List2</h1>
           <ul>
           {displayRes}
           </ul>
           </div>
          )

        }
        export default List2;