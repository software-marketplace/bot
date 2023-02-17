import { Probot } from "probot";
import fetch from 'node-fetch';

export = (app: Probot) => {
    app.on("issues.opened", async (context) => {
        const issueComment = context.issue({
            body: "Thanks for opening this issue!",
        });
        await context.octokit.issues.createComment(issueComment);
    });

    app.on("push", async (context) => {
        // get config file
        const response: any = await context.octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
            owner: context.payload.repository.owner.login,
            repo: context.payload.repository.name,
            path: "/.marketplace.yaml"
        })
        if (response.status === 200) {
            const data = {
                config: JSON.parse(Buffer.from(response.data.content, 'base64').toString('utf-8')),
                builtBy: context.payload.repository.owner.login,
                repository: context.payload.repository.name
            }

            // context.log.debug(response.data.content)
            context.log.debug(JSON.stringify(data))
            // const res = await fetch('https://dev-smp.loca.lt/webhooks/config', {
            const res = await fetch('http://35.200.227.193/webhooks/config', {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json"
                }
            })
            context.log.debug(res.status.toString())
            // context.log.debug(response.data.content)
        }
        // app.log.debug("out")
        // context.log.debug(configFile)
    });
    // For more information on building apps:
    // https://probot.github.io/docs/

    // To get your app running against GitHub, see:
    // https://probot.github.io/docs/development/
};
