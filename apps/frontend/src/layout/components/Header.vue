<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";

import BaseSelect from "@/components/BaseSelect.vue";
import { listDorms } from "@/api/dorm";
import { useDormStore } from "@/store/useDormStore";
import type { SelectOption } from "@ebap/shared";
import { showWarning } from "@/utils/showMessage";

const route = useRoute();
const dormStore = useDormStore();

const dormOptions = ref<SelectOption[]>([]);
const typeOptions: SelectOption[] = [
  { label: "照明", value: 1 },
  { label: "空调", value: 2 },
];

const currentTitle = computed(() => route.meta.title || "EBAP 管理后台");
const showDormSelector = computed(() => !route.meta.hideDormSelector);

const loadDorms = async () => {
  try {
    const res = await listDorms();
    dormOptions.value = res.data.map((item) => ({
      label: item.dormNo,
      value: item.id,
    }));

    const firstDorm = dormOptions.value[0];
    if (!dormStore.selectedDormId && firstDorm) {
      dormStore.setDormId(firstDorm.value);
    }
  } catch {
    dormOptions.value = [];
    showWarning("宿舍列表加载失败，请确认后端接口是否可用");
  }
};

onMounted(() => {
  void loadDorms();
});
</script>

<template>
  <header class="header-bar app-panel">
    <h1 class="header-title">{{ currentTitle }}</h1>

    <div v-if="showDormSelector" class="selector-shell">
      <BaseSelect
        v-model="dormStore.selectedDormId"
        :options="dormOptions"
        placeholder="选择宿舍"
        width="190px"
      />
      <BaseSelect
        v-model="dormStore.selectedType"
        :options="typeOptions"
        placeholder="选择类型"
        width="150px"
      />
    </div>
  </header>
</template>

<style scoped>
.header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 20px 24px;
}

.header-title {
  margin: 0;
  color: var(--accent-deep);
  font-size: 28px;
  font-weight: 700;
}

.selector-shell {
  display: flex;
  align-items: center;
  gap: 12px;
}

@media (max-width: 960px) {
  .header-bar {
    padding: 16px;
    flex-direction: column;
    align-items: stretch;
  }

  .selector-shell {
    flex-wrap: wrap;
  }
}
</style>
