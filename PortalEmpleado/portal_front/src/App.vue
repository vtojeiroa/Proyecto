<template>
  <div id="app">
    <transition name="fade">
      <router-view />
    </transition>
  </div>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700;900&display=swap");

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  height: 100%;
  display: flex;
  flex-direction: column;
}
#app {
  font-family: "Roboto", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: #dae1e7;
  min-height: 100vh;
  position: relative;
  /*  min-width: 375px; */
}
.fade-enter-active,
.fade-leave-active {
  transition-property: opacity;
  transition-duration: 0.25s;
}

.fade-enter-active {
  transition-delay: 0.25s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
main {
  padding-bottom: 81px;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.modalBox {
  background: #dae1e7;
  color: #142850;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
}
.modalBox h1 {
  font-size: 2rem;
  text-align: center;
}

.modalBox h2 {
  color: #333;
  text-transform: uppercase;
  text-align: center;
  padding: 0.5rem;
}
.modalBox h3 {
  color: #333;

  text-align: center;
  padding: 0.5rem;
}
.modalBox td {
  padding: 0.25rem;
}
.modalBox label,
.modalBox article fieldset form ul li label {
  font-size: 18px;
  font-weight: 700;
  color: #555;
}
.modalBox select,
.modalBox input,
.modalBox article fieldset form ul li select,
.modalBox article fieldset form ul li input {
  background: rgba(255, 255, 255, 0.5);
  font-size: 16px;
  font-weight: 500;
  border: 1px solid #d4d4d4;
  padding: 5px 10px;
  transition: all 0.2s ease 0s;
  width: 250px;
}

.modalBox div.buttons,
.modalBox div.button-data,
.modalBox div.buttonPassword {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;

  text-align: center;
  min-width: 120px;
}
.modalBox div.buttons input,
.modalBox div.button-data input,
.modalBox div.buttonPassword input,
.modalBox div.button-data input.button-go,
.modalBox div.buttonPassword input.button-go {
  background: #142850;
  color: #dae1e7;
  font-size: 0.75rem;
  font-weight: 900;
  padding: 0.75rem;
  line-height: 15px;
  border-radius: 50px;
  cursor: pointer;
  width: 100px;
  border: none;
  border: 2px solid #142850;
}
.modalBox div.buttons input.search:hover,
.modalBox div.buttons input:hover,
.modalBox div.button-data input.button-go:hover {
  background: #dae1e7;
  color: #142850;
  border: 2px solid #142850;
}
.modalBox div.buttons input.back,
.modalBox div.button-data input.back,
.modalBox div.buttons input.button-back,
.modalBox div.button-data input.button-back {
  background: #dae1e7;
  color: #142850;
  border: 2px solid #142850;
}
.modalBox div.buttons input.back:hover,
.modalBox div.button-data input.back:hover,
.modalBox div.buttons input.button-back:hover,
.modalBox div.button-data input.button-back:hover {
  background: #142850;
  color: #dae1e7;
}

div.buttons,
div.button-data,
div.buttonPassword {
  display: flex;
  justify-content: space-evenly;
  padding: 1rem;
  /*  flex-grow: 1; */
}
div.buttons a.button-go,
div.buttons input,
div.buttons input.button-go,
input.button-go {
  background: #142850;
  color: #dae1e7;
  font-size: 0.75rem;
  font-weight: 900;
  padding: 0.75rem;
  line-height: 15px;
  border-radius: 50px;
  cursor: pointer;
  width: 100px;
  border: none;
  border: 2px solid #142850;
  text-transform: uppercase;
}
div.buttons input.search:hover,
div.buttons input.button-go:hover,
div.buttons a.button-go:hover,
input.button-go:hover {
  background: #dae1e7;
  color: #142850;
  border: 2px solid #142850;
}
div.buttons input.button-back,
input.button-back {
  background: #dae1e7;
  color: #142850;
  border: 2px solid #142850;
  text-transform: uppercase;
}
div.buttons input.button-back:hover {
  background: #142850;
  color: #dae1e7;
}

ul {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: space-evenly;
}

ul li label {
  font-size: 18px;
  font-weight: 700;
  color: #555;
}
ul li select,
ul li input {
  background: rgba(255, 255, 255, 0.5);
  font-size: 16px;
  font-weight: 500;
  border: 1px solid #d4d4d4;
  padding: 5px 10px;
  transition: all 0.2s ease 0s;
  width: 250px;
}

p {
  color: #333;
  font-weight: bolder;
  padding: 0.3rem;
}
</style>
