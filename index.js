const dotenv = require('dotenv');
const moment = require('moment');
const { IncomingWebhook } = require('@slack/client');

// set env variables
dotenv.config();

const github = require('./github');

const app = async () => {
    const pulls = await github.getPulls();
    
    const attachments = pulls.map(pull => {
        const reviewers = pull.reviewers.map(reviewer => `@${reviewer}`).join(', ');
        const createdAt = moment(pull.created_at);
        const days = moment().diff(createdAt, 'days');
        let color = 'warning';

        if (days < 3) {
            color = 'good';
        } else if (days > 5) {
            color = 'danger';
        }

        const reviewersText = reviewers.length > 0
            ? `Reviewers: ${reviewers}`
            : `No reviewers assigned. :exclamation:`;

        return {
            color,
            title: pull.title,
            title_link: pull.link,
            text: `${createdAt.fromNow()} - ${reviewersText}`,
        }
    });
    
    const webhook = new IncomingWebhook(process.env.SLACK_WEBHOOK_URL);

    webhook.send({
        text: 'Hello again, I think you guys have work to do.',
        attachments,
        link_names: true,
    });
};

app();