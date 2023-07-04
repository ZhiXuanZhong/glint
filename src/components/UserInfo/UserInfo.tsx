const UserInfo = ({ imageURL, name, level, licence, children }: Info) => {
  return (
    <div className="shadow-md m-3 rounded-lg bg-gray-400">
      <picture>
        <img src={imageURL} alt="avatar" />
      </picture>
      <div>{name}</div>
      <div>{level}</div>
      <div>{licence}</div>
      <div>{children}</div>
    </div>
  );
};

export default UserInfo;
