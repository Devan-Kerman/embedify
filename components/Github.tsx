import styles from './Google.module.css'
import {Content} from "../pages";
import {Octokit} from "@octokit/core";

export interface GitContent extends Content {
    full_name: string;
    description: string | null;
    stars: number;
    watchers: number;
    forks: number;
    html_url: string;
}

export interface OrganicResult {
    position: number,
    title: string,
    link: string,
    displayed_link: string,
    snippet: string,
}

export async function queryGithubAPI(url: URL): Promise<GitContent> {
    const pathname = url.pathname;

    const octokit = new Octokit({
        auth: process.env.NEXT_PUBLIC_GITHUB_API_KEY as string
    })

    const seperator = pathname.indexOf("/", 1);
    const owner = pathname.substring(1, seperator);
    const repo = pathname.substring(seperator+1);

    const result = await octokit.request('GET /repos/{owner}/{repo}', {owner, repo})
    return {
        host: 'github',
        full_name: result.data.full_name,
        description: result.data.description,
        stars: result.data.stargazers_count,
        watchers: result.data.watchers_count,
        forks: result.data.forks_count,
        html_url: result.data.html_url
    }
}

export function Github(content: GitContent): JSX.Element {
    return <div className={styles.zero_margin} key="github">
        <h1><a href={content.html_url}>{content.full_name}</a></h1>
        <table>
            <tr>
                <td>
                    Description:
                </td>
                <td>
                    {content.description}
                </td>
            </tr>
        </table>
    </div>
}

