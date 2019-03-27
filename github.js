const Octokit = require('@octokit/rest');

const github = new Octokit({
    auth: `token ${process.env.GITHUB_TOKEN}`,
});

const getPulls = async () => {
    const { data } = await github.pulls.list({
        owner: process.env.GITHUB_OWNER,
        repo: process.env.GITHUB_REPO,
    });

    return data.map(pull => {
        return {
            title: pull.title,
            link: pull.html_url,
            created_at: pull.created_at,
            reviewers: pull.requested_reviewers.map(reviewer => reviewer.login),
        };
    });
};

module.exports = {
    getPulls,
};