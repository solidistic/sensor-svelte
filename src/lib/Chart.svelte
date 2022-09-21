<script>
  import { Chart } from "chart.js";
  import { onMount, afterUpdate } from "svelte";

  export let chartValues = [20, 10, 5, 2, 20, 30, 45];
  export let chartLabels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
  ];
  export let labelTitle = "";
  export let selected = "temp";
  let ctx;
  let chartCanvas;
  let chart;
  const colors = {
    "temp": { bg: "#d35d5db8", border: "#d35d5d" },
    "hum": { bg: "#2ba5ffb8", border: "#2ba5ff" },
  }

  afterUpdate(() => {
    chart.data.datasets[0].data = chartValues;
    chart.data.datasets[0].label = labelTitle;
    chart.data.datasets[0].backgroundColor = colors[selected].bg;
    chart.data.datasets[0].borderColor = colors[selected].border;
    chart.data.labels = chartLabels;

    chart.update();
  });

  onMount(async (promise) => {
    ctx = chartCanvas.getContext("2d");
    chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: chartLabels,
        datasets: [
          {
            label: labelTitle,
            backgroundColor: "#f28875b8",
            borderColor: "#f28875",
            data: chartValues,
          },
        ],
      },
      options: {

      }
    });
  });
</script>

<canvas bind:this={chartCanvas} id="chart" />
