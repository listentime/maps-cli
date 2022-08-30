const downloadGit = require('download-git-repo')
const ora = require('ora')
const inquirer = require('inquirer')
const fs = require('fs')
const chalk = require('chalk')
const logSymbols = require('log-symbols')

module.exports = async (agr) => {
  let tplName = agr[0]
  let projectName = agr[1] || 'mini-active-project'
  let q = [
    {
      name: "description",
      message: '请输入项目描述:'
    }]
  //本地不存在同名目录
  if (!fs.existsSync(projectName)) {
    // 可选式交互
    if(tplName === 'vite-react-ts-tpl'){
      q.unshift({        
        name: "router",
        message: '输入taro路由:'        
      })
    }
    inquirer.prompt(q).then(async (answer) => {
      // 显示loading动画
      let loading = ora('下载模版文件中...')
      loading.start()
      // 拉取远程模版
      let downTplFromGit = async (tplName, projectName) => {
        let gitUrl = `github:listentime/${tplName}`
        console.log(gitUrl)
        // let gitUrl = `direct:http://192.168.80.65:5952/listen/${tplName}/archive/master.zip`
        return new Promise((resolve, reject) => {
          downloadGit(gitUrl, projectName, (err) => {
            if (err) {
              reject(err);
            }
            resolve();
          });
        });
      }
      downTplFromGit(tplName, projectName).then(() => {
        loading.succeed()
        const targetName = `${projectName}/package.json`;
        const configName = tplName === 'mini-pages-tpl' ? `${projectName}/rollup.config.js` : `${projectName}/vite.config.ts`
        const routerName = `${projectName}/src/route/router.tsx`
        const droneName = `${projectName}/.drone.yml`
        //修改项目文件夹中 package.json 文件
        if (fs.existsSync(targetName)) {
          const data = fs.readFileSync(targetName).toString();
          let json = JSON.parse(data);
          json.name = projectName;
          json.author = answer.author;
          json.description = answer.description;
          fs.writeFileSync(targetName, JSON.stringify(json, null, '\t'), 'utf-8');
          console.log(logSymbols.success, chalk.green('项目初始化完成!'));
        }
        //修改打包输出文件地址
        if(fs.existsSync(configName)) {
          const data = fs.readFileSync(configName).toString('utf-8')
          fs.writeFileSync(configName,data.replace(/xx/g,answer.router),'utf-8')
        }
        //修改默认路由
        if(fs.existsSync(routerName)){
          const data = fs.readFileSync(routerName).toString('utf-8')
          fs.writeFileSync(routerName,data.replace(/xx/g,`microActivity/${answer.router}`),'utf-8')
        }
        if(fs.existsSync(droneName)){
          const data = fs.readFileSync(droneName).toString('utf-8')
          fs.writeFileSync(droneName,data.replace(/xx/g,`${answer.router}`),'utf-8')
        }
      }, (err) => {
        // console.log(err)
        if (err.statusCode === 404) {
          loading.fail()
          console.log(`${logSymbols.error}${chalk.red('不存在的模版文件，请联系开发者')}`)
        }
      })
    })
  } else {
    console.log(`${logSymbols.error}${chalk.red('项目已存在')}`)
  }

}