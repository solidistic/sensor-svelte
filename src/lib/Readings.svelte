<script>
  export let title = "";
  export let icon = "";
  export let value = "";
  export let alt = "";
  export let style = "";
</script>

<div class="readings-container clickable" {title} {style} on:click>
  <img src={icon} class="icon" {alt} />
  <span class="reading">{value} &#176;C</span>
</div>

<style>
  .readings-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
  }
  .reading {
    font-size: 2em;
  }
  .icon {
    height: 3.3em;
  }
  .clickable {
    cursor: pointer;
  }
</style>
