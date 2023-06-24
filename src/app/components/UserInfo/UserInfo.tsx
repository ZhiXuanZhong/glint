interface Info {
  imageURL: string;
  name: string;
  level: string;
  licence: boolean;
}

const UserInfo = ({ imageURL, name, level, licence }: Info) => {
  return (
    <div className="bg-gray-400">
      <picture>
        <img src={imageURL} alt="avatar" />
      </picture>
      <div>{name}</div>
      <div>{level}</div>
      <div>{licence}</div>
    </div>
  );
};

export default UserInfo;
