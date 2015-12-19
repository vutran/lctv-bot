'use strict'

let test_str = "!cmd arg1 arg2 arg-3 arg_4"

let cmds = new RegExp(/(^\![\w\d-]+)/).exec(test_str)

// strip leading "!"
let cmd = cmds[0].substr(1)
let cmdStart = cmds[0].length
let args = test_str.substr(cmdStart)

console.log(cmd)
console.log(args.trim().split(' '))
