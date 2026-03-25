<template>
  <a-table
    :columns="columns"
    :row-key="record => record.login.uuid"
    :data-source="dataSource"
    :pagination="pagination"
    :loading="loading"
    @change="handleTableChange"
  >
    <template #bodyCell="{ column, text }">
      <template v-if="column.dataIndex === 'name'">{{ text.first }} {{ text.last }}</template>
    </template>
  </a-table>
</template>
<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import type { TableProps } from 'ant-design-vue';

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    sorter: true,
    width: '20%',
  },
  {
    title: 'Gender',
    dataIndex: 'gender',
    filters: [
      { text: 'Male', value: 'male' },
      { text: 'Female', value: 'female' },
    ],
    width: '20%',
  },
  {
    title: 'Email',
    dataIndex: 'email',
  },
];

type APIParams = {
  results: number;
  page?: number;
  sortField?: string;
  sortOrder?: number;
  [key: string]: any;
};

const dataSource = ref([]);
const loading = ref(false);
const current = ref(1);
const pageSize = ref(10);

const fetchData = async (params: APIParams) => {
  loading.value = true;
  try {
    const query = new URLSearchParams(
      Object.entries(params).reduce((acc, [k, v]) => {
        if (v !== undefined) acc[k] = String(v);
        return acc;
      }, {} as Record<string, string>),
    );
    const res = await fetch(`https://randomuser.me/api?noinfo&${query}`);
    const json = await res.json();
    dataSource.value = json.results;
  } finally {
    loading.value = false;
  }
};

const pagination = computed(() => ({
  total: 200,
  current: current.value,
  pageSize: pageSize.value,
}));

const handleTableChange: TableProps['onChange'] = (
  pag: { pageSize: number; current: number },
  filters: any,
  sorter: any,
) => {
  current.value = pag.current;
  pageSize.value = pag.pageSize;
  fetchData({
    results: pag.pageSize,
    page: pag.current,
    sortField: sorter.field,
    sortOrder: sorter.order,
    ...filters,
  });
};

onMounted(() => {
  fetchData({ results: pageSize.value, page: current.value });
});
</script>
