export default {
  methods: {
    handleSortChange({ column, prop, order }) {
      this.listQuery.sortBy = `${prop}:${order}`
      this.getList()
    }
  }
}
