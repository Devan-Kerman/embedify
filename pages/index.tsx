import {useRouter} from "next/router";

import {NextPageContext} from "next";
import {AppProps} from "next/app";
import {getURL} from "../src/util";
import {Octokit} from "@octokit/core";


export async function getServerSideProps(context: NextPageContext) {
  const href = context.req?.url!;
  const testUrl = new URL("https://example.com/" + href.substring(1));
  const url = new URL("https://" + testUrl.searchParams.get("url")!);

  if(url.hostname === 'google.com') {
    const SerpApi = require('google-search-results-nodejs')
    const search = new SerpApi.GoogleSearch(process.env.NEXT_PUBLIC_SERP_API_KEY as string)

    const result = await new Promise<string>((resolve, reject) => {
      search.json({
        q: url.searchParams.get("q"),
        location: url.searchParams.get("location")
      }, (test: string) => {
        resolve(test)
      })
    }).then((raw) => JSON.stringify(raw));

    return {
      props: {
        google: result
      }
    };
  } else if(url.hostname === 'github.com') {
    const pathname = url.pathname;

    const octokit = new Octokit({
      auth: process.env.NEXT_PUBLIC_SERP_API_KEY as string
    })

    const result = await octokit.request('GET /repos/{owner}/{repo}', {
      owner: 'OWNER',
      repo: 'REPO'
    })

    return {
      props: {
        github: "test"
      }
    }
  }
}

export default function Home({google}): JSX.Element {
  if(google) {
    const message = JSON.parse(google).organic_results;
    console.log(message)
  }
  return (<>Hello worlds! {google}</>);
}
