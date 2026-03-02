export type GeoLocation = {
  accuracy: number;
  latitude: number;
  longitude: number;
  altitude: number | null;
  altitudeAccuracy: number | null;
  heading: number | null;
  speed: number | null;
};

export const getUserLocation = async (
  forcePrompt: boolean = false
): Promise<GeoLocation | null> => {
  console.log('getuser location is running')
  try {
    const permission = await navigator.permissions.query({
      name: "geolocation",
    });

    const getPosition = () =>
      new Promise<GeoLocation>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            console.log('coords: ', pos.coords)
            resolve(pos.coords)
          },
          (err) => {
            reject(err)
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          }
        );
      });

    // Granted → directly get location
    if (permission.state === "granted") {
      return await getPosition();
    }

    // Prompt → browser will ask user
    if (permission.state === "prompt") {
      return await getPosition();
    }

    // Denied → retry ONLY if explicitly forced
    if (permission.state === "denied") {
      if (forcePrompt) {
        return await getPosition(); // may still fail
      }

      console.warn("Location access denied");
      return null;
    }

    return null;
  } catch (err) {
    console.error("Location error:", err);
    return null;
  }
};
