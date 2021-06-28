import { React, useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const List2 = () => {
  const [details, setDetails] = useState({});

  function handleOnDragEnd(result) {
    const items = Array.from(details);
    const [reorderedItem] = items.splice(result.source.index, 1);
    console.log(result);
    //items.splice(result.destination.index, 0, reorderedItem);
    // setDetails(items);
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

    obj.forEach((element, index) => {
      if (element.type === "item" && element.selected === 1) {
        myjsx2.push(
          <Draggable
            // key={parseInt(element.id.match(/(\d+)/)[0])}
            key={element.id.match(/\d+/g).join("")}
            draggableId={element.id.match(/\d+/g).join("")}
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
                    {element.name}
                  </span>
                  <ul className='nested'>
                    {traverseChildjson(element.children)}
                  </ul>
                </div>
              </li>
            )}
          </Draggable>
        );
      }
    });
    return myjsx2;
  };
  //Toggle function to have toggling effect
  const toggleFunction = (e) => {
    e.target.parentElement.querySelector(".nested").classList.toggle("active");
    e.target.classList.toggle("caret-down");
  };

  //function to display the output
  const displayRes = Object.entries(details).map((res, index) => {
    let myjsx = (
      <li>
        <span className='caret' onClick={(e) => toggleFunction(e)}>
          {res[1].RestaurantName}
        </span>
        {res[1].menu[0].type === "sectionheader" ? (
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId={res[1].RestaurantID}>
              {(provided) => (
                <ul
                  className='nested'
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  <div>
                    {traverseJson(res[1].menu[0].children)}
                    {provided.placeholder}
                  </div>
                </ul>
              )}
            </Droppable>
          </DragDropContext>
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
      <ul>{displayRes}</ul>
    </div>
  );
};
export default List2;
