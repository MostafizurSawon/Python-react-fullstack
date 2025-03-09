import './Loading.css'; // We'll create this CSS file for styling

function Loading() {
  return (
    <div className="loading-container">
      <iframe
        src="https://lottie.host/embed/0eb0411c-6029-4ba0-a6d5-03e2d63d7a15/JqCBNGYsoM.json"
        title="Loading Animation"
        className="loading-iframe"
      ></iframe>
    </div>
  );
}

export default Loading;