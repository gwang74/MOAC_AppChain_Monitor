
const Chain3 = require('chain3');
const schedule = require('node-schedule');
const logger = require('./logger');
const nodemailer = require("nodemailer");
const initConfig = require('../config/initConfig.json');


var chain3 = new Chain3();
var vnodes = initConfig.vnodeUri;
var mintSchedule;

// 监控应用链异常
monitor();

return

function monitor() {
    var rule = new schedule.RecurrenceRule();
    // rule.minute = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58];
    rule.minute = [0, 10, 20, 30, 40, 50];
    mintSchedule = schedule.scheduleJob(rule, function () {
        peerCount();
    });
}

async function peerCount() {
    for (let i = 0, length = vnodes.length; i < length; i++) {
        let vnode = vnodes[i];
        chain3.setProvider(new chain3.providers.HttpProvider(vnode));
        let peerCount = chain3.net.peerCount;
        if (peerCount <= initConfig.minPeerCount) {
            logger.info('异常!');
            logger.info('vnode____:', vnode);
            logger.info('peerCount____:', peerCount)
            await sendEMail(vnode);
            mintSchedule.cancel();
            return
        }
    }
    logger.info('正常!');
}

// async..await is not allowed in global scope, must use a wrapper
async function sendEMail(vnode) {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: initConfig.stmpHost,
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: initConfig.user, // generated ethereal user
            pass: initConfig.pwd // generated ethereal password
        }
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: initConfig.user, // sender address
        to: initConfig.to, // list of receivers
        subject: "应用链异常！", // Subject line
        text: "您好！发现VNODE【" + vnode + "】peerCount值异常，请及时处理！", // plain text body
        // html: "<b>Hello world?</b>" // html body
    });

    // logger.info("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    // logger.info("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}


