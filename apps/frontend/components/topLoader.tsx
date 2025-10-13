import NextTopLoader from "nextjs-toploader";
import React from "react";

const TopLoader = () => {
  return (
    <>
    <NextTopLoader
      color="#22c55e" // Bright green
      height={3}
      shadow="5px 5px 12px #22c55e"
      easing="ease-in-out"
      speed={350}
      zIndex={9999}
      showSpinner={false}
      template='<div class="bar" role="bar" style="box-shadow: 0 0 8px #22c55e;"></div>'
      />
    </>
  );
};

export default TopLoader;
