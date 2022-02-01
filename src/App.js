import "./App.css";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { DropdownButton, Dropdown } from "react-bootstrap";
function App() {
  const [fetchedData, setFetchedData] = useState([]);
  const [showlist, setShowlist] = useState([]);
  const [searchlist, setSearchlist] = useState([]);
  const [sorted, setSorted] = useState([]);
  const [flag, setFlag] = useState(false);
  const [error, setError] = useState("");
  const [showDetail, setShowDetail] = useState();
  const [pageCount, setpageCount] = useState(0);
  let searchResult = [];
  let limit = 15;

  //...........fetching API...........................
  useEffect(() => {
    const getComments = async () => {
      const res = await fetch(
        `https://jsonplaceholder.typicode.com/todos?_page=1&_limit=${limit}`
      );
      const data = await res.json();
      const total = res.headers.get("x-total-count");
      setpageCount(Math.ceil(total / limit));
      setFetchedData(data);
      setShowlist(data);
    };

    getComments();
  }, [limit]);

  const fetchComments = async (currentPage) => {
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/todos?_page=${currentPage}&_limit=${limit}`
    );
    const data = await res.json();
    return data;
  };

  const handlePageClick = async (data) => {
    console.log(data.selected);
    let currentPage = data.selected + 1;
    const commentsFormServer = await fetchComments(currentPage);
    setShowlist(commentsFormServer);
  };

  const handleSearch = (e) => {
    if (e.target.value) {
      let select = [];
      sorted.length ? (select = sorted) : (select = fetchedData);

      searchResult = select.filter((elm) => {
        return Object.values(elm.title)
          .join("")
          .toLowerCase()
          .includes(e.target.value.toLowerCase());
      });

      if (searchResult && searchResult.length) {
        setShowDetail(searchResult.length);

        setError("");
        setShowlist(searchResult);
        setSearchlist(searchResult);
        setFlag(true);
      } else {
        setShowlist([]);
        setError("No match found");
      }
    } else {
      setShowlist(fetchedData);
      setSorted(fetchedData);
      setError("");
      setShowDetail(fetchedData.length);
    }
  };

  const handleAll = () => {
    setShowlist(fetchedData);
    setSorted(fetchedData);
    setSearchlist(fetchedData);
    setFlag(false);
    setShowDetail(fetchedData.length);
  };

  const handleCompleted = () => {
    let select = "";
    flag ? (select = searchlist) : (select = fetchedData);
    {
      const match = select.filter((elm) => {
        return elm.completed === true;
      });
      setShowlist(match);
      setShowDetail(match.length);
      setSorted(match);
    }
  };

  const handleUnCompleted = () => {
    let select = "";
    flag ? (select = searchlist) : (select = fetchedData);
    {
      const match = select.filter((elm) => {
        return elm.completed === false;
      });
      setSorted(match);
      setShowlist(match);
      setShowDetail(match.length);
      setFlag(true);
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
              UNCOMPLETED
            </Dropdown.Item>
          </DropdownButton>
        </div>
      </div>
      {!error && showDetail && (
        <p className="text-danger"> Total searched card :{showDetail}</p>
      )}

      <div className="container ">
        <div className="row m-2 ">
          {showlist.map((item) => {
            return (
              <div key={item.id} className="col-sm-6 col-md-4 v my-2 bg-danger">
                <div
                  className="card shadow-sm w-100"
                  style={{ minHeight: 225 }}
                >
                  <div className="card-body ">
                    <h5 className="card-title text-center h2">
                      Id :{item.id}{" "}
                    </h5>
                    <h6 className="card-subtitle mb-2 text-muted text-center">
                      Title: {item.title}
                    </h6>
                    <p className="text-center">
                      <strong>status</strong>
                      {item.completed ? (
                        <span className="text-success">completed</span>
                      ) : (
                        <span className="text-danger"> Not completed"</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {error && <h1 className="text-danger">{error}</h1>}
        {!error && (
          <ReactPaginate
            previousLabel={"previous"}
            nextLabel={"next"}
            breakLabel={"..."}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            onPageChange={handlePageClick}
            containerClassName={"pagination justify-content-center"}
            pageClassName={"page-item"}
            pageLinkClassName={"page-link"}
            previousClassName={"page-item"}
            previousLinkClassName={"page-link"}
            nextClassName={"page-item"}
            nextLinkClassName={"page-link"}
            breakClassName={"page-item"}
            breakLinkClassName={"page-link"}
            activeClassName={"active"}
          />
        )}
      </div>
    </>
  );
}

export default App;
