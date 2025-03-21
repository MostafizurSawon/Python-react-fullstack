// pages/dashboard/ProfilePage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Added for navigation
import myaxios from "../../utils/myaxios";
import { errorToast, successToast } from "../../utils/toast";
import Navbar from "../../partials/NavBar"; // Added Navbar
import Footer from "../Footer"; // Added Footer

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
  const navigate = useNavigate(); // Added for navigation
  const [profileData, setProfileData] = useState(defaultProfileData);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true); // Added for initial loading state
  const [submitting, setSubmitting] = useState(false); // Added for form submission spinner

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          errorToast("Please log in to access this page");
          navigate("/login");
          return;
        }

        const response = await myaxios.get("accounts/profile/");
        console.log("0000 ->", response.data);
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
          navigate("/dashboard"); // Redirect on failure
        }
      } catch (error) {
        console.error(error);
        errorToast("Failed to fetch profile data!");
        navigate("/dashboard"); // Redirect on error
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [navigate]);

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

  const handleUpdate = (e) => {
    e.preventDefault();
    setSubmitting(true);

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
    if (profileData.profile.image instanceof File) {
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
        })
        .finally(() => {
          setSubmitting(false);
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
        })
        .finally(() => {
          setSubmitting(false);
        });
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div
          className="spinner-border text-primary"
          role="status"
          style={{ width: "3rem", height: "3rem" }}
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Navbar />
      <div className="container my-5 flex-grow-1">
        <div className="row justify-content-center">
          <div className="col-md-10 col-lg-8">
            <div className="card shadow-lg p-4 border-0 rounded-4">
              <div className="card-body">
                <h3 className="card-title text-center mb-5 text-primary">
                  Update Your Profile 
                </h3>
                <form onSubmit={handleUpdate}>
                  <div className="mb-4">
                    <label
                      htmlFor="email"
                      className="form-label text-muted"
                    >
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
                  <div className="mb-4">
                    <label
                      htmlFor="mobile"
                      className="form-label text-muted"
                    >
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
                  <div className="mb-4">
                    <label
                      htmlFor="firstName"
                      className="form-label text-muted"
                    >
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
                  <div className="mb-4">
                    <label
                      htmlFor="lastName"
                      className="form-label text-muted"
                    >
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
                  <div className="mb-4">
                    <label
                      htmlFor="password"
                      className="form-label text-muted"
                    >
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
                  <h5 className="mb-4 mt-5 text-primary">
                    Profile Information
                  </h5>
                  <div className="mb-4">
                    <label
                      htmlFor="image"
                      className="form-label text-muted"
                    >
                      Profile Image
                    </label>
                    {imagePreview && (
                      <div className="mb-3">
                        <img
                          src={imagePreview}
                          alt="Profile Preview"
                          className="img-fluid rounded-circle shadow-sm"
                          style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
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
                  <div className="mb-4">
                    <label
                      htmlFor="age"
                      className="form-label text-muted"
                    >
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
                  <div className="mb-4">
                    <label
                      htmlFor="sex"
                      className="form-label text-muted"
                    >
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
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="bio"
                      className="form-label text-muted"
                    >
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
                  <div className="mb-4">
                    <label
                      htmlFor="portfolio"
                      className="form-label text-muted"
                    >
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
                  <div className="mb-5">
                    <label
                      htmlFor="facebook"
                      className="form-label text-muted"
                    >
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

                  {/* Submit Button */}
                  <div className="text-center mt-4">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg d-flex align-items-center justify-content-center mx-auto"
                      disabled={submitting}
                      style={{ minWidth: "200px" }}
                    >
                      {submitting ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Updating...
                        </>
                      ) : (
                        "Update Profile"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;