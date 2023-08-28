import { useEffect, useState } from "react";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

function TopButton() {
  const [toggleButton, setToggleButton] = useState(true);

  const goToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const handleScroll = () => {
      window.scrollY > 20 ? setToggleButton(true) : setToggleButton(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {toggleButton && (
        <div
          className="scroll-top"
          style={{
            position: "fixed",
            right: "5%",
            bottom: "5%",
            zIndex: 100,
          }}
        >
          <button
            style={{
              borderRadius: "50%",
              border: "none",
              width: "40px",
              height: "40px",
              backgroundColor: "white",
              color: "black",
              cursor: "pointer",
            }}
            onClick={goToTop}
            type="button"
          >
            <ArrowUpwardIcon />
          </button>
        </div>
      )}
    </>
  );
}

export default TopButton;
