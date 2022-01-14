import { useCallback, useEffect, useState } from "react";
import github from "./db";
import query from "./Query";
import RepoInfo from "./RepoInfo";
import SearchBox from "./SearchBox";

function App() {
  const [userName, setUserName] = useState();
  const [repoList, setRepoList] = useState();
  const [pageCount, setPageCount] = useState(2);
  const [totalCount, setTotalCount] = useState();
  const [queryString, setQueryString] = useState("");
  const [startCursor, setStartCursor] = useState(null);
  const [endCursor, setEndCursor] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [paginationKeyword, setPaginationKeyword] = useState("first");
  const [paginationString, setPaginationString] = useState("");
  const fetchData = useCallback(() => {
    const queryText = JSON.stringify(query(pageCount, queryString, paginationKeyword, paginationString));

    fetch(github.baseUrl, {
      method: "POST",
      headers: github.headers,
      body: queryText
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setStartCursor(data.data.search.pageInfo.startCursor);
        setEndCursor(data.data.search.pageInfo.endCursor);
        setHasNextPage(data.data.search.pageInfo.hasNextPage);
        setHasPreviousPage(data.data.search.pageInfo.hasPreviousPage);
        setUserName(data.data.viewer.name);
        setTotalCount(data.data.search.repositoryCount);
        setRepoList(data.data.search.edges);
      })
      .catch((err) => console.log(err));
  }, [pageCount, queryString, paginationKeyword, paginationString]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="App container mt-5">
      <h1 className="text-primary">
        <i className="bi bi-diagram-2-fill"></i> Repos
      </h1>
      <p>Hi there {userName}</p>
      <SearchBox
        {...{
          totalCount,
          pageCount,
          queryString,
          onTotalChange: (cnt) => setPageCount(cnt),
          onQueryChange: (str) => setQueryString(str)
        }}
      />
      {repoList && (
        <ul className="list-group list-group-flush">
          {repoList.map((repo) => (
            <RepoInfo id={repo.node.id} repo={repo.node} />
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
