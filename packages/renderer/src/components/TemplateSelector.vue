<template>
  <a-select @change="onSelectChange" style="width: 200px;" v-model:value="selectedId"
            placeholder="Please select a template">
    <a-select-option value="" disabled>请选择模板</a-select-option>
    <a-select-option v-for="row in templateList" :key="row.id" :value="row.id">{{ row.name }}
    </a-select-option>
  </a-select>
</template>

<script lang="ts" setup>
import {onMounted, reactive, ref} from "vue";
import templateApi from "/@/api/template";

const props = defineProps({
  selectedId: String,
  templates: {
    type: Object,
    default: () => ({})
  },
  templateList: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['update:selectedId', 'update:templates', 'update:templateList', 'change']);

// 当前选择的模板id
const selectedId = ref(props.value);
// 模板选项
const templateList = ref(reactive([]));
// 模板表数据
const templates = ref(reactive(props.templates));

const onSelectChange = () => {
  emit('update:selectedId', selectedId.value);
  emit('change', selectedId.value);
};

const fetch = () => {
  templates.value = reactive(templateApi.list());
  let data: any = templates.value;
  let rowData = [];
  for (const key in data) {
    if (key === 'defaultTemplateId') continue;
    rowData.push(data[key]);
  }
  templateList.value = rowData;
  selectedId.value = data.defaultTemplateId ? data.defaultTemplateId : '';

  emit('update:templates', templates.value);
  emit('update:templateList', templateList.value);
  emit('update:selectedId', selectedId.value);
};

onMounted(() => {
  fetch();
});

defineExpose({
  fetch
});
</script>

<style scoped>

</style>
