<template>
  <div class="loader_wrapper">
    <div class="loader"/>
  </div>

</template>

<script>
// @ is an alias to /src

export default {
  name: 'Loader',
}
</script>

<style scoped>

.loader_wrapper {
  font-size: 500%;
  display: flex;
  justify-content: center;



}

.loader {

  width: 10vmin;
  height: 10vmin;

  border-radius: 100%;
  border-style: solid;
  border-width: 0.5vmin;
  border-color: transparent #444444 transparent #444444;

  animation-name: loader_rotation;
  animation-duration: 1s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}

@keyframes loader_rotation {
  0% {transform: rotate(0deg);}
  100% {transform: rotate(360deg);}

}
</style>
