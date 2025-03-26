// components/UserMessages.jsx
import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { Navigate } from "react-router-dom";
import myaxios from "../utils/myaxios";
import "./UserMessages.css";

const UserMessages = () => {
  const { user } = useUser();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response = await myaxios.get("/contact/messages/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
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

    if (user?.role === "Admin") {
      fetchMessages();
    }
  }, [user]);

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
        <>
          {/* Table for desktop */}
          <div className="table-responsive d-none d-md-block">
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

          {/* Card layout for mobile */}
          <div className="d-md-none">
            {messages.map((message, index) => (
              <div key={message.id} className="card mb-3 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Message #{index + 1}</h5>
                  <p className="card-text">
                    <strong>Sender Name:</strong> {message.name}
                  </p>
                  <p className="card-text">
                    <strong>Sender Email:</strong> {message.email || "N/A"}
                  </p>
                  <p className="card-text">
                    <strong>Message:</strong> {message.message}
                  </p>
                  <p className="card-text">
                    <strong>Date Sent:</strong>{" "}
                    {new Date(message.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default UserMessages;