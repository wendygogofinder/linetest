require('dotenv').config()
const linebot = require('linebot')// 引用套件
const rp = require('request-promise')

const callAPI = async (name) => {
  let data = ''
  try {
    const str = await rp('https://cloud.culture.tw/frontsite/trans/SearchShowAction.do?method=doFindTypeJ&category=6')
    let json = JSON.parse(str)
    json = json.filter(j => {
      return j.sourceWebName === name
    })
    if (json.length === 0) data = '找不到資料'
    else data = json[0]
  } catch (error) {
    // console.log(error.message)
    data = '發生錯誤'
  }
  return data
}

const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})
// 環境設定ID、Secret、AccessToken  process.env.讀取.env環境變數 資料不會直接顯示
// .listen('路徑',port,啟動時的function)
bot.listen('/', process.env.PORT, () => {
  console.log('機器人已啟動')
})

bot.on('message', event => {
  if (event.message.type === 'text') {
    const usermsg = event.message.text
    callAPI(usermsg).then(result => {
      // console.log(result)
      if (result.substr(0, 5) === 'https') {
        event.reply({
          type: 'image',
          originalContentUrl: result,
          previewImageUrl: result
        })
      } else event.reply(result)
    }).catch(() => {
      event.reply('發生錯誤')
    })
  }
})
