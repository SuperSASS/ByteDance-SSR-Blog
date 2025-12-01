#!/usr/bin/env node

/**
 * 自动结束占用指定端口的进程
 * 使用方法: node kill-port.js 3000
 */

import { exec } from 'child_process';

const port = process.argv[2];

if (!port) {
  console.error('错误：请指定端口号，如：node kill-port.js 3000');
  process.exit(1);
}

function killProcess(pid) {
  return new Promise((resolve, reject) => {
    let cmd = '';

    // Windows
    if (process.platform === 'win32') {
      cmd = `taskkill /PID ${pid} /F`;
    } else {
      // macOS / Linux
      cmd = `kill -9 ${pid}`;
    }

    exec(cmd, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

function findProcessOnPort(port) {
  return new Promise((resolve, reject) => {
    let cmd = '';

    // Windows
    if (process.platform === 'win32') {
      cmd = `netstat -ano | findstr :${port}`;
    } else {
      // macOS / Linux
      cmd = `lsof -i :${port} | grep LISTEN`;
    }

    exec(cmd, (err, stdout) => {
      if (err) return resolve(null); // 没有占用
      if (!stdout) return resolve(null);

      let pid = null;

      if (process.platform === 'win32') {
        // 输出格式类似：TCP 0.0.0.0:3000 ... PID
        const parts = stdout.trim().split(/\s+/);
        pid = parts[parts.length - 1];
      } else {
        // 输出格式类似：node 1234 user ... TCP *:3000 (LISTEN)
        const parts = stdout.trim().split(/\s+/);
        pid = parts[1];
      }

      resolve(pid);
    });
  });
}

(async () => {
  console.log(`正在检查端口 ${port} 是否被占用...`);

  const pid = await findProcessOnPort(port);

  if (!pid) {
    console.log(`端口 ${port} 未被占用。`);
    process.exit(0);
  }

  console.log(`端口 ${port} 正被 PID=${pid} 的进程占用。准备结束它...`);

  try {
    await killProcess(pid);
    console.log(`成功结束 PID=${pid}。`);
  } catch (err) {
    console.error('结束进程失败：', err.message);
  }
})();
