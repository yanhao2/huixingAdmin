import moment from 'moment'

export function formatTs (ts, format = 'YYYY-MM-DD HH:mm:ss') {
  let retVal = ''
  if (ts) {
    let time = moment(ts)
    retVal = time.format(format)
    // debug && console.debug(`${ts} => ${retVal}(${time.format()})`)
  }
  return retVal
}
// 转为时间戳 X
export function formatNumber (ts) {
  let retVal = ''
  if (ts) {
    let time = moment(ts)
    retVal = time.format('X')
    // debug && console.debug(`${ts} => ${retVal}(${time.format()})`)
  }
  return retVal
}
