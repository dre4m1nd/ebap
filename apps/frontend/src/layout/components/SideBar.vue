<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();

const menuRoutes = computed(() => {
  const layoutRoute = router.options.routes.find((item) => item.path === "/");
  return layoutRoute?.children?.filter((item) => !item.meta?.hidden) || [];
});
</script>

<template>
  <div class="sidebar-shell app-panel">
    <div class="brand-block">
      <div class="brand-badge">E</div>
      <div>
        <p class="brand-mark">EBAP</p>
        <h2 class="brand-title">宿舍电费管理</h2>
      </div>
    </div>

    <el-menu
      :default-active="route.path"
      :router="true"
      class="menu-panel"
      background-color="transparent"
      text-color="#ffffff"
      active-text-color="#ffffff"
    >
      <el-menu-item
        v-for="item in menuRoutes"
        :key="item.path"
        :index="`/${item.path}`"
        class="menu-item"
      >
        <span>{{ item.meta?.title || item.name }}</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<style scoped>
.sidebar-shell {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 24px 18px;
  background: linear-gradient(180deg, #71c9ce 0%, #5fbcc3 100%);
}

.brand-block {
  display: grid;
  grid-template-columns: 48px 1fr;
  gap: 14px;
  margin-bottom: 22px;
  padding: 18px;
  border-radius: 22px;
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.28), rgba(255, 255, 255, 0.08));
  color: #fff;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.brand-badge {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.22);
  font-size: 24px;
  font-weight: 700;
}

.brand-mark {
  margin: 2px 0 6px;
  font-size: 12px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #f4ffff;
}

.brand-title {
  margin: 0;
  font-size: 24px;
  line-height: 1.2;
}

.menu-panel {
  flex: 1;
  border-right: 0;
}

:deep(.menu-item) {
  margin-bottom: 8px;
  border-radius: 14px;
  height: 46px;
  font-weight: 600;
}

:deep(.menu-item:hover) {
  background: rgba(255, 255, 255, 0.16);
}

:deep(.menu-item.is-active) {
  background: rgba(255, 255, 255, 0.26);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.18);
}
</style>
