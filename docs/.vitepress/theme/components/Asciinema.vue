<!--TODO: Refactor to pass any link from pages-->

<template>
    <div style="text-align: center;">
      <div id="asciicast-container"></div>
    </div>
  </template>
  
  <script setup>
  import { onMounted } from "vue";
  
  onMounted(() => {
    const script = document.createElement("script");
    script.id = "asciicast-lZfOEQuCKonM2htTJEz9QDWPo";
    script.src = "https://asciinema.org/a/lZfOEQuCKonM2htTJEz9QDWPo.js";
    script.async = true;
    document.getElementById("asciicast-container").appendChild(script);
  });
  </script>
  