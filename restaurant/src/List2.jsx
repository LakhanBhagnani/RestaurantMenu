import { React, useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const List2 = () => {
  const [details, setDetails] = useState({});

  function handleOnDragEnd(res) {
    const sourcedetails = details.filter((item) => {
      if (item.RestaurantID == res.source.droppableId) return item;
    });

    const sourceMenu = sourcedetails[0].menu;
    const destinationdetails = details.filter((item) => {
      if (item.RestaurantID == res.destination.droppableId) return item;
    });

    const destinationMenu = destinationdetails[0].menu;
    const finalMenu = destinationMenu.concat(sourceMenu);
    
    const finaldetails = details.slice();

    const sourceIndex = details.findIndex((item, ind) => {
      if (item.RestaurantID == res.source.droppableId) {return ind;}
    });

    const destinationIndex = details.findIndex((item, ind) => {
      if (item.RestaurantID == res.destination.droppableId){ return ind;}
    });
    debugger
    finaldetails[sourceIndex].menu=sourceMenu;
    finaldetails[destinationIndex].menu=finalMenu;
    console.log(finaldetails);
    setDetails(finaldetails);
  }

  /*useEffect hook is used to load data from API and Stroing its value in variable
    As we don't want this effect to run again on re-renders I have added empty brackets which will automatically make sure it runs once*/
  useEffect(() => {
    fetch("https://api.npoint.io/93bed93a99df4c91044e")
      .then((response) => response.json())
      .then((data) => {
        setDetails(data.body.Recommendations);
      });
  }, []);
  /* Created a function traversing inner children object with one codition of selected
    Recursion is used here for looping inner children child*/
  const traverseChildjson = (object) => {
    let innerchild = [];
    object.forEach((obj) => {
      if (obj.selected === 1) {
        innerchild.push(<li>{obj.name}</li>);
        if (obj.chidren !== undefined) {
          traverseChildjson(obj.children);
        }
      }
    });
    return innerchild;
  };

  /* traverseJson is used to traverse  through first child with two condition of type and selected */
  const traverseJson = (obj) => {
    let myjsx2 = []; //Array obj to store JSX
    obj.forEach((child) => {
      Array(child.children).forEach((element, index) => {
        if (element[0].type === "item" && element[0].selected === 1) {
          myjsx2.push(
            <Draggable
              // key={parseInt(element.id.match(/(\d+)/)[0])}
              key={element[0].id.match(/\d+/g).join("")}
              draggableId={element[0].id.match(/\d+/g).join("")}
              index={index}
            >
              {(provided) => (
                <li
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  <div>
                    <span className='caret' onClick={(e) => toggleFunction(e)}>
                      {element[0].name}
                    </span>
                    <ul className='nested'>
                      {traverseChildjson(element[0].children)}
                    </ul>
                  </div>
                </li>
              )}
            </Draggable>
          );
        }
      });
    });

    return myjsx2;
  };
  //Toggle function to have toggling effect
  const toggleFunction = (e) => {
    if (e.target.parentElement.querySelector(".nested") != undefined) {
      e.target.parentElement
        .querySelector(".nested")
        .classList.toggle("active");
      e.target.classList.toggle("caret-down");
    }
  };

  //function to display the output
  const displayRes = Object.entries(details).map((res, index) => {
    let myjsx = (
      <li>
        <span className='caret' onClick={(e) => toggleFunction(e)}>
          {res[1].RestaurantName}
        </span>
        {res[1].menu[0] == undefined ||
        res[1].menu[0].type === "sectionheader" ? (
          <Droppable droppableId={res[1].RestaurantID}>
            {(provided) => (
              <ul
                className='nested'
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                <div>
                  {res[1].menu[0] != undefined ? (
                    traverseJson(res[1].menu)
                  ) : (
                    <></>
                  )}
                  {provided.placeholder}
                </div>
              </ul>
            )}
          </Droppable>
        ) : (
          <></>
        )}
      </li>
    );

    return myjsx;
  });

  return (
    <div>
      <h1>List2</h1>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <ul>{displayRes}</ul>
      </DragDropContext>
    </div>
  );
};
export default List2;
