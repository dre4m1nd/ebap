import { defineStore } from "pinia";
import { ref } from "vue";

export const useDormStore = defineStore("dorm", () => {
  const selectedDormId = ref<number>();
  const selectedType = ref<number>(1);

  const setDormId = (id?: number) => {
    selectedDormId.value = id;
  };

  const setType = (type: number) => {
    selectedType.value = type;
  };

  return {
    selectedDormId,
    selectedType,
    setDormId,
    setType,
  };
});
