/**
 * * JSON序列化，支持 function 和 symbol
 * @param data
 */
export const JSONStringify = <T>(data: T) => {
  return JSON.stringify(
    data,
    (_, v) => {
      // 处理 function 丢失问题
      if (typeof v === 'function') return String(v)
      // 处理 symbol 丢失问题
      if (typeof v === 'symbol') return String(v)
      return v
    },
    2,
  )
}

/**
 * * JSON反序列化，支持 function 和 symbol
 * @param data
 */
export const JSONParse = (data: string) => {
  const _eval = eval
  return JSON.parse(data, (_, v) => {
    // 还原 function 值
    if (typeof v === 'string' && (v.includes('function') || v.includes('=>'))) {
      return _eval(`(function(){return ${v}})()`)
    }
    else if (typeof v === 'string' && v.indexOf && v.includes('return ')) {
      const baseLeftIndex = v.indexOf('(')
      if (baseLeftIndex > -1) {
        const newFn = `function ${v.substring(baseLeftIndex)}`
        return _eval(`(function(){return ${newFn}})()`)
      }
    }
    // 还原 symbol 值
    else if (typeof v === 'string' && v.includes('Symbol')) {
      return _eval(v)
    }
    return v
  })
}
