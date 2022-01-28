import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { DropdownButton, Dropdown } from "react-bootstrap";

function App() {
  const [detail, setdetail] = useState([]);
  const [searchlist, setSearchlist] = useState();
  const [flag, setFlag] = useState("");
  const [title, setTitle] = useState("");
  const [matching, setMatching] = useState("");

  //...........fetching API...........................
  async function fetchData() {
    try {
      const result = await axios.get(
        "https://jsonplaceholder.typicode.com/todos"
      );
      setdetail(result.data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  //.................onchange searching ....................
  const handleSearch = (e) => {
    if (e.target.value !== "") {
      setTitle(e.target.value);
      let select = "";
      searchlist ? (select = searchlist) : (select = detail);
      var match = select.filter((elm) => {
        return Object.values(elm.title)
          .join("")
          .toLowerCase()
          .includes(e.target.value.toLowerCase());
      });
      setSearchlist(match);
    
    } else {
      setSearchlist(detail);
    }
    
  };
 
  const handleAll = () => {
    setSearchlist(detail);
  };

  const handleCompleted = () => {
    if (searchlist) {
      let select = "";
      flag ? (select = searchlist) : (select = detail);
      {
        const match = select.filter((elm) => {
          return elm.completed === true;
        });
        setSearchlist(match);
        setFlag(true);
      }
    } else {
      const match = detail.filter((elm) => {
        return elm.completed === true;
      });
      setSearchlist(match);
      setFlag(true);
    }
  };

  const handleUnCompleted = () => {
    if (!flag) {
      let select = "";
      searchlist ? (select = searchlist) : (select = detail);
      {
        const match = select.filter((elm) => {
          return elm.completed === false;
        });
        setSearchlist(match);
        setFlag(false);
      }
    } else {
      const match = detail.filter((elm) => {
        return elm.completed === false;
      });
      setSearchlist(match);
      setFlag(false);
    }
  };

  return (
    <>
      <div
        className="d-flex 
                  justify-content-between flex-row bd-highlight mb-3  "
      >
        <div>
          <input
            type="text"
            placeholder="search here......"
            name="title"
            className="form-control-lg "
            onChange={handleSearch}
          ></input>
        </div>
        <div>
          <DropdownButton id="dropdown-item-button" title="SORT-BY">
            <Dropdown.Item onClick={handleAll}>ALL</Dropdown.Item>
            <Dropdown.Item onClick={handleCompleted}>COMPLETED</Dropdown.Item>
            <Dropdown.Item onClick={handleUnCompleted}>
              UNCOMPLETD
            </Dropdown.Item>
          </DropdownButton>
        </div>
      </div>
      <div className="row">
        {searchlist
          ? searchlist.map((elm, index) => {
              return (
                <div className="d-flex flex-column mb-3 col-md-4 " key={index}>
                  <div className="bg-secondary rounded text-white">
                    <div className="p-2">Id:{elm.id}</div>
                    <div className="p-2">UserId:{elm.userId}</div>
                    <div className="p-2">Title:{elm.title}</div>
                    <div className="p-2">
                      Status:{JSON.stringify(elm.completed)}
                    </div>
                  </div>
                </div>
              );
            })
          : detail.map((elm, index) => {
              return (
                <div className="d-flex flex-column mb-3 col-md-4  " key={index}>
                  <div className="bg-secondary rounded text-white">
                    <div className="p-2">Id:{elm.id}</div>
                    <div className="p-2">UserId:{elm.userId}</div>
                    <div className="p-2">Title:{elm.title}</div>
                    <div className="p-2">
                      Status:{JSON.stringify(elm.completed)}
                    </div>
                  </div>
                </div>
              );
            })}
      </div>
    </>
  );
}

export default App;
