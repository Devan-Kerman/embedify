import {NextPageContext} from "next";
import {Octokit} from "@octokit/core";
import {Google, GoogleContent, querySerpAPI} from "../components/Google";
import {Github, GitContent, OrganicResult, queryGithubAPI} from "../components/Github";

export interface Content {
  host: string | undefined
}

export async function getServerSideProps(context: NextPageContext) {
  const href = context.req?.url!;
  const testUrl = new URL("https://example.com/" + href.substring(1));
  const url = new URL("https://" + testUrl.searchParams.get("url")!);

  let content: Content;
  if(url.hostname === 'google.com') {
    content = await querySerpAPI(url);
  } else if(url.hostname === 'github.com') {
    content = await queryGithubAPI(url);
  } else {
    content = { host: undefined };
  }

  let value = {}
  Object.assign(value, content)
  return {
    props: value
  }
}

export default function Home(context: Content): JSX.Element {
  if(context.host == 'google') {
    return <Google { ...(context as GoogleContent) } ></Google>
  } else if(context.host == 'github') {
    return <Github { ...(context as GitContent) } ></Github>
  }
  return (<>Unknown Website!</>);
}
