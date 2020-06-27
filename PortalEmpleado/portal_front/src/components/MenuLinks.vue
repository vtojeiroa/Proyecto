<template>
  <div>
    <section class="links">
      <article class="links">
        <ul class="links">
          <li>
            <router-link :to="{ name: 'UserProfile' }">Mis datos</router-link>
          </li>
          <li>
            <router-link :to="{ name: 'MyReserves' }">Mis reservas</router-link>
          </li>

          <li>
            <router-link :to="{ name: 'MyIncidences' }">Mis incidencias</router-link>
          </li>
        </ul>
      </article>
    </section>
  </div>
</template>

<script>
export default {
  name: "MenuLinks",
  data() {
    return {};
  },
  methods: {}
};
</script>

<style scoped>
ul {
  display: block;
  color: #8b8b8b;
  font-size: 13px;
}
li {
  background: #0055a5;
  border-radius: 3px;
  box-shadow: 0 1px 5px -1px #333333;
  height: 45px;
  list-style: none;
  padding: 0 3px;
  margin: 0;
  font-weight: bold;
  display: inline-block;
  text-align: center;
  height: 100%;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  box-sizing: border-box;
  border: none;
  border-bottom: 5px solid #999;
  color: #999;
  font-size: 16px;
  text-transform: uppercase;
  transition: all 0.3s ease 0s;
  width: inherit;
  padding: 0 30px;
}
a {
  color: #dae1e7;
  text-decoration: none;
}
</style>