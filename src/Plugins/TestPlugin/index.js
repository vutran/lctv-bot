'use strict'

import TestPlugin from './src'

export default function() {

  const plugin = new TestPlugin({
    foo: 'Hello',
    bar: 'World!'
  })

  plugin.print()

}
