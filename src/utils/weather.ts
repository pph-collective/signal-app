import axios from "axios";

export async function fetchWeather({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}) {
  const headers = {
    "Content-Type": "application/json",
  };
  const data = {
    sid: "PVDthr 9",
    sdate: startDate,
    edate: endDate,
    elems: [
      { name: "maxt", interval: "dly" },
      { name: "mint", interval: "dly" },
      { name: "avgt", interval: "dly" },
      { name: "pcpn", interval: "dly" },
    ],
  };

  const response = await axios.post("https://data.rcc-acis.org/StnData", data, {
    headers,
  });

  return response.data.data.map((d: number[]) => ({
    date: new Date(d[0]),
    maxTemp: fToC(d[1]),
    minTemp: fToC(d[2]),
    avgTemp: fToC(d[3]),
    precipitation: d[4],
  }));
}

// farenheit to celsius converter
const fToC = (temp: number) => ((temp - 32) * 5) / 9;
