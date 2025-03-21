// pages/dashboard/ProfilePage.jsx
import { useEffect, useState } from "react";
import myaxios from "../../utils/myaxios";
import { errorToast, successToast } from "../../utils/toast";

const defaultProfileData = {
  email: "",
  firstName: "",
  lastName: "",
  mobile: "",
  password: "",
  profile: {
    image: null,
    age: "",
    portfolio: "",
    sex: "",
    bio: "",
    facebook: "",
  },
};

const ProfilePage = () => {
  const [profileData, setProfileData] = useState(defaultProfileData);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    myaxios.get("accounts/profile/")
      .then((response) => {
        console.log("0000 ->",response.data);
        const apiData = response.data?.data;
        if (apiData) {
          setProfileData({
            email: apiData.email || "",
            firstName: apiData.firstName || "",
            lastName: apiData.lastName || "",
            mobile: apiData.mobile || "",
            password: "",
            profile: {
              image: null,
              age: apiData.profile?.age || "",
              portfolio: apiData.profile?.portfolio || "",
              sex: apiData.profile?.sex || "",
              bio: apiData.profile?.bio || "",
              facebook: apiData.profile?.facebook || "",
            },
          });
          if (apiData.profile?.image) {
            setImagePreview(apiData.profile.image);
          }
        } else {
          setProfileData(defaultProfileData);
          errorToast("Failed to fetch profile data!");
        }
      })
      .catch((error) => {
        console.error(error);
        errorToast("Failed to fetch profile data!");
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in profileData.profile) {
      setProfileData({
        ...profileData,
        profile: {
          ...profileData.profile,
          [name]: value,
        },
      });
    } else {
      setProfileData({
        ...profileData,
        [name]: value,
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileData({
        ...profileData,
        profile: {
          ...profileData.profile,
          image: file,
        },
      });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // ProfilePage.jsx
const handleUpdate = (e) => {
    e.preventDefault();
  
    // Convert age to an integer or null
    const ageValue = profileData.profile.age ? parseInt(profileData.profile.age, 10) : null;
  
    // Prepare the data to send
    const dataToSend = {
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      mobile: profileData.mobile,
      profile: {
        age: ageValue,  
        portfolio: profileData.profile.portfolio,
        sex: profileData.profile.sex,
        bio: profileData.profile.bio,
        facebook: profileData.profile.facebook,
      },
    };
  
    // Only include password if provided
    if (profileData.password) {
      dataToSend.password = profileData.password;
    }
  
    // If there's an image, use FormData to handle file upload
    if (profileData.profile.image) {
      const formData = new FormData();
      formData.append("firstName", profileData.firstName);
      formData.append("lastName", profileData.lastName);
      formData.append("mobile", profileData.mobile);
      if (profileData.password) {
        formData.append("password", profileData.password);
      }
      formData.append("profile.image", profileData.profile.image);
      if (ageValue !== null) {
        formData.append("profile.age", ageValue);
      }
      formData.append("profile.portfolio", profileData.profile.portfolio);
      formData.append("profile.sex", profileData.profile.sex);
      formData.append("profile.bio", profileData.profile.bio);
      formData.append("profile.facebook", profileData.profile.facebook);
  
      myaxios
        .put("accounts/profile/update/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          if (response.data.status === "success") {
            successToast("Profile Updated Successfully!");
            if (profileData.profile.image) {
              setImagePreview(URL.createObjectURL(profileData.profile.image));
            }
          } else {
            errorToast("Profile Update Failed!");
          }
        })
        .catch((error) => {
          console.error(error);
          errorToast("Profile Update Failed!");
        });
    } else {
      // If no image, send as JSON
      myaxios
        .put("accounts/profile/update/", dataToSend)
        .then((response) => {
          if (response.data.status === "success") {
            successToast("Profile Updated Successfully!");
          } else {
            errorToast("Profile Update Failed!");
          }
        })
        .catch((error) => {
          console.error(error);
          errorToast("Profile Update Failed!");
        });
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-10 col-lg-8">
          <div className="card shadow-lg p-4">
            <div className="card-body">
              <h3 className="card-title text-center mb-4">Update Your Profile</h3>
              <form onSubmit={handleUpdate}>
                {/* Basic Information */}
                <h5 className="mb-3">Basic Information</h5>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="email" className="form-label">
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className="form-control"
                      value={profileData.email}
                      readOnly
                      disabled
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="mobile" className="form-label">
                      Mobile Number
                    </label>
                    <input
                      id="mobile"
                      name="mobile"
                      type="text"
                      className="form-control"
                      value={profileData.mobile}
                      onChange={handleChange}
                      placeholder="Enter mobile number"
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="firstName" className="form-label">
                      First Name
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      className="form-control"
                      value={profileData.firstName}
                      onChange={handleChange}
                      placeholder="Enter first name"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="lastName" className="form-label">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      className="form-control"
                      value={profileData.lastName}
                      onChange={handleChange}
                      placeholder="Enter last name"
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password (Leave blank to keep unchanged)
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    className="form-control"
                    value={profileData.password}
                    onChange={handleChange}
                    placeholder="Enter new password"
                  />
                </div>

                {/* Profile Information */}
                <h5 className="mb-3 mt-4">Profile Information</h5>
                <div className="mb-3">
                  <label htmlFor="image" className="form-label">
                    Profile Image
                  </label>
                  {imagePreview && (
                    <div className="mb-2">
                      <img
                        src={imagePreview}
                        alt="Profile Preview"
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                          borderRadius: "50%",
                        }}
                      />
                    </div>
                  )}
                  <input
                    id="image"
                    name="image"
                    type="file"
                    className="form-control"
                    onChange={handleImageChange}
                    accept="image/*"
                  />
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="age" className="form-label">
                      Age
                    </label>
                    <input
                      id="age"
                      name="age"
                      type="number"
                      className="form-control"
                      value={profileData.profile.age}
                      onChange={handleChange}
                      placeholder="Enter your age"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="sex" className="form-label">
                      Sex
                    </label>
                    <select
                      id="sex"
                      name="sex"
                      className="form-select"
                      value={profileData.profile.sex}
                      onChange={handleChange}
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="bio" className="form-label">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    className="form-control"
                    value={profileData.profile.bio}
                    onChange={handleChange}
                    placeholder="Tell us about yourself"
                    rows="3"
                  />
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="portfolio" className="form-label">
                      Portfolio URL
                    </label>
                    <input
                      id="portfolio"
                      name="portfolio"
                      type="url"
                      className="form-control"
                      value={profileData.profile.portfolio}
                      onChange={handleChange}
                      placeholder="Enter your portfolio URL"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="facebook" className="form-label">
                      Facebook URL
                    </label>
                    <input
                      id="facebook"
                      name="facebook"
                      type="url"
                      className="form-control"
                      value={profileData.profile.facebook}
                      onChange={handleChange}
                      placeholder="Enter your Facebook URL"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="text-center mt-4">
                  <button type="submit" className="btn btn-primary btn-lg">
                    Update Profile
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;