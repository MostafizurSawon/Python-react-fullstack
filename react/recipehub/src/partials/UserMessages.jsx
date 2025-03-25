// components/UserMessages.jsx
import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { Navigate } from "react-router-dom";
import axios from "axios";
import "./UserMessages.css";

const UserMessages = () => {
  const { user } = useUser();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch messages when the component mounts
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8000/contact/messages/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Adjust based on your auth method
          },
        });
        setMessages(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load messages. Please try again later.");
        setLoading(false);
        console.error("Error fetching messages:", err);
      }
    };

    // Only fetch messages if the user is an admin
    if (user?.role === "Admin") {
      fetchMessages();
    }
  }, [user]);

  // Redirect non-admin users to the dashboard
  if (!user || user.role !== "Admin") {
    return <Navigate to="/dashboard/index" replace />;
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">User Messages</h2>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      ) : messages.length === 0 ? (
        <div className="alert alert-info" role="alert">
          No messages received yet.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead className="table-dark">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Sender Name</th>
                <th scope="col">Sender Email</th>
                <th scope="col">Message</th>
                <th scope="col">Date Sent</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((message, index) => (
                <tr key={message.id}>
                  <td>{index + 1}</td>
                  <td>{message.name}</td>
                  <td>{message.email || "N/A"}</td>
                  <td>{message.message}</td>
                  <td>{new Date(message.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserMessages;