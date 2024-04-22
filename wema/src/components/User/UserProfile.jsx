import axios from 'axios';
import { useEffect, useState } from 'react';

function UserProfile() {
  const id = localStorage.getItem('userId');
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    age: '',
    gender: '',
    address: '',
    image: '',
  });

  useEffect(() => {
    axios
      .get('http://localhost:3000/user/users/' + id)
      .then((result) => {
        if (result.data.Status) {
          const userData = result.data.Result[0];
          setProfile({
            name: userData.name,
            email: userData.email,
            age: userData.age,
            gender: userData.gender,
            address: userData.address,
            image: `http://localhost:3000/Images/${userData.image}`,
          });
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="px-5 mt-3">
      <div className="d-flex justify-content-center">
        <h3>Profile</h3>
      </div>
      <div className="mt-3">
        <div className="d-flex justify-content-center">
          <img src={profile.image} alt="" className="profile_image" />
        </div>
        <hr />
        <div className="display">
          <div className="p-3 d-flex flex-column mt-3">
            <h4>Name:</h4>
            <span className="profileText">{profile.name}</span>
            <br />
            <h4>Profile ID:</h4>
            <span className="profileText">{id}</span>
            <br />
            <h4>Email Address:</h4>
            <span className="profileText">{profile.email}</span>
          </div>

          <div className="p-3 d-flex flex-column mt-3">
            <h4>Gender:</h4>
            <span className="profileText">{profile.gender}</span>
            <br />
            <h4>Address:</h4>
            <span className="profileText">{profile.address}</span>
            <br />
            <h4>Age:</h4>
            <span className="profileText">{profile.age}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
