import {
  FileBox,
  log,
  Message,
  UrlLink,
}                   from 'wechaty'

import {
  simpleQnAMaker,
}                   from 'simple-qnamaker'

const qa = simpleQnAMaker({
  endpointKey    : 'bc138303-260a-42fa-b4d4-3d69db88922d',
  host           : 'https://juzibot-investment.azurewebsites.net/qnamaker',
  knowledgeBaseId: '51762d0d-96b0-4888-82f3-a0230bbb8b3d',
})

export async function jiaruiBot (msg: Message) {
  console.info('Jiarui Bot begin to work')
  const text = msg.text()

  // introduce 句子互动
  if (/句子互动/.test(text)) {

    const intro = `句子互动围绕微信生态为客户提供智能营销和销售服务，帮助企业引流并实现转化，客户覆盖教育、保险、大健康等多个领域。获得PreAngel、Plug and Play，Y Combination, TSVC和阿尔法公社多家中美机构投资。曾入选百度AI加速器和 Facebook 大陆首期加速器`

    const companyLink = new UrlLink({
      description : 'Salesforce for Social Network，专业的微信生态 SCRM 提供商，YC China 首期入选创业公司 (YC W19)',
      thumbnailUrl: 'https://pre-angel.com/assets/portfolios/juzibot/icon.png',
      title       : '句子互动',
      url         : 'https://pre-angel.com/portfolios/juzibot/',
    })

    await msg.say(intro)
    await msg.say('更多详细信息可以点击查看下面的链接：')
    await msg.say(companyLink)
    return
  }

  // introduce 李佳芮
  if (/李佳芮/.test(text)) {
    const intro = `李佳芮，句子互动创始人，连续创业者，微软人工智能最有价值专家（AI MVP），GitHub 7000+ Stars开源项目Wechaty作者，创建并管理了覆盖全球的微信聊天机器人开发者社区，《Chatbot从0到1：对话式交互设计指南》作者。

    句子互动围绕微信生态为客户提供智能营销和销售服务，帮助企业引流并实现转化，客户覆盖教育、保险、大健康等多个领域。获得PreAngel、Plug and Play，Y Combination, TSVC和阿尔法公社多家中美机构投资。曾入选百度AI加速器和 Facebook 大陆首期加速器`

    const ruiLink = new UrlLink({
      description : '句子互动创始人 & CEO，连续创业者，《Chatbot 从0到1》作者，微软人工智能最具价值专家 (AI MVP)',
      thumbnailUrl: 'https://pre-angel.com/assets/peoples/jiarui-li/avatar.png',
      title       : '李佳芮',
      url         : 'https://pre-angel.com/peoples/jiarui-li/',
    })

    await msg.say(intro)
    await msg.say('更多详细信息可以点击查看下面的链接：')
    await msg.say(ruiLink)
    return
  }

  // introduce juzibot product
  if (/产品介绍/.test(text)) {

    const productLink = 'https://s3.cn-north-1.amazonaws.com.cn/xiaoju-material/public/rc-upload-1588329077509-2_1588329107373_juzi-wechat-work.pdf'
    // const videoLink = 'https://s3.cn-northwest-1.amazonaws.com.cn/xiaoju-message-payload-bucket/message/5eabfde2902dac007ce66162/1588330824050/5943444666822877866_wxid_5zj4i5htp9ih22_1588330818028_.mp4'

    await msg.say('这是我们的产品介绍：')
    await msg.say(FileBox.fromUrl(productLink, '句子互动企业微信SCRM介绍.pdf'))
    // await msg.say('这是我们简单的产品演示视频')
    // await msg.say(FileBox.fromUrl(videoLink))

    return
  }

  // Call QnAMaker, answer valuation questions
  const answer = await qa(msg.text())

  // match valuation questions
  if (answer.length > 0) {

    // send qa result
    await msg.say(answer[0].answer)

    // send bp if have
    if (process.env.BP_LINK) {
      await msg.say('这是我们的BP，请查收')
      await msg.say(FileBox.fromUrl(process.env.BP_LINK, '句子互动BP.pdf'))
    }

  } else {
    // cannot answer the questions
    await msg.say('你的问题超出了我的能力范围，请联系我的老板李佳芮~')
    const lijiarui = msg.wechaty.Contact.load('qq512436430')
    if (lijiarui) {
      await msg.say(lijiarui)
    }
  }
  log.info('done qnamaker')
}