import React, { useState, useEffect } from "react";
import List from "./List";
import Alert from "./Alert";


const getLocalStorage = () => {
  let list = localStorage.getItem('list');
  if (list) {
    return JSON.parse(localStorage.getItem('list'))
  }
  else {
    return [];
  }
}

function App() {
  const [inputValue, setInputValue] = useState("");
  const [list, setList] = useState(getLocalStorage());
  const [isEditing, setIstEditing] = useState(false);
  const [editID, setEditID] = useState(null);
  const [alert, setAlert] = useState({
    show: false,
    msg: "",
    type: "",
  });

  const showAlert = (show = false, type = "", msg = "") => {
    setAlert({ show, msg, type });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (!inputValue) {
      showAlert(true, "danger", "please enter input");
    } else if (inputValue && isEditing) {
      setList(
        list.map((item) => {
          if (item.id === editID) {
            return { ...item, title: inputValue };
          }
          return item;
        })
      );
      setInputValue("");
      setEditID(null);
      setIstEditing(false);
      showAlert(true, "success", "edited successfully");
    } else {
      const newItem = {
        id: new Date().getTime().toString(),
        title: inputValue,
      };
      setList([...list, newItem]);
      setInputValue('');
      showAlert(true, "success", "added successfully");
    }
  };

  const clearList = () => {
    setList([]);
  };

  const deleteListMember = (id) => {
    setList(list.filter((item) => item.id !== id));
    showAlert(true, "success", "deleted successfully");
  };

  const editListMember = (id) => {
    let specificItem = list.find((item) => item.id === id);
    setIstEditing(true);
    setEditID(id);
    setInputValue(specificItem.title);
  };

  useEffect(() => {
    localStorage.setItem("list", JSON.stringify(list));
  }, [list]);

  return (
    <section className="section-center">
      <form className="grocery-form" onSubmit={submitHandler}>
        {alert.show && <Alert {...alert} removeAlert={showAlert} list={list} />}
        <h3>grocery bud</h3>
        <div className="form-control">
          <input
            type="text"
            className="grocery"
            placeholder="e.g. eggs"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button className="submit-btn">
            {isEditing ? "edit" : "submit"}
          </button>
        </div>
      </form>
      {list.length > 0 && (
        <div className="grocery-container">
          <List
            items={list}
            removeItem={deleteListMember}
            editItem={editListMember}
          />
          <button className="clear-btn" onClick={clearList}>
            clear items
          </button>
        </div>
      )}
    </section>
  );
}

export default App;
