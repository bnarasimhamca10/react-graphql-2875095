const RepoInfo = ({repo}) => {
  return (
    <li className="list-group-tem" key={repo.id.toString()}>
      <a className="h5 mb-0 text-decoration-none" href={repo.url}>
        {repo.name}
      </a>
      <p>{repo.description}</p>
      <p>License: {repo?.licenseInfo?.spdxId || "NO LICENCE"}</p>
      <p>Subscriped: {repo.viewerSubscription}</p>
    </li>
  );
};

export default RepoInfo;