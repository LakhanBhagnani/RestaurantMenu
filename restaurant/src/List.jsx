import {
  React,
  useState,
  useEffect
} from 'react'

const List = () => {
    const [details, setDetails] = useState({});

    useEffect(() => {
      fetch("https://api.npoint.io/93bed93a99df4c91044e")
        .then((response) => response.json())
        .then((data) => {
          setDetails(data.body.Recommendations);
        });
    }, []);

    const displayRes=Object.entries(details)
        .map((res) => {
          debugger;
            let myjsx=<li>{res[1].RestaurantName} 
            {
              res[1].menu[0].type=="sectionheader" ?
              ((res[1].menu[0].children[0].type=="item" && res[1].menu[0].children[0].selected=="1")?(<li>{res[1].menu[0].children[0].name}</li>
                
                ):(<></>))
              :(<></>)}
           </li> 
        
                return (
                    myjsx
                  ); 
           });


          return (
            <div>
           <ul>
           {displayRes}
           </ul>
           </div>
          )

        }
        export default List;