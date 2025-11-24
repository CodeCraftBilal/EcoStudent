export const getUserLocation = () => {
    navigator.permissions.query({ name: "geolocation" }).then((result) => {
      let userLocation;
    console.log(result.state); // "granted" | "prompt" | "denied"

    if (result.state === "granted") {
      // You can directly get location without triggering popup
      userLocation = navigator.geolocation.getCurrentPosition((pos) => {
        console.log("Location:", pos.coords);
      });
    } else if (result.state === "prompt") {
      // User has not decided yet → this will trigger the browser popup
      userLocation = navigator.geolocation.getCurrentPosition((pos) => {
        console.log("Location allowed now:", pos.coords);
      });
    } else if (result.state === "denied") {
      // User blocked it permanently
      console.log("User denied location access");
    }
  });
};
