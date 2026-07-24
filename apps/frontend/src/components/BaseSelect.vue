<script setup lang="ts">
import { computed } from "vue";

interface Option {
  label: string;
  value: number;
}

const props = withDefaults(
  defineProps<{
    modelValue?: number;
    options: Option[];
    placeholder?: string;
    clearable?: boolean;
    filterable?: boolean;
    disabled?: boolean;
    width?: string;
  }>(),
  {
    modelValue: undefined,
    placeholder: "请选择",
    clearable: true,
    filterable: true,
    disabled: false,
    width: "100%",
  },
);

const emit = defineEmits<{
  "update:modelValue": [value: number | undefined];
  change: [value: number | undefined];
}>();

const selectedValue = computed({
  get: () => props.modelValue,
  set: (value: number | undefined) => emit("update:modelValue", value),
});

const handleChange = (value: number | undefined) => {
  emit("change", value);
};
</script>

<template>
  <el-select
    v-model="selectedValue"
    :placeholder="placeholder"
    :clearable="clearable"
    :filterable="filterable"
    :disabled="disabled"
    :style="{ width }"
    @change="handleChange"
  >
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</template>
