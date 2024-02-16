import "./night-mode.scss";

const NightMode = () => {
  return (
    <div className="night-mode">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        width="22"
        height="22"
        viewBox="0 0 26.1 26.1"
        className="night-svg"
      >
        <defs>
          <clipPath id="ttt" transform="translate(-1.95 -1.95)">
            <rect width="30" height="30" fill="none"></rect>
          </clipPath>
        </defs>
        <g clip-path="url(#ttt)">
          <circle
            cx="13.05"
            cy="13.05"
            r="12.55"
            fill="none"
            stroke="black"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></circle>
          <path
            d="M15.46,6.59a1.15,1.15,0,0,1,1.28-1.14,9.64,9.64,0,0,1,0,19.1,1.14,1.14,0,0,1-1.28-1.14Z"
            transform="translate(-1.95 -1.95)"
            fill="black"
            stroke="black"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="0.91"
          ></path>
        </g>
      </svg>
    </div>
  );
};

export default NightMode;
