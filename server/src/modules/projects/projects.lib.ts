export const getRepositoryPath = (owner: string, name: string) => {
  return `${owner}/${name}`;
};

export const splitRepositoryPath = (repositoryPath: string) => {
  const [owner, name] = repositoryPath.split("/");
  return { owner, name };
};
