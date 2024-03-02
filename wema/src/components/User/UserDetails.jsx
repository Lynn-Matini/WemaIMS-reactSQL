import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function UserDetails() {
  const [user, setUser] = useState([]);
  const { id } = useParams();
  useEffect(() => {
    axios
      .get('http://localhost:3000/user/details/' + id)
      .then((result) => {
        setUser(result.data[0]);
      })
      .catch((err) => console.log(err));
  }, []);

  return <div>{user.name}</div>;
}

export default UserDetails;
