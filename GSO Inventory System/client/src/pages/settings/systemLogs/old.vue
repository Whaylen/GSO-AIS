<template>
  <div class="full-height d-flex flex-column">
    <MDBCard class="rounder mb-3 overflow-hidden">
      <MDBCardBody class="p-1">
        <div class="border-bottom mb-2">
          <MDBRow>
            <MDBCol md="4">
              <div class="fit d-flex justify-content-center align-items-center">
                <div class="d-flex align-items-end rounder border">
                  <span class="h1 m-0 ps-2"> LOGS 2.0 </span>
                  <span class="small fst-italic fw-bold text-uppercase pe-2">
                    Beta
                  </span>
                </div>
              </div>
            </MDBCol>
            <MDBCol md="8">
              <div class="d-flex justify-content-center flex-wrap p-2">
                <template v-for="(level, index) in headerLevels" :key="level">
                  <div class="full-width p-2" style="max-width: 256px">
                    <MDBCard
                      class="fit non-selectable overflow-hidden"
                      :class="[
                        summary[index].total > 0 &&
                          day > 0 &&
                          index > 0 &&
                          !loading &&
                          'cursor-pointer',
                        summary[index].total <= 0 &&
                          index > 0 &&
                          day > 0 &&
                          'cursor-not-allowed',
                      ]"
                      :style="{
                        'background-color':
                          summary[index].total > 0 && isFilterSelected(index)
                            ? level.bg
                            : '#D3D3D3',
                        color: level.color,
                        border:
                          summary[index].total > 0 && !isFilterSelected(index)
                            ? `solid 2px ${level.bg}`
                            : `solid 2px #D3D3D3`,
                      }"
                      @click="
                        summary[index].total > 0 && day > 0 && index > 0
                          ? addFilter(index)
                          : null
                      "
                    >
                      <MDBCardBody class="d-flex p-0">
                        <div
                          class="d-flex align-items-center justify-content-center bg-dark bg-opacity-25 p-2"
                          style="width: 60px; height: 60px"
                        >
                          <MDBIcon :icon="level.icon" size="2x" />
                        </div>
                        <div class="flex-fill small py-2">
                          <div class="px-2">{{ level.label }}</div>
                          <div
                            class="px-2 text-white text-opacity-75"
                            style="font-size: 0.75rem"
                          >
                            {{
                              `${summary[index].total} Entries - ${summary[index].prct}%`
                            }}
                          </div>
                          <MDBProgress
                            :height="2"
                            class="bg-dark bg-opacity-25"
                          >
                            <MDBProgressBar
                              :value="summary[index].prct"
                              bg="white"
                            />
                          </MDBProgress>
                        </div>
                      </MDBCardBody>
                    </MDBCard>
                  </div>
                </template>
              </div>
            </MDBCol>
          </MDBRow>
        </div>
        <div class="px-2">
          <Select v-model="year" :options="years" />
        </div>
      </MDBCardBody>
    </MDBCard>
    <MDBCard class="rounder flex-fill overflow-hidden">
      <MDBCardHeader class="d-flex" :class="[!$grid.md && 'flex-column']">
        <div v-if="month > 0 || day > 0" class="border-end pe-1">
          <MDBBtn size="sm" class="shadow-0" @click="back">
            <MDBIcon icon="caret-left" />
            Back
          </MDBBtn>
        </div>
        <MDBCardTitle class="flex-fill fw-bold m-0 px-1">
          Log [
          {{
            month <= 0
              ? year
              : day <= 0
              ? $dayjs(`${year}-${month}`).format("MMMM YYYY")
              : $dayjs(`${year}-${month}-${day}`).format("MMMM DD, YYYY")
          }}
          ]
        </MDBCardTitle>
      </MDBCardHeader>
      <MDBCardBody class="overflow-auto p-0">
        <MDBTable v-if="day <= 0" sm class="w-100 m-0">
          <thead>
            <tr class="fw-bold small text-center">
              <td class="border-end px-1 py-2">
                {{ month <= 0 ? "Month" : "Date" }}
              </td>
              <template
                v-for="level in headerLevels"
                :key="`log_header_${level.label}`"
              >
                <td class="px-1 py-2">
                  <div
                    class="rounder px-1"
                    :style="{
                      'background-color': level.bg,
                      color: level.color,
                    }"
                  >
                    <MDBIcon :icon="level.icon" class="pe-1" />{{ level.label }}
                  </div>
                </td>
              </template>
              <td class="border-start px-1 py-2">Actions</td>
            </tr>
          </thead>
          <tbody>
            <template v-if="!loading && logs.length <= 0">
              <tr>
                <td
                  colspan="100%"
                  class="fw-bold h4 fst-italic m-0 text-center text-dark text-opacity-50"
                >
                  No Logs
                </td>
              </tr>
            </template>
            <template v-for="(log, index) in logs" :key="`YLogs_${index}`">
              <tr class="small text-center" style="height: 1px">
                <td class="border-end fw-bold p-2">
                  {{ $dayjs(index).format(month <= 0 ? "MMMM" : "YYYY-MM-DD") }}
                </td>
                <td class="p-2">
                  <span
                    class="rounder px-1"
                    :style="{
                      'background-color': '#8A8A8A',
                      color: 'white',
                    }"
                  >
                    {{ sumLogs(log) }}
                  </span>
                </td>
                <template
                  v-for="(level, index) in levels"
                  :key="`log_level_${level.label}`"
                >
                  <td class="p-2">
                    <span
                      class="rounder px-2 py-1"
                      :style="{
                        'background-color': log[index + 1]
                          ? level.bg
                          : '#D3D3D3',
                        color: level.color,
                      }"
                    >
                      {{ log[index + 1] ?? 0 }}
                    </span>
                  </td>
                </template>
                <td class="border-start p-0" style="height: inherit">
                  <div
                    class="full-height d-flex justify-content-center align-items-center"
                  >
                    <a
                      v-if="month <= 0"
                      href="#"
                      @click.prevent="selectMonth(index)"
                    >
                      <MDBIcon icon="eye" />
                      View
                    </a>
                    <a v-else href="#" @click.prevent="selectDay(index)">
                      <MDBIcon icon="eye" />
                      View
                    </a>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </MDBTable>
        <MDBTable v-else sm class="w-100 m-0">
          <thead>
            <tr class="fw-bold small">
              <td style="min-width: 120px" class="px-2 py-1">Level</td>
              <td style="min-width: 120px" class="px-2 py-1">Time</td>
              <td class="px-2 py-1">Module</td>
              <td style="width: 100%" class="px-2 py-1">Header</td>
              <td class="px-2 py-1"></td>
            </tr>
          </thead>
          <tbody>
            <template v-if="!loading && dailyLogs.length <= 0">
              <tr>
                <td
                  colspan="100%"
                  class="fw-bold h4 fst-italic m-0 text-center text-dark text-opacity-50"
                >
                  No Logs
                </td>
              </tr>
            </template>
            <template v-for="(log, index) in dailyLogs" :key="index">
              <tr class="small">
                <td class="px-2 py-1">
                  <span
                    class="rounded px-2 py-1"
                    :style="{
                      'background-color': levels[log.level - 1].bg,
                      color: levels[log.level - 1].color,
                    }"
                  >
                    <MDBIcon :icon="levels[log.level - 1].icon" class="me-1" />
                    {{ levels[log.level - 1].label }}
                  </span>
                </td>
                <td class="px-2 py-1">
                  <span
                    class="rounded bg-dark bg-opacity-50 px-2 py-1 text-white"
                  >
                    {{ $dayjs(log.date).format("hh:mm:ss A") }}
                  </span>
                </td>
                <td class="px-2 py-1">
                  {{ log.module }}
                </td>
                <td class="px-2 py-1">
                  {{ log.action }}
                </td>
                <td class="px-2 py-1">
                  <div class="d-flex align-items-center justify-content-center">
                    <MDBBtn
                      size="sm"
                      floating
                      class="shadow-0"
                      :ripple="{ color: 'dark' }"
                      @click="log.expand = !log.expand"
                    >
                      <MDBIcon :icon="log.expand ? 'angle-up' : 'angle-down'" />
                    </MDBBtn>
                  </div>
                </td>
              </tr>
              <tr>
                <td colspan="100%" class="p-0">
                  <MDBCollapse v-model="log.expand">
                    <div class="bg-default border-start border-end p-2">
                      <div class="h6 border-bottom d-flex small m-0 mb-2 p-1">
                        <div class="flex-fill">
                          Module: <span class="fw-bold">{{ log.module }}</span>
                        </div>
                        <div>{{ log.actor }}</div>
                      </div>
                      <div v-show="log.new_data || log.old_data">
                        <MDBRow class="w-100">
                          <MDBCol md="6">
                            <div
                              v-if="log.new_data"
                              class="position-relative bg-white"
                            >
                              <JsonViewer
                                v-if="log.expand"
                                :value="log.new_data"
                                :expand-depth="1"
                                copyable
                              />
                              <label
                                class="position-absolute start-0 top-0 m-2"
                              >
                                New Data
                              </label>
                            </div>
                          </MDBCol>
                          <MDBCol md="6">
                            <div
                              v-if="log.old_data"
                              class="position-relative bg-white"
                            >
                              <JsonViewer
                                :value="log.old_data"
                                :expand-depth="1"
                                copyable
                              />
                              <label
                                class="position-absolute start-0 top-0 m-2"
                              >
                                Old Data
                              </label>
                            </div>
                          </MDBCol>
                        </MDBRow>
                      </div>
                    </div>
                  </MDBCollapse>
                </td>
              </tr>
            </template>
          </tbody>
        </MDBTable>
      </MDBCardBody>
      <MDBCardFooter :style="[day <= 0 && 'display: none !important']">
        <Pagination
          v-model="pagination.page"
          v-model:limit="pagination.limit"
          :total="pagination.total"
          @update:offset="
            (offset) => {
              pagination.offset = offset;
            }
          "
          @update:totalPage="
            (count) => {
              pagination.pages = count;
            }
          "
          @paginate="getLogs"
          direction-nav
          boundary-nav
          hideLimitSelect
          hidePageText
          size="sm"
        />
      </MDBCardFooter>
      <InnerLoading :active="loading" :text="loadingMessage" />
    </MDBCard>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "YearlyLogCount",
  props: {},
  emits: ["MonthSelect", "update:month", "update:day"],
  data() {
    return {
      loading: false,
      loadingMessage: "",
      year: parseInt(this.$dayjs().format("YYYY")),
      month: 0,
      day: 0,
      yearlyLogs: [],
      monthlyLogs: [],
      dailyLogs: [],
      levels: [
        {
          label: "Emergency",
          bg: "#B71C1C",
          color: "white",
          icon: "bug",
        },
        {
          label: "Alert",
          bg: "#D32F2F",
          color: "white",
          icon: "bullhorn",
        },
        {
          label: "Critical",
          bg: "#F44336",
          color: "white",
          icon: "heartbeat",
        },
        {
          label: "Error",
          bg: "#FF5722",
          color: "white",
          icon: "times-circle",
        },
        {
          label: "Warning",
          bg: "#FF9100",
          color: "white",
          icon: "exclamation-triangle",
        },
        {
          label: "Notice",
          bg: "#4CAF50",
          color: "white",
          icon: "exclamation-circle",
        },
        {
          label: "Info",
          bg: "#1976D2",
          color: "white",
          icon: "info-circle",
        },
        {
          label: "Debug",
          bg: "#90CAF9",
          color: "white",
          icon: "life-ring",
        },
      ],

      levelFilter: [1, 2, 3, 4, 5, 6, 7],
      summarized: [
        {
          total: 0,
          prct: 0,
        },
        {
          total: 0,
          prct: 0,
        },
        {
          total: 0,
          prct: 0,
        },
        {
          total: 0,
          prct: 0,
        },
        {
          total: 0,
          prct: 0,
        },
        {
          total: 0,
          prct: 0,
        },
        {
          total: 0,
          prct: 0,
        },
        {
          total: 0,
          prct: 0,
        },
        {
          total: 0,
          prct: 0,
        },
      ],

      pagination: {
        page: 1,
        pages: 1,
        total: 0,
        limit: 25,
        offset: 0,

        sort: "time",
        order: "DESC",
      },
    };
  },
  watch: {
    year: {
      immediate: true,
      handler() {
        this.day = 0;
        this.month = 0;
        this.monthlyLogs = [];
        this.dailyLogs = [];
        this.getLogs();
      },
    },
    month: {
      immediate: true,
      handler(value) {
        if (value <= 0) {
          this.monthlyLogs = [];
          this.dailyLogs = [];
        } else {
          this.getLogs();
        }
      },
    },
    day: {
      immediate: true,
      handler(value) {
        if (value <= 0) {
          this.pagination.page = 1;
          this.pagination.offset = 0;
          this.dailyLogs = [];
          this.levelFilter = [1, 2, 3, 4, 5, 6, 7];
        } else {
          this.getLogs();
        }
      },
    },
  },
  computed: {
    years() {
      let years = [];
      let start = 2010;
      let end = this.$dayjs().format("YYYY");
      for (let i = start; i <= end; i++) {
        years.push(i);
      }
      return years.reverse();
    },
    headerLevels() {
      return [
        {
          label: "All",
          bg: "#8A8A8A",
          color: "white",
          icon: "list",
        },
        ...this.levels,
      ];
    },
    logs() {
      if (this.month <= 0) {
        return this.yearlyLogs;
      } else {
        return this.monthlyLogs;
      }
    },
    summary() {
      if (this.day > 0) {
        return this.summarized;
      } else {
        let output = [...this.summarized];
        for (let element in this.logs) {
          for (let i = 0; i < this.levels.length; i++) {
            output[i + 1].total += parseInt(this.logs[element][i + 1] ?? 0);
            output[0].total += parseInt(this.logs[element][i + 1] ?? 0);
          }
        }
        for (let i = 0; i < output.length; i++) {
          output[i].prct =
            output[i].total > 0
              ? parseFloat(
                  ((output[i].total / output[0].total) * 100).toFixed(2)
                )
              : 0;
        }
        return output;
      }
    },
  },
  methods: {
    getLogs() {
      if (!this.loading) {
        this.loading = true;
        this.loadingMessage = "Loading logs...";
        let url = `/logsy/${this.year}/${this.month <= 0 ? "" : this.month}`;
        if (this.day > 0) {
          this.dailyLogs = [];
          let _levels = this.levelFilter
            .map((n, index) => `levels[]=${n}`)
            .join("&");
          url += "/" + this.day;
          url += _levels ? `?${_levels}&` : "";
          url += _levels ? "" : "?";
          url += `limit=${this.pagination.limit}&offset=${this.pagination.offset}&order=${this.pagination.order}&orderBy=${this.pagination.sort}`;
        }
        this.$api
          .get(url)
          .then((response) => {
            if (this.month <= 0) {
              this.yearlyLogs = response.data.data;
            } else {
              if (this.day <= 0) {
                this.monthlyLogs = response.data.data;
              } else {
                this.pagination.total = response.data.count;
                this.dailyLogs = response.data.data;
                this.summarized = response.data.summary;
              }
            }
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },
    sumLogs(log) {
      let ctr = 0;
      for (let i = 0; i < 8; i++) {
        ctr += log[i + 1] ?? 0;
      }
      return ctr;
    },

    selectMonth(month) {
      this.month = parseInt(this.$dayjs(month).format("MM"));
    },
    selectDay(date) {
      this.day = parseInt(this.$dayjs(date).format("DD"));
    },

    isFilterSelected(index) {
      return index > 0 ? this.levelFilter.indexOf(index) > -1 : true;
    },

    addFilter(index) {
      if (index > 0 && !this.loading) {
        this.pagination.page = 1;
        this.pagination.offset = 0;
        this.dailyLogs = [];
        let tmp = this.levelFilter.indexOf(index);
        if (tmp > -1) {
          this.levelFilter = this.levelFilter.filter((item) => item != index);
        } else {
          this.levelFilter.push(index);
        }
        this.getLogs();
      }
    },

    back() {
      if (this.day > 0) {
        this.day = 0;
        this.dailyLogs = [];
      } else if (this.month > 0) {
        this.month = 0;
        this.monthlyLogs = [];
      }
    },
  },
});
</script>
