import styles from './Google.module.css'
import {Content} from "../pages";

export interface GoogleContent extends Content {
    results: Array<OrganicResult>;
}

interface OrganicResult {
    position: number;
    title: string;
    link: string;
    displayed_link: string;
    snippet: string;
}

export async function querySerpAPI(url: URL): Promise<GoogleContent> {
    const SerpApi = require('google-search-results-nodejs')
    const search = new SerpApi.GoogleSearch(process.env.NEXT_PUBLIC_SERP_API_KEY as string)

    const result = await new Promise<any>((resolve, reject) => {
        search.json({
            q: url.searchParams.get("q"),
            location: url.searchParams.get("location")
        }, (test: string) => {
            resolve(test)
        })
    });

    return {
        host: "google",
        results: result.organic_results as Array<OrganicResult>
    }
}

export function Google(content: GoogleContent): JSX.Element {
    return <div className={styles.zero_margin} key="google">
        {content.results.map(r => <><a href={r.link}>{r.title}</a><br></br></>)}
    </div>
}

