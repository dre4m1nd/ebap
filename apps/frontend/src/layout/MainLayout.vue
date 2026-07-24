<script setup lang="ts">
import HeaderBar from "@/layout/components/Header.vue";
import SideBar from "@/layout/components/SideBar.vue";
</script>

<template>
  <div class="layout-shell">
    <aside class="layout-aside">
      <SideBar />
    </aside>
    <section class="layout-main">
      <HeaderBar />
      <main class="layout-content">
        <div class="content-inner">
          <router-view />
        </div>
      </main>
    </section>
  </div>
</template>

<style scoped>
.layout-shell {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  gap: 18px;
  padding: 18px;
}

.layout-aside {
  min-height: calc(100vh - 36px);
}

.layout-main {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.layout-content {
  flex: 1;
  min-height: 0;
}

.content-inner {
  width: 100%;
  max-width: 1480px;
}

@media (max-width: 1100px) {
  .layout-shell {
    grid-template-columns: 1fr;
  }

  .layout-aside {
    min-height: auto;
  }
}

@media (max-width: 720px) {
  .layout-shell {
    padding: 12px;
    gap: 12px;
  }
}
</style>
