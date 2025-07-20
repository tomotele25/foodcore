import React from "react";

const Loader = () => {
  return (
    <div className="loader-wrapper">
      <div className="loader"></div>

      <style jsx>{`
        .loader-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background: #ffffff;
        }

        .loader {
          position: relative;
          transform: rotateZ(45deg);
          perspective: 1000px;
          border-radius: 50%;
          width: 48px;
          height: 48px;
          color: #ae2108;
        }

        .loader::before,
        .loader::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          transform: rotateX(70deg);
          animation: spin 1s linear infinite;
        }

        .loader::after {
          color: #ff3d00;
          transform: rotateY(70deg);
          animation-delay: 0.4s;
        }

        @keyframes spin {
          0%,
          100% {
            box-shadow: 0.2em 0 0 0 currentColor;
          }
          12% {
            box-shadow: 0.2em 0.2em 0 0 currentColor;
          }
          25% {
            box-shadow: 0 0.2em 0 0 currentColor;
          }
          37% {
            box-shadow: -0.2em 0.2em 0 0 currentColor;
          }
          50% {
            box-shadow: -0.2em 0 0 0 currentColor;
          }
          62% {
            box-shadow: -0.2em -0.2em 0 0 currentColor;
          }
          75% {
            box-shadow: 0 -0.2em 0 0 currentColor;
          }
          87% {
            box-shadow: 0.2em -0.2em 0 0 currentColor;
          }
        }
      `}</style>
    </div>
  );
};

export default Loader;
