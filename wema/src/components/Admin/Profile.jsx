import axios from 'axios';
import { useEffect, useState } from 'react';

function Profile() {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
  });

  useEffect(() => {
    axios
      .get('http://localhost:3000/admin/admin')
      .then((result) => {
        if (result.data.Status) {
          setProfile({
            name: result.data.Result[0].name,
            email: result.data.Result[0].email,
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
          <img src="/src/assets/user.png" alt="" className="profile_image" />
        </div>
        <hr />
        <h4>Name:</h4>
        {profile.name}
        <br />
        <br />
        <h4>Email Address:</h4>
        {profile.email}
        {console.log(profile)}
      </div>
    </div>
  );
}

export default Profile;
