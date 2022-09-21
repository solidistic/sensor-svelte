<script>
  import { onMount } from "svelte";
  import temperatureIcon from "./assets/temperature-control.png";
  import humidityIcon from "./assets/humidity.png";
  import microchipIcon from "./assets/microchip.png";
  import { fetchDatabaseData, filterByTable } from "./utils/influxdb";
  import Chart from "./lib/Chart.svelte";
  import Reading from "./lib/Readings.svelte";

  let sensorData = {};
  let latest = {
    temp: "Loading...",
    hum: "Loading...",
  };
  $: selected = "temp";
  const LABELS = {
    temp: "Temperature",
    hum: "Humidity",
  };

  const getLatestData = (key, dataObj) => {
    console.log(dataObj[key]);
    if (!dataObj.hasOwnProperty(key)) return { value: "No data - unknown key" };

    const length = dataObj[key]?.data?.length;

    if (!length) return { value: "No data - empty array" };

    return dataObj[key]?.data[length - 1];
  };

  const parseDate = (time, hoursOnly = false) => {
    const transformToTwoDigits = (strNum) => {
      return +strNum < 10 ? "0" + strNum : strNum;
    };

    const dateObj = new Date(time);
    const date = transformToTwoDigits(dateObj.getDate());
    const month = transformToTwoDigits(+dateObj.getMonth() + 1);
    const year = dateObj.getFullYear();
    const hours = transformToTwoDigits(dateObj.getHours());
    const mins = transformToTwoDigits(dateObj.getMinutes());
    const seconds = transformToTwoDigits(dateObj.getSeconds());

    if (hoursOnly) return `${hours}:${mins}:${seconds}`;

    return `${date}.${month}.${year} ${hours}:${mins}:${seconds}`;
  };

  onMount(async () => {
    try {
      const res = await fetchDatabaseData();
      const tables = filterByTable(res);
      console.log(res);
      console.log(tables);
      sensorData = tables;
      const t = getLatestData("temp", tables);
      const h = getLatestData("hum", tables);
      latest = {
        temp: t?.value,
        hum: h?.value,
        time: parseDate(t?.time),
      };
    } catch (e) {
      console.log("-->", e);
    }
  });
</script>

<main>
  <div class="readings-container" style="text-align:left" id="chip">
    <img src={microchipIcon} class="logo" alt="" />
    <div>
      <h1 class="title" style="display:inline">DHT11 Sensor</h1>
      <p class="subtitle">Tehnyt Janne Mulari TTV18SA</p>
    </div>
  </div>

  <div>
    <p>Latest readings from <br /> {latest.time}</p>
    <div class="readings-container box">
      <Reading
        on:click={() => (selected = "temp")}
        value={latest.temp}
        icon={temperatureIcon}
        title="Lämpötila"
        alt="Temperature"
      />
      <Reading
        on:click={() => (selected = "hum")}
        value={latest.hum}
        icon={humidityIcon}
        style="margin-left:2rem"
        title="Ilmankosteus"
        alt="Humidity"
      />
    </div>
  </div>
  {#if sensorData?.[selected]?.data}
    <Chart
      chartLabels={sensorData[selected].data.map((x) =>
        parseDate(x.time, true)
      )}
      chartValues={sensorData[selected].data.map((x) => x.value)}
      labelTitle={LABELS[selected]}
      {selected}
    />
  {/if}
</main>

<style>
  @keyframes flash {
    0% {
      background-color: #fed943;
    }
    20% {
      background-color: #ffe88b;
    }
    25% {
      background-color: #e2c13c;
    }
    50% {
      background-color: #ffe88b;
    }
    75% {
      background-color: #fcf1c6;
    }
    100% {
      background-color: #fed943;
    }
  }

  #chip {
    position: relative;
  }
  #chip::after,
  #chip::before {
    content: "";
    position: absolute;
    left: 62px;
    top: 95%;
    height: 150px;
    width: 6px;
    background-color: #fed943;
    filter: drop-shadow(0 0 0.2em #ffe57d7a);
    animation-duration: 200ms;
    animation-name: flash;
    animation-iteration-count: infinite;
  }
  #chip::before {
    left: 77px;
    animation-duration: 500ms;
    animation-delay: 50ms;
  }
  .logo {
    height: 5em;
    padding: 0 1.5em;
    will-change: filter;
  }
  .readings-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
  }
  .title {
    margin: 0;
    line-height: 0.9;
  }
  .subtitle {
    font-size: 1em;
    color: #fed943;
    font-family: "Roboto", sans-serif;
    /* font-style: italic; */
    margin: 0;
  }
  .box {
    background-color: #29cccc;
    border: 3px solid #fed943;
    color: #2e2e2e;
    padding: 0.3rem 0.7rem;
    border-radius: 3em;
    transition: transform 200ms ease-in-out;
    filter: drop-shadow(0 0 1em #249bb39c);
  }
  .box:hover {
    transform: scale(1.03);
  }
</style>
