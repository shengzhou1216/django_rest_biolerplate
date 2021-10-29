<template>
  <div class="dashboard-container">
    <div class="dashboard-text">Welcome {{ name }}</div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Dashboard",
  computed: {
    ...mapGetters(["name"])
  },
  methods: {
    goTo(p) {
      this.$router.push({ path: p });
    }
  }
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.entries {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .entry {
    margin: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 1px solid transparent;
    padding: 10px;
    border-radius: 5px;
    font-size: 50px;
    .icon {
      font-size: 180px;
      margin-bottom: 10px;
    }
    &:hover {
      cursor: pointer;
      box-shadow: 2px 2px 5px #cccccc;
      border: 1px solid #409eff;
    }
  }
}
</style>
