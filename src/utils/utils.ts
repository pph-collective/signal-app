export const formatVariable = ({
  name,
  units,
}: {
  name: string;
  units: string;
}) => {
  if (units) {
    return `${name} (${units})`;
  } else {
    return name;
  }
};

export const formatCoordinate = ({
  station_name,
  buoyId,
}: {
  station_name: string;
  buoyId: string;
}) => {
  return `${station_name} (${buoyId})`;
};

export const localISODate = (d: Date) => new Date(d).toLocaleDateString("sv");
export const localISODateToUTC = (d: string) =>
  new Date(
    parseInt(d.slice(0, 4)),
    parseInt(d.slice(5, 7)) - 1,
    parseInt(d.slice(8, 10))
  );
