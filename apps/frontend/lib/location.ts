type GeoLocation = {
  accuracy: number,
  latitude: number,
  longitude: number,
  altitude: number | null,
  altitudeAccuracy: number | null,
  heading: number | null,
  speed: number | null
};

export const getUserLocation = async (): Promise<GeoLocation | null> => {
  try {
    const permission = await navigator.permissions.query({ name: "geolocation" });

    // Helper to wrap getCurrentPosition into a Promise
    const getPosition = () =>
      new Promise<GeoLocation>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve(pos.coords),
          (err) => reject(err),
        );
      });

    if (permission.state === "granted") {
      return await getPosition();
    }

    if (permission.state === "prompt") {
      // Will trigger browser popup
      return await getPosition();
    }

    if (permission.state === "denied") {
      console.log("User denied location access");
      return null;
    }

    return null;
  } catch (err) {
    console.error("Location error:", err);
    return null;
  }
};
