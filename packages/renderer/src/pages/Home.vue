<template>
  <a-layout>
    <a-layout-header class="header">Electron Mailer 2 v{{ version }}</a-layout-header>
    <a-layout-content>
      <a-layout>
        <a-layout-sider style="background-color: #fff">
          <div class="sider">
            <a-menu
              mode="inline"
              theme="light"
              v-model:selectedKeys="selectedKeys"
              @select="selectHandler"
            >
              <a-menu-item key="/">
                <template #icon>
                  <PieChartOutlined/>
                </template>
                <span>用户手册</span>
              </a-menu-item>
              <a-menu-item key="/setting">
                <template #icon>
                  <DesktopOutlined/>
                </template>
                <span>设置</span>
              </a-menu-item>
              <a-menu-item key="/template">
                <template #icon>
                  <InboxOutlined/>
                </template>
                <span>模板管理</span>
              </a-menu-item>
              <a-menu-item key="/send">
                <template #icon>
                  <PieChartOutlined/>
                </template>
                <span>发送邮件</span>
              </a-menu-item>
              <a-menu-item key="/task">
                <template #icon>
                  <DesktopOutlined/>
                </template>
                <span>任务管理</span>
              </a-menu-item>
            </a-menu>
          </div>
        </a-layout-sider>
        <a-layout-content>
          <a-layout>
            <a-layout-content>
              <a-page-header
                style="border: 1px solid rgb(235, 237, 240); background-color: #fff;"
                :title="title"
              />
              <div class="content">
                <router-view></router-view>
              </div>
            </a-layout-content>
            <a-layout-footer class="footer">
              <span>作者: Shampoo6</span>
              <span>联系方式: shampoo6@163.com QQ: 454714691</span>
            </a-layout-footer>
          </a-layout>
        </a-layout-content>
      </a-layout>
    </a-layout-content>
  </a-layout>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs} from 'vue';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
  MailOutlined,
  DesktopOutlined,
  InboxOutlined,
  AppstoreOutlined,
} from '@ant-design/icons-vue';
import event from '/@/utils/event';

export default defineComponent({
  setup() {
    const state = reactive({
      title: '模块管理',
      collapsed: false,
      selectedKeys: ['/help']
    });

    event.sign('afterRouteEnter', title => {
      state.title = title;
    });

    return {
      ...toRefs(state),
      version: window.projectVersion
    };
  },
  components: {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    PieChartOutlined,
    MailOutlined,
    DesktopOutlined,
    InboxOutlined,
    AppstoreOutlined,
  },
  created() {
    let result = this.$route.path.match(/^\/[^\/]*(?=\/?)/);
    this.selectedKeys[0] = result ? result[0] : '';
    this.title = this.$route.meta.title as string;
  },
  methods: {
    selectHandler(ev: any) {
      this.$router.replace(ev.selectedKeys[0]);
    }
  },
});
</script>

<style lang="scss" scoped>
.sider {
  height: calc(100vh - 64px);
}

.content {
  height: calc(100vh - 64px - 70px - 74px);
  overflow: auto;
}

.header {
  color: #fff;
  font-size: 32px;
  font-weight: bolder;
}

.footer {
  background-color: #ccc;
  color: #fff;
  display: flex;
  justify-content: space-between;
}
</style>
