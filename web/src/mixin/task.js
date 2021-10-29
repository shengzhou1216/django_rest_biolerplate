
const STATUS = {
  FINISHED: 0,
  PROCESSING: 1,
  ERROR: 2
}

const PROCESS_STATUS = {
  NOT_STARTED: {
    status: 0,
    message: '未开始',
    type: 'info'
  },
  PROCESSING: {
    status: 1,
    message: '处理中',
    type: 'primary'
  },
  ERROR: {
    status: 2,
    message: '失败',
    type: 'danger'

  },
  SUCCESS: {
    status: 3,
    message: '成功',
    type: 'success'
  },
  ALREADY_FINISHED: {
    status: 4,
    message: '结束',
    type: ''
  }
}
import { filterEmptyKVPairs } from '@/utils'

export default {
  filters: {
    statusFilter(v) {
      for (const k in PROCESS_STATUS) {
        if (PROCESS_STATUS[k].status === v) {
          return PROCESS_STATUS[k].message
        }
      }
      return '未知状态'
    }
  },
  data() {
    return {
      PROCESS_STATUS,
      STATUS,
      // 实时日志： id: logs
      realtimeLog: {},
      total: 0,
      list: [],
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        sortBy: 'createdAt:desc',
        name: undefined
      },
      // 获取最新的训练日志中
      getLatestLoging: false,
      // 最新训练日志
      latestLog: {},
      // 最新的训练日志 drawer
      latestLogDrawerVisible: false,
      // 当前选中的训练
      activeRecord: {},
      activeIndex: undefined,
      activeTabName: 'realtimeLog',
      specDrawerVisible: false
    }
  },
  methods: {
    getList() {
      this.listLoading = true
      const query = filterEmptyKVPairs(Object.assign({}, this.listQuery))
      this.fetchList(query).then(response => {
        this.list = response.data.list
        this.total = response.data.total
      }).finally(() => {
        this.listLoading = false
      })
    },
    handleViewSpec(row) {
      this.activeRecord = Object.assign({}, row)
      this.specDrawerVisible = true
    },
    // 处理消息
    handleInMessage(res) {
      console.log(res)
      const { status, success, data: { id }, phase } = res
      let { message } = res
      const targetIndex = this.list.findIndex((e) => e.id === id)
      const record = Object.assign({}, this.list[targetIndex])
      record.status = {
        phase,
        status,
        message: record.status && record.status.message ? record.status.message : ''
      }
      message = message.trim()
      if (message && message.length) {
        record.status.message = message
      }
      this.handleAddRealtimeLog(id, message)
      if (status === this.PROCESS_STATUS.ERROR.status) {
        this.$confirm(message, '错误', {
          showConfirmButton: false,
          cancelButtonText: '关闭',
          type: 'error'
        })
      } else if (status === this.PROCESS_STATUS.SUCCESS.status) {
        if (success) {
          if (message) {
            this.$notify.success({ title: '任务执行完成了！', message, duration: 0 })
          }
          this.getList()
        } else {
          this.$confirm(message, '提示', {
            showConfirmButton: false,
            cancelButtonText: '关闭',
            type: 'warning'
          })
        }
      }
      if (targetIndex >= 0) {
        this.updateActiveRecord(targetIndex, record)
      }
    },
    // 添加实时日志
    handleAddRealtimeLog(id, log) {
      if (!this.realtimeLog[id] || !this.realtimeLog[id].length) {
        this.$set(this.realtimeLog, id, [])
      }
      this.realtimeLog[id].push(log)
    },
    updateActiveRecord(index, record) {
      this.$set(this.list, index, record)
    },
    isProcessing(status) {
      return status === this.PROCESS_STATUS.PROCESSING.status
    },
    getStatusType(status) {
      for (const k in PROCESS_STATUS) {
        if (PROCESS_STATUS[k].status === status) {
          return PROCESS_STATUS[k].type
        }
      }
    },
    // 是否推理成功
    isSuccess(status) {
      return status === PROCESS_STATUS.SUCCESS.status
    },
    // 是否未开始
    isNotStarted(status) {
      return status === PROCESS_STATUS.NOT_STARTED.status
    },
    isError(status) {
      return status === PROCESS_STATUS.ERROR.status
    },
    handleViewLog(row) {
      this.activeRecord = row
      this.latestLogDrawerVisible = true
      this.getLatestLoging = true
      this.getLatestLog(row.id).then(res => {
        this.latestLog = res.data
      }).finally(() => {
        this.getLatestLoging = false
      })
    }
  }
}
