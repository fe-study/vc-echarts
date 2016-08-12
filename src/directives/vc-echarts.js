import echarts from 'echarts'

export default function (Vue, options) {

    Vue.directive('vc-echarts', {
        deep: true,
        params: ['loading', 'events', 'ns'],
        paramWatchers: {
            loading (val, oldVal) {
                if (val === true) {
                    this.echart.showLoading()
                } else {
                    this.echart.hideLoading()
                }
            }
        },
        bind () {
            Vue.nextTick(() => {

                this.echart = echarts.init(this.el)

                if (this.params.loading === true) {
                    this.echart.showLoading()
                }

                let ns = this.params.ns || 'vc'
                this.chartEventHandler = (type, params) => this.vm.$emit(`${ns}.${type}`, params)

                if (this.params.events && this.params.events.length > 0) {
                    this._events = Object.assign([], this.params.events)
                    this._events.forEach(type => this.echart.on(type, (params) => this.chartEventHandler(type, params)))
                }

                let resizeEvent = new Event('resize')

                this.resizeEventHandler = () => this.echart.resize()

                this.el.addEventListener('resize', this.resizeEventHandler, false)

                window.onresize = () => this.el.dispatchEvent(resizeEvent)
            })
        },
        update (newOptions, oldOptions) {

            Vue.nextTick(() => this.echart.setOption(newOptions))
        },
        unbind () {
            this._events.forEach(type => this.echart.off(type))
            this.echart.dispose()
            this.el.removeEventListener('resize', this.resizeEventHandler, false)
        }
    })
}
